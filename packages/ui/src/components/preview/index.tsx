import { LivePreview } from 'react-live';
import { OutputProvider } from './scope.tsx';
import { useSelector } from 'react-redux';
import { Box } from '@tokens-studio/ui';
import React from 'react';
import { outputSelector } from '#/redux/selectors/index.ts';
import { TokenContextProvider } from './contextExamples/lion/context.ts';

export const Preview = () => {
  const output = useSelector(outputSelector);

  return (
    <div id="preview">
      <OutputProvider value={output}>
        <TokenContextProvider context={output}>
          <Box css={{ padding: '$5', overflow: 'hidden' }}>
            <LivePreview />
          </Box>
        </TokenContextProvider>
      </OutputProvider>
    </div>
  );
};
