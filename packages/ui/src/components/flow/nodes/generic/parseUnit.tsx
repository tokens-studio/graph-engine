import { Label, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/typing/parseUnit.js';
import { PreviewAny } from '../../preview/any.tsx';
const ParseUnit = (props) => {
  const { input, output } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="input">
          <Label>Input</Label>
          <Text>{input.input}</Text>
        </Handle>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id="number">
          <Label>Number</Label>
          <PreviewAny value={output?.number} />
        </Handle>
        <Handle id="unit">
          <Label>Unit</Label>
          <PreviewAny value={output?.unit} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ParseUnit, {
  ...node,
  title: 'Parse Unit',
});
