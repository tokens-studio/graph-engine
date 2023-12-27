import { Node } from './node.tsx';
import type { Node as GraphNode } from '@tokens-studio/graph-engine';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Box, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../handles.tsx';
import { COLOR, CURVE, Port } from '@tokens-studio/graph-engine';
import colors from '@/tokens/colors.ts';
import { BezierIcon } from '@/components/icons/BezierIcon.tsx';
import { ColorWheelIcon } from '@radix-ui/react-icons';
import { useGraph } from '@/hooks/useGraph.ts';
import { useSelector } from 'react-redux';
import { inlineTypes } from '@/redux/selectors/settings.ts';

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
  return (
    <Node
      id={node.id}
      isAsync={node.isRunning}
      // icon={nodeDef.icon}
      title={node.factory.title || 'Node'}
      error={node.error || null}
      controls={''}
    >
      <Stack direction="column" gap={2}>
        <Stack direction="row" gap={2}>
          <HandleContainer type="target" full>
            <PortArray ports={node.inputs} />
          </HandleContainer>
          <HandleContainer type="source" full>
            <PortArray ports={node.outputs} />
          </HandleContainer>
        </Stack>
      </Stack>
    </Node>
  );
});

export interface IPortArray {
  ports: Record<string, Port>;
}
export const PortArray = observer(({ ports }: IPortArray) => {
  const entries = Object.values(ports).sort();
  return (
    <>
      {entries.map((input) => (
        <InputHandle port={input} />
      ))}
    </>
  );
});

const extractTypeIcon = (port: Port) => {
  //TODO first check if the port has an explicit custom type defined

  //Default primitives

  //Lookup icons
  const icons = {
    [COLOR]: <ColorWheelIcon />,
    [CURVE]: <BezierIcon />,
  };

  const icon = icons[port.type.$id || ''];
  const isArray = Boolean(port.type.items);

  if (icon) {
    return { icon, array: isArray };
  }

  const primitive = colors[port.type.type];

  const color = primitive ? primitive.value : colors.any.value;

  return { icon, color, isArray };
};

export const InlineTypeLabel = ({ port }: { port: Port }) => {
  //TODO add support for specific types through the $id
  return (
    <Box
      css={{
        background: '$accentMuted',
        color: '$fgOnEmphasis',
        padding: '$1 $2',
        fontSize: '$xxsmall',
        borderRadius: '$small',
        textTransform: 'uppercase',
      }}
    >
      {port.type.type || 'any'}
    </Box>
  );
};

const InputHandle = observer(({ port }: { port: Port }) => {
  const inlineTypesValue = useSelector(inlineTypes);
  const typeCol = extractTypeIcon(port);
  return (
    <Handle
      {...typeCol}
      visible={port.visible || port.isConnected}
      id={port.name}
      full
    >
      <Text>{port.name}</Text>
      {inlineTypesValue && <InlineTypeLabel port={port} />}
    </Handle>
  );
});
