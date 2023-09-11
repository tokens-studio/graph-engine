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
import { EditorTab } from '#/components/editor/index.tsx';

const Wrapper = () => {
  const [theCode, setTheCode] = useState(code);
  const dispatch = useDispatch();
  const showJourney = useSelector(showJourneySelector);
  const theme = useTheme();

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
      <Box css={{ position: 'relative', display: 'flex', flexDirection: 'row', width: '100%', height: '100%', overflow: 'hidden', background: '$bgDefault'  }}>
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
    </>
  );
};

export default Wrapper;
