import React from 'react';
import { Box, IconButton, Stack, Heading, Text } from '@tokens-studio/ui';
import * as Portal from '@radix-ui/react-portal';
import { CloseIcon } from "@iconicicons/react"

export function Sidesheet({ title, children, isVisible }) {
    const [isOpen, setIsOpen] = React.useState(true);

    return isOpen ? (
        <Portal.Root>
            <Box css={{ display: 'flex', position: 'fixed', right: 0, bottom: 0, zIndex: 100, maxHeight: '45vh' }}>
                <Stack direction="column" gap={3} css={{ overflowY: 'auto', maxWidth: 'clamp(180px, 40vw, 400px)', backgroundColor: '$bgCanvas', padding: '$6', borderTopLeftRadius: '16px', boxShadow: '$contextMenu', borderLeft: '1px solid $borderSubtle', borderTop: '1px solid $borderSubtle' }}>
                    <Stack direction="row" justify="between" gap={3}>
                        <Heading size="large">{title}</Heading>
                        <IconButton icon={<CloseIcon />} variant="invisible" onClick={() => setIsOpen(false)} />
                    </Stack>
                    <Text muted size='small'>Here is where we could show a short description and link to the node docs. Also, this should show the advanced configuration for each node, which we dont want to show on the canvas</Text>
                    {children}
                </Stack>
            </Box>
        </Portal.Root>
    ) : null
}
