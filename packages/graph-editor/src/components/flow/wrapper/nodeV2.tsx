import { Node } from './node.tsx';
import type { Node as GraphNode } from '@tokens-studio/graph-engine';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Box, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../handles.tsx';
import { Input, Port } from '@tokens-studio/graph-engine';
import colors from '@/tokens/colors.ts';

import { useGraph } from '@/hooks/useGraph.ts';
import { useSelector } from 'react-redux';
import { inlineTypes, showTimings } from '@/redux/selectors/settings.ts';
import { icons } from '@/redux/selectors/registry.ts';

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

  return <NodeWrap node={node} title={data.title} />;
};

export interface INodeWrap {
  /**
   * Optional title to override the default title
   */
  title?: string;
  node: GraphNode;
}
const NodeWrap = observer(({ node, title }: INodeWrap) => {
  const showTimingsValue = useSelector(showTimings);

  return (
    <Node
      id={node.id}
      isAsync={node.isRunning}
      // icon={nodeDef.icon}
      title={title || node.factory.title || 'Node'}
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
      {showTimingsValue && (
        <Box css={{ position: 'absolute', bottom: '-1.5em' }}>
          <Text size="xsmall" muted>
            {node.lastExecutedDuration}ms
          </Text>
        </Box>
      )}
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

const extractTypeIcon = (
  port: Port,
  iconLookup: Record<string, React.ReactNode>,
) => {
  const icon = iconLookup[port.type.$id || ''];
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
  const iconTypeRegistry = useSelector(icons);
  const typeCol = extractTypeIcon(port, iconTypeRegistry);
  const input = port as unknown as Input;

  if (input.variadic) {
    return (
      <>
        <Handle
          {...typeCol}
          visible={port.visible || port.isConnected}
          id={port.name}
          full
        >
          <Text>{port.name} + </Text>
          {inlineTypesValue && <InlineTypeLabel port={port} />}
        </Handle>
        {port._edges.map((edge, i) => {
          return (
            <Handle
              {...typeCol}
              visible={port.visible || port.isConnected}
              id={port.name + `[${edge.data.index}]`}
              key={i}
              full
            >
              <Text>
                {port.name} - [{i}]
              </Text>
              {inlineTypesValue && <InlineTypeLabel port={port} />}
            </Handle>
          );
        })}
      </>
    );
    //We need to render additional handles
  }

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
