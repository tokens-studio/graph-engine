import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryContent } from '@/components/ErrorBoundaryContent.js';
import { ImperativeEditorRef } from '../index.js';
import { title as annotatedTitle } from '@/annotations/index.js';
import { dockerSelector } from '@/redux/selectors/refs.js';
import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';

export const useSubgraphExplorerCallback = (node) => {
  const dockerRef = useSelector(dockerSelector);

  const callback = useCallback(() => {
    if (!dockerRef?.current) {
      return;
    }

    let oneShot = false;
    const innerGraph = node['_innerGraph'];
    const graphId = innerGraph.annotations['engine.id'];
    const title =
      node.annotations[annotatedTitle] ||
      innerGraph.annotations['engine.title'] ||
      'Subgraph';
    const existing = dockerRef.current.find(graphId);

    if (!existing) {
      const ref = (o: ImperativeEditorRef) => {
        if (o && !oneShot) {
          o.load(innerGraph);
          oneShot = true;
        }
      };

      const newTab = {
        cached: true,
        closable: true,
        id: graphId,
        group: 'graph',
        title,
        content: window && window['newGraphEditor'](ref, graphId),
      };
      console.log(newTab);
      dockerRef.current.dockMove(newTab, 'graphs', 'middle');
    } else {
      dockerRef.current.updateTab(graphId, null, true);
    }
  }, [dockerRef, node['_innerGraph'], node.annotations]);

  return callback;
};
