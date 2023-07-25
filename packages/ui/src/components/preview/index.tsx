import { LivePreview } from 'react-live';
import { OutputProvider } from './scope.tsx';
import { useSelector } from 'react-redux';
import React from 'react';
import { outputSelector } from '#/redux/selectors/index.ts';
import { TokenContextProvider } from './contextExamples/lion/context.ts';

export const Preview = () => {
  const output = useSelector(outputSelector);

  return (
    <div id="preview">
      <OutputProvider value={output}>
        <TokenContextProvider context={output}>
          <div style={{ padding: '1.5em', overflow: 'hidden' }}>
            <LivePreview />
          </div>
        </TokenContextProvider>
      </OutputProvider>
    </div>
  );
};
