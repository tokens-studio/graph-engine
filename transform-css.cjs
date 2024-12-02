// transform.cjs
const fs = require("fs");
const postcss = require("postcss");
const glob = require("glob");
const tokenMapping = require("./mappings.cjs");

const sizeKeys = [
  "width",
  "height", 
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "min-width",
  "min-height",
  "max-width",
  "max-height"
];

const spaceKeys = [
  "margin",
  "padding",
  "gap",
  "columnGap",
  "rowGap",
  "column-gap", 
  "row-gap",
  "marginLeft",
  "marginRight",
  "marginTop",
  "marginBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "paddingBottom",
  "margin-left",
  "margin-right",
  "margin-top",
  "margin-bottom",
  "padding-left",
  "padding-right",
  "padding-top",
  "padding-bottom",
  "right",
  "left", 
  "top",
  "bottom"
];

const borderRadiusKeys = [
  "borderRadius",
  "borderTopLeftRadius",
  "borderTopRightRadius", 
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "border-radius",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
];

const transformPlugin = {
  postcssPlugin: "Transform Plugin",
  
  // Add AtRule handler for @import
  AtRule: {
    import(atRule) {
      // Skip processing @import rules
      return;
    }
  },

  Declaration(decl) {
    try {
      let value = decl.value;

      // Skip if the declaration is within an @import rule
      if (decl.parent.type === 'atrule' && decl.parent.name === 'import') {
        return;
      }

      // Pre-process calc() functions to handle nested var() calls
      if (value.includes('calc(')) {
        value = value.replace(
          /calc\(([\s\S]*?)\)/g,
          (match, calcContent) => {
            // Normalize calc content by removing newlines and extra spaces
            const normalizedCalc = calcContent
              .replace(/\n/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();

            // Transform var() calls within calc()
            return `calc(${normalizedCalc.replace(/var\((--[^)]+)\)/g, (match, token) => {
              if (decl.prop === "font-size") {
                return `var(${tokenMapping.fontSize[token] || token})`;
              } else if (decl.prop === "box-shadow") {
                return `var(${tokenMapping.boxShadow[token] || token})`;
              } else if (sizeKeys.includes(decl.prop)) {
                return `var(${tokenMapping.sizes[token] || token})`;
              } else if (borderRadiusKeys.includes(decl.prop)) {
                return `var(${tokenMapping.borderRadius[token] || token})`;
              } else if (spaceKeys.includes(decl.prop)) {
                return `var(${tokenMapping.spaces[token] || token})`;
              } else {
                return `var(${tokenMapping.colors[token] || token})`;
              }
            })})`;
          }
        );
      }

      if (decl.prop === "font-size") {
        decl.value = tokenMapping.fontSize[value] || value;
      } else if (decl.prop === "box-shadow") {
        decl.value = tokenMapping.boxShadow[value] || value;
      } else if (sizeKeys.includes(decl.prop)) {
        decl.value = value
          .split(" ")
          .map((part) => tokenMapping.sizes[part] || part)
          .join(" ");
      } else if (borderRadiusKeys.includes(decl.prop)) {
        decl.value = value
          .split(" ")
          .map((part) => tokenMapping.borderRadius[part] || part)
          .join(" ");
      } else if (spaceKeys.includes(decl.prop)) {
        decl.value = value
          .split(" ")
          .map((part) => tokenMapping.spaces[part] || part)
          .join(" ");
      } else {
        decl.value = value
          .split(" ")
          .map((part) => {
            return tokenMapping.colors[part.trim()] || part.trim();
          })
          .join(" ");
      }
    } catch (err) {
      console.error(`Error processing declaration ${decl.prop}:`, err);
      throw err;
    }
  },
};

const plugins = [transformPlugin];
const processor = postcss(plugins);

const transform = async () => {
  try {
    console.log("Starting CSS transformation...");
    const files = glob.sync("./**/*.css", {
      ignore: [
        "**/node_modules/**/*.css",
        "./node_modules/**",
        "**/dist/**",
        "**/.next/**"
      ],
      absolute: true
    });

    // Additional safety check
    const filteredFiles = files.filter(file => !file.includes('node_modules'));
    
    console.log(`Found ${filteredFiles.length} CSS files to process`);
    console.log("Files to process:", filteredFiles);

    const filePromises = filteredFiles.map(async (file) => {
      try {
        const contents = fs.readFileSync(file).toString();

        const result = await processor.process(contents, { 
          from: file,
          to: file,
          map: false // Disable source maps to avoid additional complexity
        });

        fs.writeFileSync(file, result.css);
        console.log(`Processed ${file} successfully`);
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
        console.error('File contents:', fs.readFileSync(file).toString());
        throw err;
      }
    });

    await Promise.all(filePromises);
    console.log("CSS transformation completed successfully");
  } catch (err) {
    console.error("Error during transformation:", err);
    if (err instanceof Error) {
      console.error("Stack trace:", err.stack);
    }
    process.exit(1);
  }
};

transform().catch((err) => {
  console.error("Unhandled error during transformation:", err);
  process.exit(1);
});
