import { Box, Heading, Stack, Text } from '@tokens-studio/ui';
import { keyMap, keyMapDescriptions } from '../../hotKeys/index.js'
import { styled } from '@/lib/stitches/index.js';
import { useMemo } from 'react';
import React from 'react'


const Code = styled('code', {
    color: '$fgSubtle',
    padding: '$1',
    border: '1px solid $borderSubtle',
});

export const ShortcutsPanel = () => {

    const entries = useMemo(() => {
        return Object.entries(keyMap).map(([id, triggers]) => {

            //Get the description
            const description = keyMapDescriptions[id];
            //Get the first trigger
            const trigger = Array.isArray(triggers) ? triggers[0] : triggers;

            //Now split the trigger
            const pieces = trigger.split('+');

            return (
                <Stack gap={2}>
                    <Stack css={{ flex: 1 }} gap={1} justify='end'>
                        {/* Place a + between the values */}
                        {pieces.map((piece, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <Text> + </Text>}
                                <Code>{piece}</Code>
                            </React.Fragment>
                        ))}
                    </Stack>
                    <Text css={{ flex: 1 }} >{description}</Text>
                </Stack>
            );
        });
    }, []);


    return (
        <Box
            css={{
                height: '100%',
                width: '100%',
                padding: '$4',
                paddingTop: '$5',
                boxSizing: 'border-box',
                flex: 1,
                display: 'flex',
                overflow: 'auto',
                flexDirection: 'column',
            }}
        >
            <Heading size='large'>Keyboard Shortcuts</Heading>
            <br />
            <Stack direction="column" gap={4} width="full">
                {entries}
            </Stack>
        </Box>
    );
}