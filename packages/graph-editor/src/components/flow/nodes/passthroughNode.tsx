import { Stack } from '@tokens-studio/ui';
import React from 'react';
import { HandleContainer } from '../handles';
import { PortArray } from '../wrapper/nodeV2';
import { useLocalGraph } from '@/context/graph';


export const PassthroughNode = (args) => {
    const { id } = args;
    const graph = useLocalGraph();
    const node = graph.getNode(id);

    return (
        <Stack
            direction="column"
            gap={2}
            css={{ borderRadius: '$medium', background: '$gray6', padding: '$2 $4 $2 $3'}}
        >
            {node && <Stack direction="row" gap={2}>
                <HandleContainer type="target" full isSmall>
                    <PortArray ports={node.inputs} />
                </HandleContainer>
                <HandleContainer type="source" full isSmall>
                    <PortArray ports={node.outputs} hideNames />
                </HandleContainer>
            </Stack>}
        </Stack>
    )
}