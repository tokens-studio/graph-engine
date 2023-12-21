import { Box } from '@tokens-studio/ui';
import { LiveProvider } from 'react-live';
import { scope } from '#/components/preview/scope.tsx';
import { useDispatch } from '#/hooks/index.ts';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import {
  previewCodeSelector,
  showJourneySelector,
} from '#/redux/selectors/index.ts';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
// @ts-ignore
import { themes } from 'prism-react-renderer';

import { useTheme } from '#/hooks/useTheme.tsx';
import { useJourney } from '#/journeys/basic.tsx';
import { JoyrideTooltip } from '#/components/joyride/tooltip.tsx';
import { EditorTab } from '#/components/editor/index.tsx';

const Wrapper = () => {
  const dispatch = useDispatch();
  const showJourney = useSelector(showJourneySelector);
  const theme = useTheme();
  const previewCode = useSelector(previewCodeSelector);

  const [{ steps }] = useJourney();
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
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
      <Box
        css={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: '$bgDefault',
          isolation: 'isolate',
        }}
      >
        <LiveProvider
          code={previewCode}
          scope={scope}
          theme={theme === 'light' ? themes.vsLight : themes.vsDark}
          noInline={true}
          enableTypeScript={true}
          language="jsx"
        >
          <EditorTab />
        </LiveProvider>
      </Box>
    </>
  );
};

export default Wrapper;
