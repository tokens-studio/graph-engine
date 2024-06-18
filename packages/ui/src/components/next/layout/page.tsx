import { Box, Stack, Text } from '@tokens-studio/ui';
import { GlobalState } from '@/mobx/index.tsx';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

const PageLayout = observer(
  ({
    theme,
    children,
  }: {
    children: React.ReactNode;
    theme: GlobalState['ui']['theme'];
  }) => {
    const theTheme = theme.get();
    useEffect(() => {
      if (theTheme) {
        document.body.className = theTheme + '-theme';
      }
    }, [theTheme]);
    return (
      <Stack css={{ height: '100%', width: '100%'}}>
        <Box>
        </Box>
        <Box css={{ flex: '1' }}>
          {children}
        </Box>
      </Stack>
    );
  },
);

export default PageLayout;
