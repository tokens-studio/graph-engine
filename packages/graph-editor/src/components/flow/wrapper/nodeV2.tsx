import { Node } from './node.js';

import { observer } from 'mobx-react-lite';
import React from 'react';
import { Box, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../handles.js';
import { COLOR, Input, OBJECT, Port, annotatedNodeRunning } from '@tokens-studio/graph-engine';
import { Node as GraphNode } from '@tokens-studio/graph-engine'
import colors from '@/tokens/colors.js';
import { useSelector } from 'react-redux';
import { inlineTypes, inlineValues, showTimings } from '@/redux/selectors/settings.js';
import { icons, nodeSpecifics } from '@/redux/selectors/registry.js';
import { title, xpos } from '@/annotations/index.js';
import { useLocalGraph } from '@/context/graph.js';

const isHexColor = (str) => {
  if (typeof str !== 'string') return false;
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(str);;
};

export type UiNodeDefinition = {
  //Name of the Node
  title?: string;
  subtitle: string;
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
  subtitle?: string;
  node: GraphNode;
}
const NodeWrap = observer(({ node }: INodeWrap) => {
  const showTimingsValue = useSelector(showTimings);
  const specifics = useSelector(nodeSpecifics);

  const Specific = specifics[node.factory.type];

  return (
    <Node
      id={node.id}
      isAsync={node.annotations[annotatedNodeRunning] as boolean}
      // icon={nodeDef.icon}
      title={(node.annotations[title] as string) || node.factory.title || 'Node'}
      subtitle={node.annotations[title] ? node.factory.title : ""}
      error={node.error || null}
      controls={''}
      style={{minWidth:'350px'}}
    >
      <Stack direction="column" gap={2}>
        <Stack direction="row" gap={3} css={{ padding: '$3' }}>
          <HandleContainer type="target" className={'target'} full>
            <PortArray ports={node.inputs} />
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
  ports: Record<string, Port>;
  hideNames?: boolean
}
export const PortArray = observer(({ ports, hideNames }: IPortArray) => {
  const entries = Object.values(ports).sort();
  return (
    <>
      {entries.filter(x => x.visible || x.isConnected).map((input) => (
        <InputHandle port={input} hideName={hideNames} />
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

const getColorPreview = (color: string, showValue = false) => {
  const colorSwatch = <Box css={{ width: '16px', height: '16px', borderRadius: '$medium', backgroundColor: color }} />;

  if (!showValue) {
    return colorSwatch;
  }

  return (
    <Stack direction="row" gap={2}>
      {colorSwatch}    
      {showValue ? <Text css={{ fontSize: '$small', color: '$gray12' }}>{color.toUpperCase()}</Text> : null}
    </Stack>
  );
}


const getValuePreview = (value, type) => {
  if (value === undefined) {
    return null;
  }

  let valuePreview = '';
  switch (type.type) {
    case 'array':
      const allColors = value.every(isHexColor);
      if (allColors) {
        return (<Stack direction="row" gap={1}>
          {value.length > 5 ? (
            <>
              {value.slice(0, 5).map((val) => getColorPreview(val))}
              <Text>+{value.length - 5}</Text>
            </>
          ) : value.map((val) => getColorPreview(val))}
        </Stack>)
      }
      valuePreview = JSON.stringify(value);
      break;
    case 'object':
      valuePreview = JSON.stringify(value);
      break;
    case 'number':
      valuePreview = value.toString();
      break;
    case 'string':
      valuePreview = value;
      break
    default:
      if (isHexColor(value)) {
        return getColorPreview(value,true);
      }
      valuePreview = JSON.stringify(value);
  }

  return valuePreview.length > 20 ? `${valuePreview.substring(0, 20)}...` : valuePreview;
}

const InputHandle = observer(({ port, hideName }: { port: Port, hideName?: boolean }) => {
  const inlineTypesValue = useSelector(inlineTypes);
  const iconTypeRegistry = useSelector(icons);
  const inlineValuesValue = useSelector(inlineValues);
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
          variadic
        >
          {!hideName && <Text>{port.name} + </Text>}
          {inlineTypesValue && <InlineTypeLabel port={port} />}
        </Handle>
        {port._edges.map((edge, i) => {
          const valuePreview = isHexColor(input.value[i])
            ? getColorPreview(input.value[i], true)
            : <Text css={{ fontSize: 'medium', color: '$gray12' }}>{input.value[i]}</Text>;
          return (
            <Handle
              {...typeCol}
              visible={port.visible || port.isConnected}
              id={port.name + `[${edge.annotations['engine.index']}]`}
              key={i}
              full
            >
              {!hideName && (
                <Box css={{ display: 'grid', justifyContent: 'center', direction: 'row' }}>
                  {inlineValuesValue && <Text css={{ fontSize: 'medium', color: '$gray11' }}>{getValuePreview(input.value[i], input.type.items)}</Text>}

                  <Text css={{ fontSize: 'small', color: '$gray12' }}>{input.name} - [{i}]</Text>
                </Box>
              )}

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
      {!hideName && (
        <Box css={{ display: 'grid', justifyContent: 'center', direction: 'row' }}>
          {inlineValuesValue && <Text css={{ fontSize: '$small', color: '$gray12' }}>{getValuePreview(input.value, input.type) ?? input.name}</Text>}
          {port.value !== undefined ? <Text css={{ fontSize: '$medium', color: '$gray11' }}>{input.name}</Text> : null}
        </Box>
      )}
      {inlineTypesValue && <InlineTypeLabel port={port} />}
    </Handle>
  );
});
