'use client';

import { Box, Button, Heading, Stack, TextInput, } from '@tokens-studio/ui';
import React from 'react';

import { Plus, Search, Upload } from 'iconoir-react';

const Page = () => {
    const [search, setSearch] = React.useState('');

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
                            <Button variant='primary' icon={<Plus />}>Create graph</Button>
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
            </Box >
        </Stack >
    );
};


export default Page;
