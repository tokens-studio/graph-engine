import { BaseNodeWrapper } from './base.js';

import {
  COLOR,
  Color,
  Input,
  OBJECT,
  Port,
  SchemaObject,
  annotatedDynamicInputs,
  annotatedNodeRunning,
  toColor,
  toHex,
} from '@tokens-studio/graph-engine';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryContent } from '@/components/ErrorBoundaryContent.js';
import { Node as GraphNode } from '@tokens-studio/graph-engine';
import { Handle, HandleContainer, useHandle } from '../handles.js';
import { Stack, Text } from '@tokens-studio/ui';
import { icons, nodeSpecifics } from '@/redux/selectors/registry.js';
import {
  inlineTypes,
  inlineValues,
  showTimings,
} from '@/redux/selectors/settings.js';
import { observer } from 'mobx-react-lite';
import { title } from '@/annotations/index.js';
import { useLocalGraph } from '@/context/graph.js';
import { useSelector } from 'react-redux';
import React from 'react';
import clsx from 'clsx';
import colors from '@/tokens/colors.js';
import styles from './nodeV2.module.css';

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
  state: Record<string, unknown>;
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
    return <div>Node not found</div>;
  }

  return (
    <ErrorBoundary fallback={<ErrorBoundaryContent />}>
      <NodeWrap node={node} icon={args?.data?.icon} />
    </ErrorBoundary>
  );
};

export interface INodeWrap {
  /**
   * Optional title to override the default title
   */
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  node: GraphNode;
}
const NodeWrap = observer(({ node, icon }: INodeWrap) => {
  const showTimingsValue = useSelector(showTimings);
  const specifics = useSelector(nodeSpecifics);

  //Check if the input allows for dynamic inputs
  const isInput = !!(
    node.factory.type == 'studio.tokens.generic.input' &&
    node.annotations[annotatedDynamicInputs]
  );

  const Specific = specifics[node.factory.type];

  return (
    <BaseNodeWrapper
      id={node.id}
      isAsync={node.annotations[annotatedNodeRunning] as boolean}
      icon={icon}
      title={
        (node.annotations[title] as string) || node.factory.title || 'Node'
      }
      subtitle={node.annotations[title] ? node.factory.title : ''}
      error={node.error || null}
      controls={''}
      style={{ minWidth: '200px' }}
    >
      <Stack direction="column" gap={2}>
        <Stack
          direction="column"
          gap={3}
          style={{ padding: 'var(--component-spacing-md) 0' }}
        >
          <HandleContainer type="source" className={'source'} full>
            <PortArray ports={node.outputs} />
            {isInput && <DynamicOutput />}
          </HandleContainer>
          <HandleContainer type="target" className={'target'} full>
            <PortArray ports={node.inputs} />
          </HandleContainer>
        </Stack>
        {Specific && (
          <Stack
            direction="column"
            gap={3}
            style={{ padding: 'var(--component-spacing-md)' }}
          >
            <Specific node={node} />
          </Stack>
        )}
      </Stack>
      {showTimingsValue && (
        <div className={styles.timingText}>
          <Text size="xsmall" muted>
            {node.lastExecutedDuration}ms
          </Text>
        </div>
      )}
    </BaseNodeWrapper>
  );
});
export interface IPortArray {
  ports: Record<string, Port>;
  hideNames?: boolean;
}
export const PortArray = observer(({ ports, hideNames }: IPortArray) => {
  const entries = Object.values(ports).sort();
  return (
    <>
      {entries
        .filter((x) => x.visible || x.isConnected)
        .map((input) => (
          <InputHandle port={input} hideName={hideNames} />
        ))}
    </>
  );
});

export const DynamicOutput = () => {
  return (
    <Handle
      color={'black'}
      backgroundColor={'hsl(60, 80%, 60%)'}
      visible={true}
      id={'[dynamic]'}
      isConnected={false}
    >
      <i>Add New</i>
    </Handle>
  );
};

export const extractTypeIcon = (
  port: Port,
  iconLookup: Record<string, React.ReactNode>,
) => {
  let id = port.type.$id || '';
  const isArray = Boolean(port.type.type == 'array') && !port.type.$id;

  if (!id && isArray) {
    id = port.type.items.$id || '';
  }

  const icon = iconLookup[id] || iconLookup[OBJECT];

  const color = colors[id]?.color || 'black';
  const backgroundColor = colors[id]?.backgroundColor || 'hsl(60, 80%, 60%)';

  return { isArray, icon, color, backgroundColor };
};

export const extractType = (schema: SchemaObject) => {
  if (!schema) {
    return 'any';
  }

  if (schema.$id) {
    //Assume the id is a url
    const parts = schema.$id.split('/');
    //If there was no / then just return the last part
    const part = parts[parts.length - 1] || schema.$id;
    //Remove the .json
    return part.split('.')[0] || part;
  }

  if (schema.type === 'array') {
    return extractType(schema.items) + '[]';
  }
  //No idea, default to a structural representation
  return schema.type;
};

export const InlineTypeLabel = ({ port }: { port: Port }) => {
  //Try lookup the id if possible
  const typeName = extractType(port.type);
  const handleInformation = useHandle();

  return (
    <div
      className={clsx(styles.inlineTypeLabel, styles[handleInformation.type])}
    >
      {typeName}
    </div>
  );
};

const getColorPreview = (color: Color, showValue = false) => {
  let hex = '';
  //Let's try convert to hex
  try {
    hex = toHex(toColor(color));
  } catch {
    //ignore
  }

  const colorSwatch = (
    <div
      style={{
        width: 'var(--size-100)',
        height: 'var(--size-100)',
        borderRadius: 'var(--component-radii-md)',
        backgroundColor: hex,
      }}
    />
  );

  if (!showValue) {
    return colorSwatch;
  }

  return (
    <Stack direction="row" gap={2} justify="center" align="center">
      {colorSwatch}
      {showValue ? (
        <Text
          style={{
            font: 'var(--font-body-small)',
            color: 'var(--color-neutral-1500)',
          }}
        >
          {hex.toUpperCase()}
        </Text>
      ) : null}
    </Stack>
  );
};

const getValuePreview = (value, type) => {
  if (value === undefined) {
    return null;
  }

  let valuePreview = '';
  switch (type.type) {
    case 'array':
      if (type.items?.$id === COLOR) {
        return (
          <Stack direction="row" gap={1}>
            {value.length > 5 ? (
              <>
                {value.slice(0, 5).map((val) => getColorPreview(val))}
                <Text
                  size="xsmall"
                  style={{ color: 'var(--color-neutral-1200)' }}
                >
                  +{value.length - 5}
                </Text>
              </>
            ) : (
              value.map((val) => getColorPreview(val))
            )}
          </Stack>
        );
      }
      valuePreview = JSON.stringify(value);
      break;
    case 'number':
      valuePreview = value.toString();
      break;
    case 'string':
      valuePreview = value;
      break;
    case 'object':
      if (type.$id === COLOR) {
        return getColorPreview(value, true);
      }
    //This is expected to fall through
    // eslint-disable-next-line no-fallthrough
    default:
      valuePreview = JSON.stringify(value);
  }

  return valuePreview.length > 18
    ? `${valuePreview.substring(0, 18)}...`
    : valuePreview;
};

const InputHandle = observer(
  ({ port, hideName }: { port: Port; hideName?: boolean }) => {
    const inlineTypesValue = useSelector(inlineTypes);
    const iconTypeRegistry = useSelector(icons);
    const inlineValuesValue = useSelector(inlineValues);
    const typeCol = extractTypeIcon(port, iconTypeRegistry);
    const input = port as unknown as Input;
    const type = extractType(port.type);
    const handleInformation = useHandle();

    if (input.variadic) {
      return (
        <>
          <Handle
            {...typeCol}
            type={type}
            visible={port.visible != false || port.isConnected}
            id={port.name}
            variadic
          >
            {!hideName && <Text>{port.name} + </Text>}
            {inlineTypesValue && <InlineTypeLabel port={port} />}
          </Handle>
          {port._edges.map((edge, i) => {
            return (
              <Handle
                {...typeCol}
                //The underlying type might not be an array
                isArray={port.type.type?.type === 'array'}
                visible={port.visible != false || port.isConnected}
                id={port.name + `[${edge.annotations['engine.index']}]`}
                key={i}
              >
                {!hideName && (
                  <div
                    style={{
                      display: 'grid',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    {inlineValuesValue && (
                      <span
                        style={{
                          font: 'var(--font-code-md)',
                          color: 'var(--color-neutral-1200)',
                        }}
                      >
                        {getValuePreview(input.value[i], input.type.items)}
                      </span>
                    )}
                  </div>
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
        visible={port.visible != false || port.isConnected}
        id={port.name}
        type={type}
        isConnected={port.isConnected}
      >
        {!hideName && (
          <Stack
            justify="between"
            width="full"
            align="center"
            style={{
              flexDirection:
                handleInformation.type === 'source' ? 'row-reverse' : 'row',
            }}
          >
            <span
              style={{
                font: 'var(--font-code-sm)',
                color: 'var(--color-neutral-1500)',
              }}
            >
              {input.name}
            </span>
            {inlineValuesValue && (
              <span
                style={{
                  font: 'var(--font-code-xs)',
                  color: 'var(--color-neutral-1200)',
                }}
              >
                {getValuePreview(input.value, input.type)}
              </span>
            )}
          </Stack>
        )}
        {inlineTypesValue && <InlineTypeLabel port={port} />}
      </Handle>
    );
  },
);
