const mappings = require('./mappings.cjs');

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const sizeKeys = ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight", "top", "left", "right", "bottom"];
  const spaceKeys = ["margin", "padding", "gap", "marginLeft", "marginRight", "marginTop", "marginBottom", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"];
  const borderRadiusKeys = ["borderRadius", "borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"];

  // Remove Box from imports
  root.find(j.ImportDeclaration)
    .forEach(path => {
      if (path.node.source.value === '@tokens-studio/ui' || path.node.source.value === '@tokens-studio/ui/Box.js') {
        if (path.node.specifiers.length === 1 && path.node.specifiers[0].imported.name === 'Box') {
          // If Box is the only import, remove the entire import declaration
          j(path).remove();
        } else if (path.node.source.value === '@tokens-studio/ui') {
          // Otherwise just remove Box from the imports
          path.node.specifiers = path.node.specifiers.filter(
            specifier => specifier.imported.name !== 'Box'
          );
        }
      }
    });

  // Transform Box components to div elements or the element specified in 'as' prop
  root.find(j.JSXElement, {
    openingElement: { name: { name: 'Box' } }
  }).forEach(path => {
    const attributes = path.node.openingElement.attributes;
    const asAttr = attributes.find(attr => 
      attr.type === 'JSXAttribute' && 
      attr.name.name === 'as'
    );

    // Set element name based on 'as' prop or default to div
    const elementName = asAttr?.value?.value || 'div';
    
    // Remove the 'as' attribute if it exists
    if (asAttr) {
      path.node.openingElement.attributes = attributes.filter(attr => 
        attr.type !== 'JSXAttribute' || attr.name.name !== 'as'
      );
    }

    path.node.openingElement.name.name = elementName;
    if (path.node.closingElement) {
      path.node.closingElement.name.name = elementName;
    }
  });

  // Transform Button and IconButton variant props to emphasis or appearance
  root.find(j.JSXElement, {
    openingElement: {
      name: {
        name: (name) => name === 'Button' || name === 'IconButton'
      }
    }
  }).forEach(path => {
    const attributes = path.value.openingElement.attributes;
    const variantAttr = attributes.find(attr => 
      attr.type === 'JSXAttribute' && 
      attr.name.name === 'variant'
    );

    if (variantAttr) {
      const variantValue = variantAttr.value.value;
      
      if (variantValue === 'danger') {
        // Transform danger variant to appearance
        variantAttr.name.name = 'appearance';
        variantAttr.value.value = 'danger';
      } else {
        let emphasisValue;
        switch (variantValue) {
          case 'primary':
            emphasisValue = 'high';
            break;
          case 'invisible':
            emphasisValue = 'low';
            break;
          case 'secondary':
            emphasisValue = 'medium';
            break;
          default:
            return;
        }

        // Replace variant with emphasis
        variantAttr.name.name = 'emphasis';
        variantAttr.value.value = emphasisValue;
      }
    }
  });

  // Helper function to transform CSS values
  const transformCSSValue = (value, keyName) => {
    if (typeof value !== 'string') return value;
    
    // Handle calc expressions
    if (value.includes('calc(')) {
      return value.replace(/var\((--[^)]+)\)/g, (match, token) => {
        if (keyName === 'fontSize') {
          return `var(${mappings.fontSize[token] || token})`;
        } else if (keyName === 'boxShadow') {
          return `var(${mappings.boxShadow[token] || token})`;
        } else if (sizeKeys.includes(keyName)) {
          return `var(${mappings.sizes[token] || token})`;
        } else if (borderRadiusKeys.includes(keyName)) {
          return `var(${mappings.borderRadius[token] || token})`;
        } else if (spaceKeys.includes(keyName)) {
          return `var(${mappings.spaces[token] || token})`;
        } else {
          return `var(${mappings.colors[token] || token})`;
        }
      });
    }
    
    const transformPart = (part) => {
      if (keyName === 'fontSize') {
        return mappings.fontSize[part] || part;
      } else if (keyName === 'boxShadow') {
        return mappings.boxShadow[part] || part;
      } else if (sizeKeys.includes(keyName)) {
        return mappings.sizes[part] || part;
      } else if (borderRadiusKeys.includes(keyName)) {
        return mappings.borderRadius[part] || part;
      } else if (spaceKeys.includes(keyName)) {
        return mappings.spaces[part] || part;
      } else {
        return mappings.colors[part] || part;
      }
    };

    return value.split(' ').map(transformPart).join(' ');
  };

  // Find all object properties in CSS objects and replace tokens
  root.find(j.ObjectExpression).forEach(path => {
    path.node.properties.forEach(prop => {
      if (!prop.key || !prop.value) return;

      const keyName = prop.key.name || prop.key.value;

      // Handle string literals
      if (prop.value.type === 'StringLiteral') {
        prop.value.value = transformCSSValue(prop.value.value, keyName);
      }
      // Handle conditional expressions (ternaries)
      else if (prop.value.type === 'ConditionalExpression') {
        if (prop.value.consequent.type === 'StringLiteral') {
          prop.value.consequent.value = transformCSSValue(prop.value.consequent.value, keyName);
        }
        if (prop.value.alternate.type === 'StringLiteral') {
          prop.value.alternate.value = transformCSSValue(prop.value.alternate.value, keyName);
        }
      }
      // Handle template literals
      else if (prop.value.type === 'TemplateLiteral') {
        prop.value.quasis.forEach(quasi => {
          if (quasi.type === 'TemplateElement') {
            quasi.value.raw = transformCSSValue(quasi.value.raw, keyName);
            quasi.value.cooked = transformCSSValue(quasi.value.cooked, keyName);
          }
        });
      }
    });
  });

  // Find all JSX attributes with css prop and merge with or replace style
  root.find(j.JSXAttribute, {
    name: {
      name: 'css'
    }
  }).forEach(path => {
    const existingStyle = path.parent.node.attributes.find(attr => 
      attr.name && attr.name.name === 'style'
    );

    if (existingStyle) {
      // If style exists, merge the css value into it
      if (existingStyle.value.type === 'JSXExpressionContainer' && 
          path.node.value.type === 'JSXExpressionContainer') {
        // Create a spread of both style objects
        existingStyle.value.expression = j.objectExpression([
          j.spreadElement(existingStyle.value.expression),
          j.spreadElement(path.node.value.expression)
        ]);
      }
      // Remove the css prop since we merged it
      path.parent.node.attributes = path.parent.node.attributes.filter(attr =>
        !(attr.name && attr.name.name === 'css')
      );
    } else {
      // If no style exists, just rename css to style
      path.node.name.name = 'style';
    }
  });

  return root.toSource();
}

module.exports.parser = 'tsx';