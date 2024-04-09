import { useGraph } from '@/hooks/useGraph';
import { Stack } from '@tokens-studio/ui';
import React from 'react';
import { HandleContainer } from '../handles';
import { PortArray } from '../wrapper/nodeV2';


export const PassthroughNode = (args) => {
    const { id } = args;
    const graph = useGraph();
    const node = graph.getNode(id);

    return <Stack direction="column" gap={2}>
        {node && <Stack direction="row" gap={2}>
            <HandleContainer type="target" full>
                <PortArray ports={node.inputs} hideNames />
            </HandleContainer>
            <HandleContainer type="source" full>
                <PortArray ports={node.outputs} hideNames />
            </HandleContainer>
        </Stack>}
    </Stack>
}