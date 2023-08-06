import { LivePreview } from 'react-live';
import { OutputProvider } from './scope.tsx';
import { TokenContextProvider } from './contextExamples/lion/index.ts';
import { useSelector } from 'react-redux';
import { output as outputSelector } from '#/redux/selectors/roots.ts';
import { Box } from '@tokens-studio/ui';

export const Preview = () => {
  const output = useSelector(outputSelector);
  return (
    <div id="preview">
      <OutputProvider value={output}>
        <TokenContextProvider context={output}>
          <Box css={{ padding: '$2', overflow: 'hidden' }}>
            <LivePreview />
          </Box>
        </TokenContextProvider>
      </OutputProvider>
    </div>
  );
};
