import { dockerSelector } from "@/redux/selectors/refs";
import { Box, Button } from "@tokens-studio/ui";
import React, { useCallback } from 'react';
import { useSelector } from "react-redux";
import { EyeSolid } from "iconoir-react";
import { GraphEditor } from "@/editor/graphEditor";
import { ImperativeEditorRef } from "..";
import { Node } from "@tokens-studio/graph-engine";
import { observer } from "mobx-react-lite";
import { CurveField } from "@/components/controls/curve";
import { ColorSwatch } from "@/components/preview/swatch";
import { ColorScale } from "@/components/preview/colorScale";
import { ColorCompare } from "@/components/preview/colorCompare";
import { MathExpression } from "@/components/preview/mathExpression";

const SubgraphExplorer = ({ node }) => {

    const dockerRef = useSelector(
        dockerSelector,
    );
    const onToggle = useCallback(() => {

        if (!dockerRef?.current) {
            return;
        }

        let oneShot = false;
        const innerGraph = node._innerGraph;
        const graphId = innerGraph.annotations['engine.id'];
        const title = 'Subgraph ' + (innerGraph.annotations['engine.title'] || '');
        //Find the container
        const existing = dockerRef.current.find(graphId);



        const ref = (o: ImperativeEditorRef) => {
            if (o && !oneShot) {
                o.load(innerGraph);
                oneShot = true
            }

        }

        if (!existing) {
            const newTab = {
                cached: true,
                closable: true,
                id: graphId,
                group: 'graph',
                title,
                content: (
                    <GraphEditor ref={ref} id={graphId} />
                ),
            };

            dockerRef.current.dockMove(newTab, 'graphs', 'middle');
        } else {
            dockerRef.current.updateTab(graphId, null, true);
        }
    }, [dockerRef, node._innerGraph]);



    return <Button icon={<EyeSolid />} onClick={onToggle}>Subgraph Explorer</Button>

}

const ColorComparePreview = observer(({ node }: { node: Node }) => {

    return <ColorCompare colors={[node.inputs.colorA.value || '#ffffff', node.inputs.colorB.value || '#000000']} />;
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

    return <Box css={{backgroundColor: '$bgEmphasis', color: '$fgOnEmphasis', fontFamily: '$mono', fontSize: '64px', padding: '$5', textAlign: 'center'}}>{number}</Box>;
});

export const defaultSpecifics = {
    'studio.tokens.generic.subgraph': SubgraphExplorer,
    'tokens.studio.array.map': SubgraphExplorer,

    'studio.tokens.preview.colorScale': ColorScalePreview,
    'studio.tokens.preview.colorCompare': ColorComparePreview,
    'studio.tokens.preview.curve': CurvePreview,
    'studio.tokens.preview.mathExpression': MathExpressionPreview,
    'studio.tokens.preview.number': NumberPreview,
    'studio.tokens.preview.swatch': SwatchPreview,
};
