import { Button } from '@tokens-studio/ui';
import { ColorCompare } from '@/components/preview/colorCompare.js';
import { ColorScale } from '@/components/preview/colorScale.js';
import { ColorSwatch } from '@/components/preview/swatch.js';
import { CurveField } from '@/components/controls/curve.js';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryContent } from '@/components/ErrorBoundaryContent.js';
import { GraphEditor } from '@/editor/graphEditor.js';
import { ImperativeEditorRef } from '../index.js';
import { MathExpression } from '@/components/preview/mathExpression.js';
import { Node } from '@tokens-studio/graph-engine';
import { title as annotatedTitle } from '@/annotations/index.js';
import { dockerSelector } from '@/redux/selectors/refs.js';
import { observer } from 'mobx-react-lite';
import { useSelector } from 'react-redux';
import Eye from '@tokens-studio/icons/Eye.js';
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
  }, [dockerRef, node['_innerGraph'], node.annotations]);

  return callback;
};

const SubgraphExplorer = ({ node }: { node: Node }) => {
  const onClick = useSubgraphExplorerCallback(node);

  return (
    <Button emphasis="high" icon={<Eye />} onClick={onClick}>
      Subgraph Explorer
    </Button>
  );
};

const ColorComparePreview = observer(({ node }: { node: Node }) => {
  return (
    <ColorCompare
      colors={[
        node.inputs.colorA.value || '#ffffff',
        node.inputs.colorB.value || '#000000',
      ]}
    />
  );
});

const ColorScalePreview = observer(({ node }: { node: Node }) => {
  return <ColorScale scale={node.inputs.value.value} />;
});

const CurvePreview = observer(({ node }: { node: Node }) => {
  return <CurveField port={node.inputs.value} readOnly />;
});

const MathExpressionPreview = observer(({ node }: { node: Node }) => {
  return <MathExpression value={node.inputs.value.value} />;
});

const SwatchPreview = observer(({ node }: { node: Node }) => {
  return <ColorSwatch value={node.inputs.value.value} />;
});

const NumberPreview = observer(({ node }: { node: Node }) => {
  const { precision, value } = node.getAllInputs();

  const shift = 10 ** precision;
  const number = Math.round(value * shift) / shift;

  return (
    <div
      style={{
        backgroundColor: 'var(--color-neutral-surface-minimal-idle-bg)',
        color: 'var(--color-neutral-surface-minimal-idle-fg-default)',
        font: 'var(--font-body-xl)',
        padding: 'var(--component-spacing-xl)',
        textAlign: 'center',
      }}
    >
      {number}
    </div>
  );
});

export const defaultSpecifics = {
  'studio.tokens.generic.subgraph': SubgraphExplorer,
  'tokens.studio.array.map': SubgraphExplorer,
  'tokens.studio.array.reduce': SubgraphExplorer,
  'tokens.studio.array.filter': SubgraphExplorer,
  'tokens.studio.array.find': SubgraphExplorer,

  'studio.tokens.preview.colorScale': ColorScalePreview,
  'studio.tokens.preview.colorCompare': ColorComparePreview,
  'studio.tokens.preview.curve': CurvePreview,
  'studio.tokens.preview.mathExpression': MathExpressionPreview,
  'studio.tokens.preview.number': NumberPreview,
  'studio.tokens.preview.swatch': SwatchPreview,
};
