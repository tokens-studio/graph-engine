import { LivePreview } from 'react-live';
import { OutputProvider } from './scope.tsx';
// import { TokenContextProvider } from './contextExamples/lion/index.ts';
import { useSelector } from 'react-redux';
import React from 'react';

export const Preview = () => {
  return (
    <div id="preview">
      {/* <OutputProvider value={output}> */}
        {/* <TokenContextProvider context={output}> */}
          <div style={{ padding: '1.5em', overflow: 'hidden' }}>
            <LivePreview />
          </div>
        {/* </TokenContextProvider> */}
      {/* </OutputProvider> */}
    </div>
  );
};
