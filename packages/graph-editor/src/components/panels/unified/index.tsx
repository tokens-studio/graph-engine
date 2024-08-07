import { Accordion, Box, Heading, IconButton, Separator, Stack } from '@tokens-studio/ui';
import { InfoCircle } from 'iconoir-react';
import { InputInner } from '../inputs/index.js'
import { OutputSheetObserver } from '../output/index.js';
import { StyledChevron } from '../index.js';
import { currentNode } from '@/redux/selectors/graph.js';
import { styled } from '@/lib/stitches/index.js';
import { useGraph } from '@/hooks/useGraph.js';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';



const StyledTrigger = styled(Accordion.Trigger, {
    width: '100%',
    border: '1px solid $borderSubtle !important',
    borderRadius: '$small'
})



export function UnifiedSheet() {
    const graph = useGraph();
    const nodeID = useSelector(currentNode);
    const selectedNode = useMemo(() => graph?.getNode(nodeID), [graph, nodeID]);



    if (!selectedNode) {
        return <></>;
    }


    return (
        <Box
            css={{
                height: '100%',
                width: '100%',
                flex: 1,
                display: 'flex',
                overflow: 'auto',
                flexDirection: 'column',
            }}
        >
            <Stack
                direction="column"
                gap={2}
                css={{ height: '100%', flex: 1, padding: '$3' }}
            >
                <Stack direction="column" gap={3}>
                    <Stack gap={2} align="start" justify="between">
                        <Heading size="large"> {selectedNode.factory.title}</Heading>
                        <IconButton
                            size='small'
                            tooltip={selectedNode.factory.description}
                            icon={<InfoCircle />}
                        />
                    </Stack>
                </Stack>
                <Accordion defaultValue="inputs" collapsible>
                    <Accordion.Item value='inputs'  >
                        <StyledTrigger>
                            <Stack align='center' gap={2}>
                                <StyledChevron />
                                Inputs
                            </Stack>
                        </StyledTrigger>
                        <Accordion.Content>
                            <Separator orientation='horizontal' />
                            <InputInner selectedNode={selectedNode} />
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion>
                <Accordion defaultValue="outputs" collapsible>
                    <Accordion.Item value='outputs'  >
                        <StyledTrigger>
                            <Stack align='center' gap={2}>
                                <StyledChevron />
                                Outputs
                            </Stack>
                        </StyledTrigger>
                        <Accordion.Content>
                            <Separator orientation='horizontal' />
                            <OutputSheetObserver node={selectedNode} />
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion>
            </Stack>
        </Box>
    );
}
