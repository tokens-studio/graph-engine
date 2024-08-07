import { BaseNodeWrapper } from './base.js';

import {
  COLOR,
  CONTROL_PORT,
  Color,
  ControlFlowPort,
  DataFlowPort,
  DataflowNode,
  Input,
  OBJECT,
  SchemaObject,
  annotatedDynamicInputs,
  annotatedNodeRunning,
  toColor,
  toHex,
} from '@tokens-studio/graph-engine';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryContent } from '@/components/ErrorBoundaryContent.js';
import { Handle, HandleContainer, useHandle } from '../handles.js';
import { Stack, Text } from '@tokens-studio/ui';
import { SystemSettings } from '@/system/frame/settings.js';
import { observer } from 'mobx-react-lite';
import { title } from '@/annotations/index.js';
import { useFrame } from '@/system/frame/hook.js';
import { useLocalGraph } from '@/context/graph.js';
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
  const node = graph.getNode(id) as DataflowNode;
  const frame = useFrame();

  if (!node) {
    return <div>Node not found</div>;
  }

  return (
    <ErrorBoundary fallback={<ErrorBoundaryContent />}>
      <NodeWrap
        node={node}
        icon={args?.data?.icon}
        settings={frame.settings}
      />
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
  node: DataflowNode;
  settings: SystemSettings;
}

export interface ISpecificWrapper {
  specifics: Record<
    string,
    React.FC<{
      node: GraphNode;
    }>
  >;
  node: GraphNode;
}

export const SpecificWrapper = observer(
  ({ specifics, node }: ISpecificWrapper) => {
    const Specific = specifics[node.factory.type];

    if (!Specific) {
      return null;
    }
    return (
      <Stack
        direction="column"
        gap={3}
        style={{ padding: 'var(--component-spacing-md)' }}
      >
        <Specific node={node} />
      </Stack>
    );
  },
);

const NodeWrap = observer(({ settings, node, icon }: INodeWrap) => {
  const frame = useFrame();

  //Check if the input allows for dynamic inputs
  const isInput = !!(
    node.factory.type == 'studio.tokens.generic.input' &&
    node.annotations[annotatedDynamicInputs]
  );

  return (
    <BaseNodeWrapper
      id={node.id}
      isAsync={node.annotations[annotatedNodeRunning] as boolean}
      icon={icon}
      title={
        (node.annotations[title] as string) || node.factory.title || 'Node'
      }
      subtitle={node.annotations[title] ? node.factory.title : ''}
      error={node.dataflow?.error || null}
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
            <PortArray ports={node.outputs as Record<string, DataFlowPort>} />
            {isInput && <DynamicOutput />}
          </HandleContainer>
          <HandleContainer type="target" className={'target'} full>
            <PortArray ports={node.inputs as Record<string, DataFlowPort>} />
          </HandleContainer>
        </Stack>
        <SpecificWrapper specifics={frame.specifics} node={node} />
      </Stack>
      {settings.showTimings && (
        <div className={styles.timingText}>
          <Text size="xsmall" muted>
            {node.dataflow?.lastExecutedDuration}ms
          </Text>
        </div>
      )}
    </BaseNodeWrapper>
  );
});

export interface IPortArray {
  ports: Record<string, DataFlowPort>;
  hideNames?: boolean;
}
export const PortArray = observer(({ ports, hideNames }: IPortArray) => {
  const frame = useFrame();
  const entries = Object.values(ports).sort();
  return (
    <>
      {entries
        .filter((x) => x.visible != false || x.isConnected)
        .map((input) => (
          <InputHandle
            port={input}
            hideName={hideNames}
            inlineTypes={frame.settings.inlineTypes}
            inlineValues={frame.settings.inlineValues}
          />
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
  port: DataFlowPort | ControlFlowPort,
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

export const InlineTypeLabel = ({ port }: { port: DataFlowPort }) => {
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

export interface IInputHandle {
  port: Port;
  hideName?: boolean;
  inlineTypes: boolean;
  inlineValues: boolean;
}

const InputHandle = observer(
  ({ port, hideName, inlineTypes, inlineValues }: IInputHandle) => {
    const frame = useFrame();
    const typeCol = extractTypeIcon(port, frame.icons);
    const input = port as unknown as Input;
    const type = extractType(port.type);
    const handleInformation = useHandle();

    const variant = typeCol.isArray
      ? 'array'
      : port.pType == CONTROL_PORT
        ? 'message'
        : undefined;

    if (input.variadic) {
      return (
        <>
          <Handle
            {...typeCol}
            type={type}
            visible={port.visible != false || port.isConnected}
            id={port.name}
            variant={variant}
            variadic
          >
            {!hideName && <Text>{port.name} + </Text>}
            {inlineTypes && <InlineTypeLabel port={port} />}
          </Handle>
          {port._edges.map((edge, i) => {
            return (
              <Handle
                {...typeCol}
                //The underlying type might not be an array
                variant={port.type.type?.type === 'array' ? 'array' : undefined}
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
                    {inlineValues && (
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
                {inlineTypes && <InlineTypeLabel port={port} />}
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
        variant={variant}
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
            {inlineValues && (
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
        {inlineTypes && <InlineTypeLabel port={port} />}
      </Handle>
    );
  },
);
