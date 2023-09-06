import { Box } from '@tokens-studio/ui';
//@ts-ignore This is the correct import
import { Preview as ComponentPreview } from '#/components/preview/index.tsx';

import { LiveEditor, LiveError } from 'react-live';

export const Preview = () => {
  return (
    <Box css={{ background: '$bgSurface', width: '100%', height: '100%' }}>
      <ComponentPreview />
    </Box>
  );
};

export const CodeEditor = ({ codeRef, ...rest }) => {
  return (
    <Box
      css={{
        fontSize: '$xsmall',
        fontFamily: 'monospace',
        overflow: 'auto',
        flex: 1,
      }}
      {...rest}
    >
      <div ref={codeRef}>
        <LiveEditor />
      </div>
      <LiveError />
    </Box>
  );
};
