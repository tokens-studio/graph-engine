import { Box, Button, Heading, IconButton, Stack, ToggleGroup } from '@tokens-studio/ui';
import { Preview as ComponentPreview } from '#/components/preview/index.tsx';

import { LiveEditor, LiveError } from 'react-live';
import { CodeIcon, MinusIcon, VideoIcon } from '@iconicicons/react';
import { useCallback, useState } from 'react';

export const Preview = ({ codeRef}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleTab, setVisibleTab] = useState("preview");

  const handleToggleVisible = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible, setIsVisible]);

  return (
    <Stack direction="column" css={{ maxHeight: '45vh', maxWidth: 'clamp(180px, 40vw, 400px)', backgroundColor: '$bgDefault', border: '1px solid $borderMuted', borderRadius: isVisible ? '$small' : '$small', overflow: 'hidden', boxShadow: '$small' }}>
      <Stack direction="row" justify="between" align="center" css={{ borderBottom: isVisible ? '1px solid $borderSubtle' : '1px solid transparent', padding: isVisible ? '$2 $2 $2 $4' : 0 }}>
        {isVisible ? <Stack gap={1} css={{width:'100%'}} direction="row" align="center" justify="between"><Heading>Preview</Heading><Stack gap={2}><ToggleGroup type="single" value={visibleTab} onValueChange={setVisibleTab}>
          <ToggleGroup.Item value="preview"><VideoIcon /></ToggleGroup.Item>
          <ToggleGroup.Item value="editor"><CodeIcon /></ToggleGroup.Item>
        </ToggleGroup><IconButton variant="invisible" icon={<MinusIcon />} onClick={handleToggleVisible} /></Stack></Stack> : <Button css={{width: '100%'}} onClick={handleToggleVisible}  variant="invisible">
            Preview
          </Button>}
      </Stack>
      {isVisible && <Box css={{overflowY: 'scroll', flexGrow: 1, paddingTop: '0'}}>
        <Box css={{ width: '100%', display: visibleTab === "preview" ? 'flex' : 'none' }}><ComponentPreview /></Box>
        <Box
          css={{
            fontSize: '$xsmall',
            fontFamily: 'monospace',
            overflowY: 'scroll',
            maxHeight: '100%',
            flex: 1,
            padding: 0,
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
  );
}
