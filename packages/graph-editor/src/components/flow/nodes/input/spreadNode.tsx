import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/input/spread.js';
import React, { useMemo } from 'react';

const SpreadNode = () => {
  const { output } = useNode();

  const outputs = useMemo(() => {
    return Object.entries(output || {}).map(([key, value]) => {
      return (
        <Handle id={key} key={key}>
          <Text>{key}</Text>
          <PreviewAny value={value} />
        </Handle>
      );
    });
  }, [output]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="input">
          <Text>Input</Text>
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        {/* This is a horrible hack because of a weird bug in reactflow when there is a single handle with the spread node*/}
        <div style={{ opacity: 0 }}>
          <Handle id="" />
        </div>
        {outputs}
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(SpreadNode, {
  ...node,
  title: 'Spread',
});
