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
    // Note we are explicitly setting the font-family to 'initial' here because otherwise the value might leak into the preview from a higher level
    <div id="preview" style={{ fontFamily: 'initial' }}>
      <OutputProvider value={output}>
        <TokenContextProvider context={output}>
          <Box css={{ padding: '$5', overflow: 'auto', maxHeight: '80vh' }}>
            <LivePreview />
          </Box>
        </TokenContextProvider>
      </OutputProvider>
    </div>
  );
};
