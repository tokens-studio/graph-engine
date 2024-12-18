import { Label, Stack, Text, TextInput, Textarea } from '@tokens-studio/ui';
import React, { useCallback, useMemo } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { GraphEditor } from '@/editor/graphEditor.js';
import { ErrorBoundaryContent } from '@/components/ErrorBoundaryContent.js';
import { Node } from '@tokens-studio/graph-engine';
import {
  currentNode,
  graphNodesSelector,
  currentPanelIdSelector,
} from '@/redux/selectors/graph.js';
import { dockerSelector } from '@/redux/selectors/refs.js';
import { description, title as annotatedTitle } from '@/annotations/index.js';
import { observer } from 'mobx-react-lite';
import { useGraph } from '@/hooks/useGraph.js';
import { useDispatch } from '@/hooks/useDispatch.js';
import { useSelector } from 'react-redux';

const switchOrCreateGraphTab = function (node) {
  const graphId = innerGraph.annotations['engine.id'];
  const title =
    node.annotations[annotatedTitle] ||
    innerGraph.annotations['engine.title'] ||
    'Subgraph';
  const existing = dockerRef.current.find(graphId);
};

const useSubgraphExplorerCallback = (node) => {
  const dockerRef = useSelector(dockerSelector);
  const callback = useCallback(() => {
    if (!dockerRef?.current) {
      return;
    }

    let oneShot = false;
    const innerGraph = node._innerGraph;
    const graphId = innerGraph.annotations['engine.id'];
    const title =
      node.annotations[annotatedTitle] ||
      innerGraph.annotations['engine.title'] ||
      'Subgraph';
    const existing = dockerRef.current.find(graphId);

    const ref = (o: ImperativeEditorRef) => {
      if (o && !oneShot) {
        o.load(innerGraph);
        oneShot = true;
      }
    };

    if (!existing) {
      const newTab = {
        cached: true,
        closable: true,
        id: graphId,
        group: 'graph',
        title,
        content: (
          <ErrorBoundary fallback={<ErrorBoundaryContent />}>
            <GraphEditor ref={ref} id={graphId} />
          </ErrorBoundary>
        ),
      };
      dockerRef.current.dockMove(newTab, 'graphs', 'middle');
    } else {
      dockerRef.current.updateTab(graphId, null, true);
    }
  }, [dockerRef, node._innerGraph, node.annotations]);

  return callback;
};

const SubgraphNodeItem = function ({ node }) {
  const nodeType = node.nodeType();
  const onNodeClick = useSubgraphExplorerCallback(node);

  return (
    <li key={node.id} onClick={onNodeClick}>
      <span>{nodeType}</span>
    </li>
  );
};

export const Navigator = () => {
  const nodes = useSelector(graphNodesSelector);
  const dispatch = useDispatch();

  return (
    <Stack
      direction="column"
      gap={4}
      style={{
        height: '100%',
        flex: 1,
        padding: 'var(--component-spacing-md)',
        overflow: 'auto',
      }}
    >
      <div style={{ padding: 'var(--component-spacing-md)' }}>
        <ul>
          {Object.values(nodes).map((node) => {
            if (!node._innerGraph) return null;
            return <SubgraphNodeItem key={node.id} node={node} />;
          })}
        </ul>
      </div>
    </Stack>
  );
};
