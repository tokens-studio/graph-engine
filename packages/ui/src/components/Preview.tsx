import { Box, Button, Stack, ToggleGroup } from '@tokens-studio/ui';
//@ts-ignore This is the correct import
import { Preview as ComponentPreview } from '#/components/preview/index.tsx';

import { LiveEditor, LiveError } from 'react-live';
import { ChevronDownIcon, ChevronUpIcon, CodeIcon, FileIcon, VideoIcon } from '@iconicicons/react';
import { useCallback, useState } from 'react';

export const Preview = ({ codeRef}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [visibleTab, setVisibleTab] = useState("preview");

  const handleToggleVisible = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible, setIsVisible]);

  return (
    <Box css={{position: 'fixed', top: '$3', right: '$3'}}>
      <Stack direction="column" css={{ maxHeight: '80vh', maxWidth: '40vw', backgroundColor: '$bgDefault', border: '1px solid $borderSubtle', borderRadius: isVisible ? '12px' : '$small', overflow: 'hidden', boxShadow: '$small' }}>
        <Stack direction="row" justify="between" align="center" css={{ borderBottom: isVisible ? '1px solid $borderSubtle' : '1px solid transparent', padding: isVisible ? '$3' : 0 }}>
          {isVisible && <ToggleGroup type="single" value={visibleTab} onValueChange={setVisibleTab}>
            <ToggleGroup.Item value="preview"><VideoIcon /></ToggleGroup.Item>
            <ToggleGroup.Item value="editor"><FileIcon /></ToggleGroup.Item>
          </ToggleGroup>}
          <Button onClick={handleToggleVisible} icon={isVisible ? <ChevronDownIcon /> : <ChevronUpIcon />} variant="invisible">
              Preview
            </Button>
        </Stack>
        {isVisible && <Box css={{overflowY: 'scroll', flexGrow: 1, paddingTop: '$2'}}>
          <Box css={{ width: '100%', display: visibleTab === "preview" ? 'flex' : 'none' }}><ComponentPreview /></Box>
          <Box
            css={{
              fontSize: '$xsmall',
              fontFamily: 'monospace',
              overflowY: 'scroll',
              maxHeight: '100%',
              flex: 1,
              display: visibleTab === "editor" ? 'flex' : 'none'
            }}
          >
            <div ref={codeRef}>
              <LiveEditor />
            </div>
            <LiveError />
          </Box>
        </Box>}
      </Stack>
    </Box>
  );
}
