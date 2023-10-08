import React from 'react';
import { Box, IconButton, Stack, Heading, Text } from '@tokens-studio/ui';
import * as Portal from '@radix-ui/react-portal';
import { CloseIcon } from '@iconicicons/react';
import { isSideSheetMinimizedSelector } from '#/redux/selectors/ui';
import { useDispatch, useSelector } from 'react-redux';

export function Sidesheet({ title, children }) {
  const isMinimized = useSelector(isSideSheetMinimizedSelector);
  const dispatch = useDispatch();

  const handleToggleMinimized = () =>
    dispatch.ui.setIsSideSheetMinimized(!isMinimized);

  if (isMinimized) {
    return (
      <Portal.Root>
        <Box
          as="button"
          onClick={handleToggleMinimized}
          css={{
            position: 'fixed',
            right: 0,
            bottom: 0,
            zIndex: 100,
            backgroundColor: '$bgCanvas',
            border: '1px solid $borderSubtle',
            borderRightWidth: 0,
            borderBottomWidth: 0,
            borderTopLeftRadius: '$medium',
            padding: '$3 $4',
            cursor: 'pointer',
            fontSize: '$xsmall',
            fontWeight: '$sansMedium',
          }}
        >
          {title}
        </Box>
      </Portal.Root>
    );
  }
  return (
    <Portal.Root>
      <Box
        css={{
          display: 'flex',
          position: 'fixed',
          right: 0,
          minHeight: '30vh',
          bottom: 0,
          zIndex: 100,
        }}
      >
        <Box
          css={{
            maxWidth: 'clamp(180px, 40vw, 400px)',
            backgroundColor: '$bgCanvas',
            padding: '$6',
            borderTopLeftRadius: '16px',
            boxShadow: '$contextMenu',
            borderLeft: '1px solid $borderSubtle',
            borderTop: '1px solid $borderSubtle',
          }}
        >
          <Box css={{ position: 'absolute', right: '$6' }}>
            <IconButton
              icon={<CloseIcon />}
              variant="invisible"
              onClick={handleToggleMinimized}
            />
          </Box>
          <Stack direction="column" gap={4}>
            <Stack direction="column" gap={3}>
              <Heading size="large">{title}</Heading>
              <Text muted>We could add the description here as well.</Text>
            </Stack>
            {children}
          </Stack>
        </Box>
      </Box>
    </Portal.Root>
  );
}
