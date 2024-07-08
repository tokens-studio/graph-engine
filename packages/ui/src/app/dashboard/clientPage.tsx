'use client';

import { Box, Button, Heading, Spinner, Stack, Text, TextInput } from '@tokens-studio/ui';
import { Graph } from '@tokens-studio/graph-engine';
import { GraphUp, Plus, Search, Upload } from 'iconoir-react';
import { client } from '@/api/sdk/index.ts';
import { useErrorToast } from '@/hooks/useToast.tsx';
import { useRouter } from 'next/navigation.js';
import Link from 'next/link.js';
import React from 'react';
import ago from 's-ago';

const Page = () => {
    const [search, setSearch] = React.useState('');
    const router = useRouter();

    const { mutateAsync } = client.graph.createGraph.useMutation();

    const createGraph = async () => {
        const serialized = new Graph().serialize();
        const newGraph = await mutateAsync({
            body: {
                name: 'New graph',
                graph: serialized
            }

        });


        router.push(`/editor/${newGraph.body.id}`);
    };



    const { isLoading, data, error } = client.graph.listGraphs.useQuery(
        ['listGraphs']
    );

    useErrorToast(error);

    return (
        <Stack
            css={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'auto',
                background: '$gray1',
                paddingTop: '$6'

            }} justify='center'
        >

            <Box css={{ padding: '$5', width: '80%' }}>

                <Stack direction='column' gap={4}>
                    <Stack justify='between'>
                        <Heading size='large'>Graphs</Heading>
                        <Stack gap={3}>
                            <Button variant='secondary' icon={<Upload />}>Import a graph</Button>
                            <Button onClick={createGraph} variant='primary' icon={<Plus />}>Create graph</Button>
                        </Stack>
                    </Stack>
                    <TextInput
                        value={search}
                        placeholder='Filter…'
                        type='search'
                        leadingVisual={<Search />}
                        onChange={e => setSearch(e.target.value)}
                    />
                </Stack>
                {isLoading && <Spinner />}
                {!isLoading && <Stack direction='column' gap={2}>
                    {data?.body &&
                        data.body.graphs.length > 0 &&
                        data.body.graphs.filter(x => x.name.includes(search))
                            .map(graph => {
                                return (
                                    <Link href={`/editor/${graph.id}`}>
                                        <Stack
                                            width='full'
                                            css={{
                                                '&:hover': {
                                                    background: '$gray3'
                                                },
                                                borderRadius: '$medium',
                                                borderColor: '$border',
                                                padding: '$4'
                                            }}
                                            direction='row'
                                            gap={3}
                                            align='center'
                                        >
                                            <Box
                                                css={{
                                                    color: '$fgDefault',
                                                    padding: '$3',
                                                    borderRadius: '$medium',
                                                    background: '$gray2'
                                                }}
                                            >
                                                <GraphUp />
                                            </Box>

                                            <Stack direction='column'>
                                                <Heading>{graph.name}</Heading>
                                                <Text size='xsmall' muted>
                                                    Last updated {ago(new Date(graph.updatedAt))}
                                                </Text>
                                            </Stack>
                                        </Stack>
                                    </Link>
                                );
                            })}
                </Stack>}

            </Box >
        </Stack >
    );
};


export default Page;
