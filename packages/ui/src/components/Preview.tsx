import { Box, Button, Stack, ToggleGroup } from '@tokens-studio/ui';
import { Preview as ComponentPreview } from '#/components/preview/index.tsx';
import { LiveEditor, LiveError } from 'react-live';
import { ChevronDownIcon, ChevronUpIcon, CodeIcon, FileIcon, VideoIcon } from '@iconicicons/react';
import { useCallback, useState } from 'react';

export const Preview = ({ style, codeRef, ...rest }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleTab, setVisibleTab] = useState("preview");

  const handleToggleVisible = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible, setIsVisible]);

  return (
      <Box
        {...rest}
      >
        <Stack direction="column" css={{maxHeight: '80vh', maxWidth: '40vw', backgroundColor: '$bgSubtle', border: '1px solid $borderSubtle', borderRadius: '$medium', boxShadow: '$small'}}>
          <Stack direction="row" justify="between" align="center">
            {isVisible && <ToggleGroup type="single" value={visibleTab} onValueChange={setVisibleTab}>
              <ToggleGroup.Item value="preview"><VideoIcon /></ToggleGroup.Item>
              <ToggleGroup.Item value="editor"><FileIcon /></ToggleGroup.Item>
            </ToggleGroup>}
            <Button size="small" onClick={handleToggleVisible} icon={isVisible ? <ChevronDownIcon /> : <ChevronUpIcon />} variant="invisible">
              Preview
            </Button>
          </Stack>
          {isVisible &&
          <Box css={{overflowY: 'scroll', flexGrow: 1, paddingTop: '$2'}}>
            {visibleTab === "preview" && <Box css={{width: '100%', display: 'flex'}}><ComponentPreview /></Box>}
            {visibleTab === "editor" && <Box
              css={{
                fontSize: '$xsmall',
                fontFamily: 'monospace',
                overflowY: 'scroll',
                maxHeight: '100%',
                flex: 1,
              }}
            >
              <div ref={codeRef}>
                <LiveEditor />
              </div>
              <LiveError />
            </Box>}
            </Box>}
        </Stack>
    </Box>
  );
};
