// ui
import { Stack, Text } from '@tokens-studio/ui';
import {
    Handle,
    HandleContainer,
} from '../../../../components/flow/handles.tsx';
import { PreviewColor } from '../../preview/color.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/color/distance.js';
import PreviewNumber from '../../preview/number.tsx';
import React from 'react';

const ColorDistanceNode = (props) => {
    const { input, output, state, setState } = useNode();

    return (
        <Stack direction="row" gap={4}>
            <HandleContainer type="target">
                <Handle id="color1">
                    <Text>Color 1</Text>
                    <Text>
                        <PreviewColor value={input.color1} />
                    </Text>
                </Handle>
                <Handle id="color2">
                    <Text>Color 2</Text>
                    <Text>
                        <PreviewColor value={input.color2} />
                    </Text>
                </Handle>
            </HandleContainer>

            <HandleContainer type="source">
                <Handle id="output">
                    <Text>Output</Text>
                    <PreviewNumber value={output?.distance} />
                </Handle>
            </HandleContainer>
        </Stack>
    );
};

export default WrapNode(ColorDistanceNode, {
    ...node,
    title: 'Color Distance',
});
