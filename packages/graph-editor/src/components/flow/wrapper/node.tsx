import { Box, IconButton, Spinner, Stack, Text } from '@tokens-studio/ui';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { HandleContainerContext } from '../handles.tsx';
import { useReactFlow, useStore } from 'reactflow';
import { styled } from '@stitches/react';
import FocusTrap from 'focus-trap-react';
import React, { useCallback, useMemo, useState } from 'react';
import useDetachNodes from '../hooks/useDetachNodes.ts';
import { useSelector } from 'react-redux';
import { debugMode, obscureDistance } from '#/redux/selectors/settings.ts';

const CollapserContainer = styled('div', {});

interface Stats {
  executionTime: number;
}

interface NodeProps {
  id: string;
  icon?: React.ReactNode;
  title: string;
  error: Error | null;
  isAsync?: boolean;
  children?: React.ReactNode;
  controls?: React.ReactNode;
  style?: React.CSSProperties;
  stats: Stats;
}

export const Collapser = ({ icon, children, collapsed, showContent }) => {
  const styling = useMemo(() => {
    if (collapsed) {
      return {
        height: '0',
        overflow: 'hidden',
        '+*>*': {
          height: 0,
        },
      };
    }
  }, [collapsed]);

  const occluding = useMemo(() => {
    return {
      position: 'relative',
      padding: '$3',
      paddingBottom: '$5',
      opacity: !showContent ? 0 : 1,
      pointerEvents: !showContent ? 'none' : 'initial',
    };
  }, [showContent]);

  return (
    <CollapserContainer css={styling}>
      <Box css={occluding}>{children}</Box>
    </CollapserContainer>
  );
};

const NodeWrapper = styled('div', {
  minWidth: '300px',
  position: 'relative',
  borderRadius: '$medium',
  background: '$bgDefault',
  variants: {
    error: {
      true: {
        '--nodeBorderColor': 'var(--colors-dangerFg)',
        '--nodeBgColor': 'var(--colors-dangerBg)',
        '--nodeTextColor': 'var(--colors-dangerFg)',
      },
    },
  },
});

export const Node = (props: NodeProps) => {
  const { id, icon, title, error, isAsync, children, controls, ...rest } =
    props;
  const flow = useReactFlow();
  const obscureDistanceValue = useSelector(obscureDistance);
  const debugModeValue = useSelector(debugMode);
  const limiter = useCallback(
    (s) => s.transform[2] >= obscureDistanceValue,
    [obscureDistanceValue],
  );

  const showContent = useStore(limiter);

  const [collapsed, setCollapsed] = useState(false);

  const detachNodes = useDetachNodes();
  const hasParent = useStore(
    (store) => !!store.nodeInternals.get(id)?.parentNode,
  );

  const onDelete = useCallback(() => {
    flow.setNodes((nodes) => nodes.filter((x) => x.id !== id));
  }, [id, flow]);

  const onDetach = () => detachNodes([id]);

  return (
    <NodeWrapper error={Boolean(error)} className={error ? 'error' : ''}>
      <HandleContainerContext.Provider
        value={{ collapsed, hide: !showContent }}
      >
        <FocusTrap>
          <Stack direction="column" gap={0} {...rest}>
            {title && (
              <>
                <Stack
                  direction="row"
                  justify="between"
                  align="center"
                  css={{
                    padding: '$3 $5',
                    borderBottom: collapsed
                      ? 'none'
                      : '2px solid var(--nodeBorderColor, var(--colors-borderSubtle))',
                    backgroundColor:
                      'var(--nodeBgColor, var(--colors-bgSubtle))',
                    borderRadius: '$medium',
                    borderBottomLeftRadius: collapsed ? '$medium' : 0,
                    borderBottomRightRadius: collapsed ? '$medium' : 0,
                  }}
                >
                  <Stack direction="row" gap={2} align="center">
                    {icon && (
                      <Box
                        css={{
                          color: 'var(--nodeTextColor, var(--colors-fgSubtle))',
                        }}
                      >
                        {icon}
                      </Box>
                    )}
                    <Text
                      css={{
                        fontSize: '$xxsmall',
                        fontWeight: '$sansMedium',
                        textTransform: 'uppercase',
                        color: 'var(--nodeTextColor, var(--colors-fgSubtle))',
                        letterSpacing: '0.15px',
                      }}
                    >
                      {title}
                    </Text>
                    {debugModeValue && (
                      <Text
                        css={{
                          fontSize: '$xxsmall',
                          fontFamily: 'monospace',
                          color: '$fgSubtle',
                        }}
                      >
                        {props.stats.executionTime}ms
                      </Text>
                    )}
                    {isAsync && <Spinner />}
                  </Stack>
                  <Stack direction="row" gap={2}>
                    {controls}
                    <IconButton
                      variant="invisible"
                      size="small"
                      title="Collapse"
                      icon={collapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      onClick={() => setCollapsed(!collapsed)}
                    />
                  </Stack>
                </Stack>
              </>
            )}
            <Collapser
              collapsed={collapsed}
              showContent={showContent}
              icon={icon}
            >
              {children}
            </Collapser>
          </Stack>
        </FocusTrap>
      </HandleContainerContext.Provider>
    </NodeWrapper>
  );
};

export default Node;
