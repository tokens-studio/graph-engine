import { Box, Label, Stack } from '@tokens-studio/ui';
import { useResizable } from 'react-resizable-layout';
//@ts-ignore This is the correct import
import { Preview as ComponentPreview } from '#/components/preview/index.tsx';
import { Splitter } from './splitter.tsx';
import { LiveEditor, LiveError } from 'react-live';

export const Preview = ({ style, codeRef, ...rest }) => {
  const { position, separatorProps } = useResizable({
    axis: 'x',
    initial: 250,
    min: 100,
  });

  return (
    <Stack
      direction="row"
      style={style}
      css={{ background: '$bgSurface' }}
      {...rest}
    >
      <Stack
        direction="row"
        style={{ flex: 1 }}
        css={{ background: '$bgSurface' }}
      >
        <Stack direction="column" style={{ width: position }}>
          <Box css={{ flexGrow: 1 }}>
            <ComponentPreview />
          </Box>
        </Stack>
        <Splitter direction="vertical" {...separatorProps} />
        <Stack direction="column" css={{ padding: '$4', flex: 1 }}>
          <Label>Editor</Label>
          <Box
            css={{
              fontSize: '$xsmall',
              fontFamily: 'monospace',
              overflow: 'auto',
              flex: 1,
            }}
          >
            <div ref={codeRef}>
              <LiveEditor />
            </div>
            <LiveError />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};
