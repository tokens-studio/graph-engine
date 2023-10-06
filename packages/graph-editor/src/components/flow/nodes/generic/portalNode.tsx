import { Stack } from '@tokens-studio/ui';
import { Handle, HandleContext } from '../../handles.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/generic/passthrough.js';
import React from 'react';
import { Position, Handle as RawHandle } from 'reactflow';

import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';

const PortalNode = () => {
  const { input, output } = useNode();
  return (
    <Stack direction="row" gap={4}>
      <HandleContext.Provider
        value={{ type: 'target', position: Position.Left }}
      >
        <Handle id="input"></Handle>
      </HandleContext.Provider>
      <HandleContext.Provider
        value={{ type: 'source', position: Position.Right }}
      >
        <Handle id="output"></Handle>
      </HandleContext.Provider>
    </Stack>
  );
};

const wrapper = ({ children }) => {
  return <>{children}</>;
};

export default WrapNode(PortalNode, {
  ...node,
  wrapper,

  clear: true,
});
