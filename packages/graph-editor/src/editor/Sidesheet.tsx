import React from 'react';
import { Box, IconButton, Stack, Heading, Text } from '@tokens-studio/ui';
import * as Portal from '@radix-ui/react-portal';
import { CloseIcon } from "@iconicicons/react"

export function Sidesheet({ title, children }) {
    return (<Portal.Root>
        <Box css={{ display: 'flex', position: 'fixed', right: 0, top: '30vh', bottom: 0, zIndex: 100 }}>
            <Box css={{ maxWidth: 'clamp(180px, 40vw, 400px)', backgroundColor: '$bgCanvas', padding: '$6', borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px', boxShadow: '$contextMenu', borderLeft: '1px solid $borderSubtle', borderTop: '1px solid $borderSubtle' }}>
                <Box css={{ position: 'absolute', right: '$6' }}><IconButton icon={<CloseIcon />} variant="invisible" onClick={() => setIsOpen(false)} /></Box>
                <Stack direction="column" gap={3}>
                    <Heading size="large">{title}</Heading>
                    <Text muted>Add extra configuration here that should be shown on selection of a node. When something is selected, the sidesheet is placed on top of other content.</Text>
                </Stack>
                {children}
            </Box>
        </Box>
    </Portal.Root>)
}