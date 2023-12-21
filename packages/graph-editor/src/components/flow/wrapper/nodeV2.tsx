import { Node } from './node.tsx';
import type {
  Node as GraphNode,
  Input,
  Output,
} from '@tokens-studio/graph-engine';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useDispatch } from '@/hooks/useDispatch.ts';
import { Box, Stack } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../handles.tsx';
import { useGraph } from '@/context/GraphContext.tsx';

export type UiNodeDefinition = {
  //Name of the Node
  title?: string;
  // Whether to support custom rendering by specifying a component
  wrapper?: React.FC;
  icon?: React.ReactNode;
};

export type WrappedNodeDefinition = {
  type: string;
  state: Record<string, any>;
  component: React.ReactNode | React.FC;
};

/**
 * Note that the output is always an object, so we use stringification to compare it for equality
 * @param InnerNode
 * @param nodeDef
 * @returns
 */
export const NodeV2 = (args) => {
  const { id, data } = args;
  const graph = useGraph();
  const node = graph.getNode(id);

  if (!node) {
    return <Box>Node not found</Box>;
  }

  return <NodeWrap node={node} />;
};

export interface INodeWrap {
  node: GraphNode;
}
const NodeWrap = observer(({ node }: INodeWrap) => {
  const dispath = useDispatch();

  return (
    <Node
      id={node.id}
      isAsync={node.isRunning}
      // icon={nodeDef.icon}
      title={node.factory.title || 'Node'}
      error={null}
      controls={''}
    >
      <Stack direction="column" gap={2}>
        <Stack direction="row" gap={2}>
          <Inputs ports={node.inputs} />
          <Outputs ports={node.outputs} />
        </Stack>
      </Stack>
      {/* <Node /> */}

      {/* <NodeToolbar>
          <Sidesheet title={nodeDef.title}>{settingsContent}</Sidesheet>
        </NodeToolbar> */}
    </Node>
  );
});

export interface IInputs {
  ports: Record<string, Input>;
}
export const Inputs = observer(({ ports }: IInputs) => {
  const entries = Object.values(ports).sort();
  return (
    <HandleContainer type="target" full>
      {entries.map((input) => (
        <InputHandle port={input} />
      ))}
    </HandleContainer>
  );
});

export interface IOutputs {
  ports: Record<string, Output>;
}
export const Outputs = observer(({ ports }: IOutputs) => {
  const entries = Object.values(ports)
    .sort()
    .filter((x) => x.visible);
  return (
    <HandleContainer type="source" full>
      {entries.map((input) => (
        <Handle id={input.name} key={input.name}>
          {input.name}
        </Handle>
      ))}
    </HandleContainer>
  );
});

const InputHandle = observer(({ port }: { port: Input }) => {
  if (!port.visible) return null;

  return <Handle id={port.name}>{port.name}</Handle>;
});
