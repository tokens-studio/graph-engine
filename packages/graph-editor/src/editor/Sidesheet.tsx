import React from 'react';
import { Box, IconButton, Stack, Heading, Text } from '@tokens-studio/ui';
import * as Portal from '@radix-ui/react-portal';
import { CloseIcon } from "@iconicicons/react"

export function Sidesheet({ title, children, isVisible }) {
    const [isOpen, setIsOpen] = React.useState(true);

    return isOpen ? (
        <Portal.Root>
            <Box css={{ display: 'flex', position: 'fixed', right: 0, bottom: 0, zIndex: 100, maxHeight: '45vh', overflowY: 'auto', paddingBottom: '$5' }}>
                <Stack direction="column" gap={3} css={{ maxWidth: 'clamp(180px, 40vw, 400px)', backgroundColor: '$bgCanvas', padding: '$6', borderTopLeftRadius: '16px', boxShadow: '$contextMenu', borderLeft: '1px solid $borderSubtle', borderTop: '1px solid $borderSubtle' }}>
                    <Box css={{ position: 'absolute', right: '$6' }}>
                        <IconButton icon={<CloseIcon />} variant="invisible" onClick={() => setIsOpen(false)} />
                    </Box>
                    <Stack direction="column" gap={3}>
                        <Heading size="large">{title}</Heading>
                        <Text muted size='small'>Here is where we could show a short description and link to the node docs.</Text>
                    </Stack>
                    {children}
                </Stack>
            </Box>
        </Portal.Root>
    ) : null
}
