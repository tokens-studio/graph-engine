import { Node } from './node.js';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Box, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../handles.js';
import { Input, OBJECT, Port, annotatedNodeRunning } from '@tokens-studio/graph-engine';
import { Node as GraphNode } from '@tokens-studio/graph-engine'
import colors from '@/tokens/colors.js';
import { useSelector } from 'react-redux';
import { inlineTypes, showTimings } from '@/redux/selectors/settings.js';
import { icons, nodeSpecifics } from '@/redux/selectors/registry.js';
import { title } from '@/annotations/index.js';
import { useLocalGraph } from '@/context/graph.js';
import { arrayMoveImmutable } from 'array-move';
import { DndItem, DndList, DndTrigger } from '@/components/DndList.js';
import { GrabberIcon } from '@/components/icons/GrabberIcon.js';

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
  const { id } = args;
  const graph = useLocalGraph();
  const node = graph.getNode(id);

  if (!node) {
    return <Box>Node not found</Box>;
  }

  return <NodeWrap node={node} />;
};

export interface INodeWrap {
  /**
   * Optional title to override the default title
   */
  title?: string;
  node: GraphNode;
}
const NodeWrap = observer(({ node }: INodeWrap) => {
  const showTimingsValue = useSelector(showTimings);
  const specifics = useSelector(nodeSpecifics);

  const Specific = specifics[node.factory.type];

  return (
    <Node
      id={node.id}
      isAsync={node.annotations[annotatedNodeRunning]}
      // icon={nodeDef.icon}
      title={node.annotations[title] || node.factory.title || 'Node'}
      error={node.error || null}
      controls={''}
    >
      <Stack direction="column" gap={2}>
        <Stack direction="row" gap={3} css={{ padding: '$3' }}>
          <HandleContainer type="target" className={'target'} full>
            <PortArray ports={node.inputs} sortable />
          </HandleContainer>
          <HandleContainer type="source" className={'source'} full>
            <PortArray ports={node.outputs} />
          </HandleContainer>
        </Stack>
        {Specific && <Specific node={node} />}
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
  ports: Record<string, Port<Node>>;
  hideNames?: boolean,
  sortable?: boolean
}

export const PortArray = observer(({ ports, hideNames, sortable = false }: IPortArray) => {
  const entries = Object.values(ports).sort();

  return (
    <>
      {entries.map((port) => (
        <InputHandle port={port} hideName={hideNames} key={port.name} />
      ))}
    </>
  );


});

const extractTypeIcon = (
  port: Port,
  iconLookup: Record<string, React.ReactNode>,
) => {
  let id = port.type.$id || '';
  const isArray = Boolean(port.type.type == 'array');

  if (!id && isArray) {
    id = port.type.items.$id || '';
  }

  let icon = iconLookup[id] || iconLookup[OBJECT];

  const color = colors[id]?.color || 'black';
  const backgroundColor = colors[id]?.backgroundColor || 'white';

  return { isArray, icon, color, backgroundColor };
};

export const InlineTypeLabel = ({ port }: { port: Port }) => {
  //TODO add support for specific types through the $id
  return (
    <Box
      css={{
        background: '$gray1',
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

const InputHandle = observer(({ port, hideName }: { port: Port, hideName?: boolean }) => {
  const inlineTypesValue = useSelector(inlineTypes);
  const iconTypeRegistry = useSelector(icons);
  const typeCol = extractTypeIcon(port, iconTypeRegistry);
  const input = port as unknown as Input;
  const graph = useLocalGraph()

  if (input.variadic) {
    const onSortEnd = ({ oldIndex, newIndex }) => {
      const newValue = arrayMoveImmutable(input.value, oldIndex, newIndex);
      const newEdges = arrayMoveImmutable(port._edges, oldIndex, newIndex).map((edge, i) => {
        edge.annotations['engine.index'] = i;
        return edge;
      }
      );
      // update edges property
      port._edges = newEdges;
      // update the value array
      input.setValue(newValue);
      // update the edges
      newEdges.forEach((edge) => {
        graph.emit('edgeIndexUpdated', edge)
      })
    };

    return (
      <Stack direction='column' gap={3}>
        <Handle
          {...typeCol}
          visible={port.visible || port.isConnected}
          id={port.name}
          full
        >
          {!hideName && <Text>{port.name} + </Text>}
          {inlineTypesValue && <InlineTypeLabel port={port} />}
        </Handle>
        <DndList lockAxis='y' onSortEnd={onSortEnd} css={{ display: 'flex', flexDirection: 'column', gap: '$3' }}>
          {port._edges.map((edge, i) => {
            return (
              <DndItem key={`input-${i}`} index={i} css={{ display: 'flex', gap: '$3', alignItems: 'center' }}>
                <Handle
                  {...typeCol}
                  visible={port.visible || port.isConnected}
                  id={port.name + `[${edge.annotations['engine.index']}]`}
                  key={edge.id}
                  full
                >
                  {!hideName && <Text>
                    {port.name} - [{edge.annotations['engine.index']}]
                  </Text>}

                  {inlineTypesValue && <InlineTypeLabel port={port} />}
                </Handle>
                <DndTrigger >
                  <GrabberIcon />
                </DndTrigger>
              </DndItem>
            )

          })}
        </DndList>
      </Stack>
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
      <Text css={{ fontSize: 'medium', color: '$gray11' }}>{port.name}</Text>
      {inlineTypesValue && <InlineTypeLabel port={port} />}
    </Handle>
  );
});
