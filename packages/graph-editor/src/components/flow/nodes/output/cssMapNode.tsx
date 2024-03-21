import { Button, Label, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { sentenceCase } from 'sentence-case';
import React, { useCallback, useMemo } from 'react';

import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/css/map.js';
//Curated list of commont properties
const keys = [
  'animation',
  'aspectRatio',
  'align-items',
  'backdrop-filter',
  'background',
  'background-blend-mode',
  'border',
  'borderBottom',
  'borderColor',
  'borderImage',
  'borderInline',
  'borderLeft',
  'borderRadius',
  'borderRight',
  'borderSpacing',
  'borderStyle',
  'borderTop',
  'borderWidth',
  'bottom',
  'boxShadow',
  'boxSizing',
  'clip',
  'clipPath',
  'color',
  'contain',
  'content',
  'cursor',
  'direction',
  'display',
  'flex',
  'flexBasis',
  'flexDirection',
  'flexFlow',
  'flexGrow',
  'flexShrink',
  'flexWrap',
  'float',
  'font',
  'fontDisplay',
  'fontFamily',
  'fontSize',
  'fontStretch',
  'fontStyle',
  'fontWeight',
  'gap',
  'height',
  'justify-content',
  'left',
  'letterSpacing',
  'lineBreak',
  'lineHeight',
  'listStyle',
  'listStyleImage',
  'listStylePosition',
  'listStyleType',
  'margin',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'mask',
  'maskType',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'mixBlendMode',
  'opacity',
  'outline',
  'overflow',
  'overflowX',
  'overflowY',
  'padding',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'pointer-events',
  'position',
  'right',
  'rotate',
  'src',
  'stroke',
  'textAlign',
  'textTransform',
  'textDecoration',
  'top',
  'transform',
  'transition',
  'translate',
  'userSelect',
  'verticalAlign',
  'visibility',
  'whiteSpace',
  'width',
  'wordBreak',
  'wordSpacing',
  'wordWrap',
  'x',
  'y',
  'zIndex',
];

const CssMapNode = (props) => {
  const { input } = useNode();
  const [hideMissing, setHideMissing] = React.useState(false);
  const handles = useMemo(() => {
    return keys
      .map((x) => {
        if (hideMissing && input[x] === undefined) return null;

        return (
          <Handle id={x} key={x}>
            <Label>{sentenceCase(x)}</Label>
            <Text
              css={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '300px',
                whiteSpace: 'nowrap',
              }}
            >
              {input[x]}
            </Text>
          </Handle>
        );
      })
      .filter((x) => x !== null);
  }, [hideMissing, input]);

  const toggleDefined = useCallback(() => {
    setHideMissing(!hideMissing);
  }, [hideMissing]);

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" gap={4} justify="between">
        <span></span>
        <HandleContainer type="source">
          <Handle id="output">
            <Text>Output</Text>
          </Handle>
        </HandleContainer>
      </Stack>

      <HandleContainer type="target" full>
        {handles}
      </HandleContainer>
      <Button onClick={toggleDefined}>Toggle Defined</Button>
    </Stack>
  );
};

export default WrapNode(CssMapNode, {
  ...node,
  title: 'Css Map',
});
