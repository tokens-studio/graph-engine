import {
  Box,
  Button,
  Heading,
  IconButton,
  Separator,
  Spinner,
  Stack,
} from '@tokens-studio/ui';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  ResetIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { Graph } from 'graphlib';
import { HandleContainerContext } from '../handles.tsx';
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
import useDetachNodes from '../hooks/useDetachNodes.ts';

const CollapserContainer = styled('div', {});

interface NodeProps {
  id: string;
  icon?: React.ReactNode;
  title: string;
  error?: boolean;
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

const findAllUpstream = (id: string, graph: Graph) => {
  return (graph.predecessors(id) || []).flatMap((x) =>
    [x].concat(findAllUpstream(x, graph)),
  );
};

const findAllDownstream = (id: string, graph: Graph) => {
  return (graph.successors(id) || []).flatMap((x) =>
    [x].concat(findAllDownstream(x, graph)),
  );
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

const zoomSelector = (s) => s.transform[2] >= 0.5;

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
      opacity: !showContent ? 0 : 1,
      pointerEvents: !showContent ? 'none' : 'initial',
    };
  }, [showContent]);

  return (
    <CollapserContainer css={styling}>
      <Box>
        <Box css={occluding}>{children}</Box>
      </Box>
    </CollapserContainer>
  );
};

export const Node = (props: NodeProps) => {
  const { id, icon, title, error, isAsync, children, controls, ...rest } =
    props;
  const flow = useReactFlow();
  const showContent = useStore(zoomSelector);

  const [collapsed, setCollapsed] = useState(false);

  const detachNodes = useDetachNodes();
  const hasParent = useStore(
    (store) => !!store.nodeInternals.get(id)?.parentNode,
  );

  const onDelete = useCallback(() => {
    flow.setNodes((nodes) => nodes.filter((x) => x.id !== id));
  }, [id, flow]);

  const onTraceDown = useCallback(() => {
    const graph = convertToGraph(flow);
    const nodes = createNodeLookup(findAllDownstream(id, graph).concat([id]));
    applyFilters(flow, nodes);
  }, [id, flow]);

  const onTraceSource = useCallback(() => {
    const graph = convertToGraph(flow);
    const nodes = createNodeLookup(findAllUpstream(id, graph).concat([id]));
    applyFilters(flow, nodes);
  }, [id, flow]);

  const onResetTrace = useCallback(() => {
    flow.setNodes((nodes) =>
      nodes.map((x) => {
        //Remove filtering
        return {
          ...x,
          className: classNames(x.className, {
            filtered: false,
          }),
        };
      }),
    );
  }, [flow]);

  const onDetach = () => detachNodes([id]);

  return (
    <Box
      style={{
        minWidth: '300px',
        position: 'relative',
        borderRadius: '3px',
      }}
      css={{ background: error ? '$dangerBg' : '$bgDefault' }}
    >
      <NodeToolbar className="nodrag">
        <Stack direction="row" gap={2}>
          {hasParent && <Button onClick={onDetach}>Detach</Button>}
          <IconButton
            title="Trace upstream"
            icon={<DoubleArrowLeftIcon />}
            onClick={onTraceSource}
          />
          <IconButton title="Delete" icon={<TrashIcon />} onClick={onDelete} />

          <IconButton
            title="Trace upstream"
            icon={<DoubleArrowRightIcon />}
            onClick={onTraceDown}
          />
          <IconButton
            title="Reset trace"
            icon={<ResetIcon />}
            onClick={onResetTrace}
          />
        </Stack>
      </NodeToolbar>
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
                  css={{ padding: '$3' }}
                >
                  <Stack direction="row" gap={2} align="center">
                    <Box>{icon}</Box>
                    {isAsync && <Spinner />}
                    <Heading>{title}</Heading>
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
                <Separator orientation="horizontal" />
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
    </Box>
  );
};

export default Node;
