import { Box, IconButton, Stack, Text } from '@tokens-studio/ui';
import { DockLayout, LayoutData, TabGroup } from 'rc-dock';
import { LiveProvider } from 'react-live';
import { code, scope } from '#/components/preview/scope.tsx';
import { useDispatch } from '#/hooks/index.ts';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {
  showJourneySelector,
  tabs as tabsSelector,
  currentTab as currentTabSelector,
} from '#/redux/selectors/index.ts';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
// @ts-ignore
import { themes } from 'prism-react-renderer';

//import the example
import example from '#/examples/scale.json';

import { useTheme } from '#/hooks/useTheme.tsx';
import { useJourney } from '#/journeys/basic.tsx';
import { JoyrideTooltip } from '#/components/joyride/tooltip.tsx';
import { Menubar } from '#/components/editorMenu/index.tsx';
import { EditorRefs } from '#/service/refs.ts';
import { EditorTab } from '#/components/editor/index.tsx';
import { ResolverData } from '#/types/file.ts';

const Wrapper = () => {
  const currentTab = useSelector(currentTabSelector);
  const [theCode, setTheCode] = useState(code);
  const [loadedExample, setLoadedExample] = useState(false);
  const dispatch = useDispatch();
  const showJourney = useSelector(showJourneySelector);
  const theme = useTheme();

  useEffect(() => {
    if (!loadedExample) {
      const exampleData = example as ResolverData;

      const { state, code, edges, nodes } = exampleData;

      const editor = EditorRefs[currentTab.id];

      if (!editor.current) {
        return;
      }

      if (code !== undefined) {
        setTheCode(code);
      }

      editor.current.load({
        nodes: nodes,
        edges: edges,
        nodeState: state,
      });
      setLoadedExample(true);
    }
  }, [currentTab.id, loadedExample]);

  const [{ steps }] = useJourney();
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      dispatch.journey.setShowJourney(false);
    }
  };

  return (
    <>
      {/* @ts-ignore */}
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={showJourney}
        tooltipComponent={JoyrideTooltip}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <Stack
          direction="row"
          css={{ height: '100%', background: '$bgDefault' }}
        >
          <Menubar />
          <Box css={{position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
            <LiveProvider
              code={theCode}
              scope={scope}
              theme={theme === 'light' ? themes.vsLight : themes.vsDark}
              noInline={true}
              enableTypeScript={true}
              language="jsx"
            >
              <EditorTab id="1" title="Example" />
            </LiveProvider>
          </Box>
          {/* TODO: Can we consolidate the panes? Some are in the graph-editor, some are in the ui package. Feels like everything should be part of the graph editor. */}
        </Stack>
      </div>
    </>
  );
};

{/* <Box css={{ position: 'fixed', top: '$3', left: '$3', zIndex: 1 }}>
<TokensStudioLogo style={{ height: '3rem', width: 'auto' }} />
</Box>
<Toolbar codeRef={ref} refs={refs} setTheCode={setTheCode} />
<Box
value={currentTab?.id}
onValueChange={onTabChange}
style={{
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  background: '$bgCanvas',
  position: 'relative',
}} */}

export default Wrapper;
