import {
  Box,
  Button,
  Heading,
  IconButton,
  Stack,
  ToggleGroup,
} from '@tokens-studio/ui';
import { Preview as ComponentPreview } from '@/components/preview/index.tsx';

import { LiveEditor, LiveError } from 'react-live';
import { MinusIcon, PictureInPictureIcon, VideoIcon } from '@iconicicons/react';
import Code3Icon from '@/assets/svgs/code-3.svg';
import { useCallback, useState } from 'react';
import { usePreviewContext } from '@/providers/preview.tsx';

export const Preview = ({ codeRef }) => {
  const { setCode, code } = usePreviewContext();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleTab, setVisibleTab] = useState('preview');

  const handleSetVisibleTab = useCallback(
    (tab) => {
      if (!tab) {
        setVisibleTab(visibleTab);
        setIsVisible(false);
        return;
      } else {
        setVisibleTab(tab);
      }
    },
    [visibleTab],
  );

  const handleToggleVisible = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible, setIsVisible]);

  const handleChangeCode = useCallback(
    (code) => {
      setCode(code);
    },
    [setCode],
  );

  return (
    <Box css={{ display: 'flex', flexDirection: 'row-reverse' }}>
      <Stack
        direction="column"
        css={{
          direction: 'rtl',
          width: '400px',
          backgroundColor: '$bgDefault',
          border: '1px solid $borderMuted',
          borderRadius: isVisible ? '$small' : '$small',
          overflow: 'hidden',
          boxShadow: '$small',
          resize: isVisible ? 'auto' : 'initial',
        }}
      >
        <Stack
          direction="row"
          justify="between"
          align="center"
          css={{
            direction: 'ltr',
            border: '1px solid transparent',
            background: isVisible ? '$bgSubtle' : '$bgDefault',
            borderBottom: isVisible
              ? '1px solid $borderSubtle'
              : '1px solid transparent',
            '&:hover': {
              background: '$bgSubtle',
            },
          }}
        >
          <Stack
            gap={1}
            css={{
              width: '100%',
              position: 'relative',
              height: '$controlMedium',
            }}
            direction="row"
            align="center"
            justify="end"
          >
            <Box
              onClick={handleToggleVisible}
              css={{
                all: 'unset',
                width: '100%',
                height: '100%',
                position: 'absolute',
                border: 'none',
                left: 0,
                top: 0,
                paddingLeft: '$3',
                fontWeight: '$sansMedium',
                fontSize: '$xsmall',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                cursor: 'pointer',
                userSelect: 'none',
                color: '$fgSubtle',
              }}
            >
              {isVisible ? <MinusIcon /> : <PictureInPictureIcon />}
              <Box css={{ color: '$fgDefault' }}>Preview</Box>
            </Box>
            {isVisible && (
              <Stack gap={2} css={{ position: 'relative' }}>
                <ToggleGroup
                  type="single"
                  value={visibleTab}
                  onValueChange={handleSetVisibleTab}
                >
                  <ToggleGroup.Item value="preview">
                    <VideoIcon id="preview" />
                  </ToggleGroup.Item>
                  <ToggleGroup.Item value="editor">
                    <Code3Icon id="code-editor" />
                  </ToggleGroup.Item>
                </ToggleGroup>
              </Stack>
            )}
          </Stack>
        </Stack>
        {isVisible && (
          <Box
            css={{
              direction: 'ltr',
              overflowY: 'auto',
              flexGrow: 1,
              paddingTop: '0',
            }}
          >
            <Box
              css={{
                width: '100%',
                display: visibleTab === 'preview' ? 'flex' : 'none',
              }}
            >
              <ComponentPreview />
            </Box>

            <Box
              css={{
                fontSize: '$xsmall',
                fontFamily: 'monospace',
                maxHeight: '100%',
                flex: 1,
                padding: 0,
                display: visibleTab === 'editor' ? 'flex' : 'none',
              }}
            >
              <Stack
                direction="column"
                css={{ overflow: 'auto', maxHeight: '80vh' }}
              >
                <LiveError />
                <div ref={codeRef}>
                  <LiveEditor onChange={handleChangeCode} />
                </div>
              </Stack>
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
