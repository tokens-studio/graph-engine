
import { Box, Stack, Text } from '@tokens-studio/ui';
import React from 'react';

import { IconHolder } from '#/components/IconHolder.tsx';

export const NodeEntry = ({
    icon,
    text,
}: {
    icon: React.ReactNode | string;
    text: string;
}) => {
    return (
        <Stack direction="row" gap={2} justify="start" align="center" title={text}>
            <IconHolder>{icon}</IconHolder>
            <Text size="xsmall" css={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '120px' }} >{text}</Text>
        </Stack>
    );
};