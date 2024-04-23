import { LivePreview } from 'react-live';
import { OutputProvider } from './scope.tsx';
import { Box } from '@tokens-studio/ui';
import React from 'react';
import { TokenContextProvider } from './contextExamples/lion/context.ts';

export const Preview = () => {


  return (
    <div id="preview">
      <OutputProvider value={''}>
        <TokenContextProvider context={''}>
          <Box css={{ padding: '$5', overflow: 'auto', maxHeight: '80vh' }}>
            <LivePreview />
          </Box>
        </TokenContextProvider>
      </OutputProvider>
    </div>
  );
};
