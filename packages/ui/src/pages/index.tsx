'use client';

import '@/styles/styles.scss';
import '@tokens-studio/graph-editor/index.css';

import { Box } from '@tokens-studio/ui';
import { EditorTab } from '@/components/editor/index.tsx';
import { JoyrideTooltip } from '@/components/joyride/tooltip.tsx';
import { observer } from 'mobx-react-lite';
import {
  showJourneySelector,
} from '@/redux/selectors/index.ts';
import { useDispatch } from '@/hooks/index.ts';
import { useJourney } from '@/components/journeys/basic.tsx';
import { useSelector } from 'react-redux';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import React, { useCallback } from 'react';
import globalState from '@/mobx/index.tsx';

const Wrapper = observer(() => {
  const dispatch = useDispatch();


  const ref = useCallback((editor) => {
    globalState.refs.editor.set(editor);
  }, []);


  const showJourney = useSelector(showJourneySelector);




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
          background: '$bgCanvas',
          isolation: 'isolate',
        }}
      >
        <EditorTab ref={ref} />
      </Box>
    </>
  );
});

const Index = () => {
  return <Wrapper />;
}


export default Index;
