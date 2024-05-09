'use client';

import { Box, Button, EmptyState, Heading, Spinner, Stack, Text, TextInput, Toast } from '@tokens-studio/ui';
import React from 'react';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { GraphService, configure } from '@/api/index.ts';


import Link from 'next/link.js';
import { useErrorToast } from '@/hooks/useToast.tsx';
import { GraphUp, Plus, Search, Upload } from 'iconoir-react';
import ago from 's-ago';
import { Graph } from '@tokens-studio/graph-engine';


/**
 * Needed for the side effect of setting the api
 */
configure();
const fetchGraphs = async (page: number) => {
    return await GraphService.listGraphs({ page });
}

const Page = () => {

    const [page, setPage] = React.useState(0);
    const [search, setSearch] = React.useState('');
    const { isPending, isError, error, data, isFetching, isPlaceholderData } = useQuery({
        queryKey: ['graphs', page],
        placeholderData: keepPreviousData,
        queryFn: () => fetchGraphs(page)
    });

    const createGraph = async () => {

        const serialized = new Graph().serialize();
        const newGraph = await GraphService.createGraph({
            requestBody: {
                name: 'New graph',
                graph: serialized
            }
        });

        console.log(newGraph);

    };


    useErrorToast(error);

    return (
        <Stack
            css={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'auto',
                background: '$bgDefault',
                paddingTop: '$6'

            }} justify='center'
        >

            <Box css={{ padding: '$5', width: '80%' }}>

                <Stack direction='column' gap={4}>
                    <Stack justify='between'>
                        <Heading size='large'>Graphs</Heading>
                        <Stack gap={3}>
                            <Button variant='secondary' icon={<Upload />}>Import a graph</Button>
                            <Button variant='primary' onClick={createGraph} icon={<Plus />}>Create graph</Button>
                        </Stack>
                    </Stack>
                    <TextInput
                        value={search}
                        placeholder='Filter…'
                        type='search'
                        leadingVisual={<Search />}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {isPending && <Spinner />}


                    <Stack direction='column' gap={2}>
                        {data && data.length > 0 && data.filter(x => x.name.includes(search)).map((graph) => {

                            return <Link href={`/editor?id=${graph.id}`}><Stack width='full' css={{
                                '&:hover': {
                                    background: '$bgEmphasis',
                                },
                                borderRadius: '$medium',
                                borderColor: '$border',
                                padding: '$4'
                            }} direction='row' gap={3} align='center'>
                                <Box css={{
                                    color: '$fgDefault',
                                    padding: '$3',
                                    borderRadius: '$medium',
                                    background: '$bgCanvas',
                                }}>
                                    <GraphUp />
                                </Box>

                                <Stack direction='column'>
                                    <Heading>{graph.name}</Heading>
                                    <Text>{graph.owner}</Text>
                                    <Text size='xsmall' muted>Last updated {ago(new Date(graph.updatedAt))}</Text>
                                </Stack>
                            </Stack>
                            </Link>
                        })
                        }
                    </Stack>
                </Stack>
            </Box >
        </Stack >
    );
};


export default Page;
