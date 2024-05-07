import {
  Box,
  Button,
  IconButton,
  Spinner,
  Stack,
  Text,
} from '@tokens-studio/ui';
import { MoreVert } from 'iconoir-react';
import { HandleContainerContext } from '../handles.js';
import {
  NodeToolbar,
  ReactFlowInstance,
  useReactFlow,
  useStore,
} from 'reactflow';
import { styled } from '@stitches/react';
import FocusTrap from 'focus-trap-react';
import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames/dedupe.js';
import useDetachNodes from '../../../hooks/useDetachNodes.js';
import GraphLib from '@dagrejs/graphlib';
import { useDispatch } from '@/hooks/useDispatch.js';
const { Graph, alg } = GraphLib;


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
}

const convertToGraph = (flow: ReactFlowInstance) => {
  const nodes = flow.getNodes();
  const edges = flow.getEdges();

  const graph = new Graph({ multigraph: true });
  nodes.forEach((node) => graph.setNode(node.id));
  edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  return graph;
};


const createNodeLookup = (nodes: string[]) => {
  return nodes.reduce((acc, node) => {
    acc[node] = true;
    return acc;
  }, {} as Record<string, boolean>);
};

const applyFilters = (
  flow: ReactFlowInstance,
  lookup: Record<string, boolean>,
) => {
  flow.setNodes((nodes) =>
    nodes.map((x) => {
      if (!lookup[x.id]) {
        return {
          ...x,
          className: classNames(x.className, 'filtered'),
        };
      }
      return {
        ...x,
        className: classNames(x.className, {
          filtered: false,
        }),
      };
    }),
  );
};

export const Collapser = ({ children, collapsed }) => {
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

  return (
    <CollapserContainer css={styling}>
      <Box
        css={{
          position: 'relative',
          padding: '$2',
          paddingBottom: '$3',
        }}
      >
        {children}
      </Box>
    </CollapserContainer>
  );
};

const NodeWrapper = styled('div', {
  minWidth: '300px',
  position: 'relative',
  borderRadius: '$medium',
  background: '$bgEmphasis',
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
  const dispatch = useDispatch();


  const onClick = useCallback(() => {
    dispatch.graph.setCurrentNode(id);
  }, [dispatch.graph, id]);

  return (
    <NodeWrapper error={Boolean(error)} className={error ? 'error' : ''}>
          <Stack
            direction="column"
            gap={0}
            onClick={onClick}
            {...rest}
          >
            {title && (
              <>
                <Stack
                  className='reactflow-draggable-handle'
                  direction="row"
                  justify="between"
                  align="center"
                  css={{
                    padding: '$3',
                    borderBottom: '2px solid var(--nodeBorderColor, var(--colors-borderSubtle))',
                    backgroundColor: 'var(--nodeBgColor, var(--colors-bgSubtle))',
                    borderRadius: '$medium',
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
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

                    {isAsync && <Spinner />}
                  </Stack>
                  <Stack direction="row" gap={2}>
                    {controls}
                  </Stack>
                </Stack>
              </>
            )}
            {children}
          </Stack>
    </NodeWrapper>
  );
};

export default Node;
