import { Handle, HandleContainer } from '../../handles.tsx';
import { Label, Stack, Text, TextInput } from '@tokens-studio/ui';
import { PreviewArray } from '../../preview/array.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node as balancedScaleNode } from '@tokens-studio/graph-engine/nodes/color/balancedScale.js';
import PreviewColor from '../../preview/color.tsx';
import PreviewNumber from '../../preview/number.tsx';
import React, { useCallback, useMemo } from 'react';

const BalancedScaleNode = () => {
    const { input, state, output, setState } = useNode();

    const outputHandles = useMemo(() => {
        const values = output || {};

        const { array, ...rest } = values;

        const handles = Object.entries(rest)
            .sort(([a], [b]) => {
                //Force numeric sorting
                return ~~a < ~~b ? -1 : 1;
            })
            .map(([key, value]) => {
                return (
                    <Handle id={key} key={key}>
                        <Text>{key}</Text>
                        <PreviewColor value={value} />
                    </Handle>
                );
            });

        return (
            <>
                <Handle id="array">
                    <Text>Color Set</Text>
                    <PreviewArray value={array} />
                </Handle>
                {handles}
            </>
        );
    }, [output]);

    const setSteps = useCallback((ev) => {
        const steps = ev.target.value;
        setState((state) => ({
            ...state,
            steps,
        }));
    }, []);

    return (
        <Stack direction="row" gap={4}>
            <HandleContainer type="target">
                <Handle id="startingColor">
                    <Stack direction="row" justify="between" gap={3} align="center">
                        <Label>Starting Color</Label>
                        <PreviewColor value={input.startingColor} />
                    </Stack>
                </Handle>
                <Handle id="steps">
                    <Stack direction="row" justify="between" gap={3} align="center">
                        <Label>Steps</Label>
                        {input.steps !== undefined ? (
                            <PreviewNumber value={input.steps} />
                        ) : (
                            <TextInput onChange={setSteps} value={state.steps} />
                        )}
                    </Stack>
                </Handle>
            </HandleContainer>
            <HandleContainer type="source">{outputHandles}</HandleContainer>
        </Stack>
    );
};

export default WrapNode(BalancedScaleNode, {
    ...balancedScaleNode,
    title: 'Balanced Color Scale',
});
