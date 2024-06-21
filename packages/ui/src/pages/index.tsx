'use client';

import '@/styles/styles.scss';
import '@tokens-studio/graph-editor/index.css';

import { Box } from '@tokens-studio/ui';
import { EditorTab } from '@/components/editor/index.tsx';
import { GraphService } from '@/api/index.ts';
import { JoyrideTooltip } from '@/components/joyride/tooltip.tsx';
import { SerializedGraph } from '@tokens-studio/graph-engine';
import { observer } from 'mobx-react-lite';
import { showJourneySelector } from '@/redux/selectors/index.ts';
import { useDispatch } from '@/hooks/index.ts';
import { useErrorToast } from '@/hooks/useToast.tsx';
import { useJourney } from '@/components/journeys/basic.tsx';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router.js';
import { useSelector } from 'react-redux';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import React, { useCallback, useEffect } from 'react';
import globalState from '@/mobx/index.tsx';

const Wrapper = observer(() => {
  const dispatch = useDispatch();

  const router = useRouter();
  const editor = globalState.refs.editor.get();

  const ref = useCallback((editor) => {
    globalState.refs.editor.set(editor);
  }, []);

  const showJourney = useSelector(showJourneySelector);

  const { isLoading, data, error } = useQuery({
    queryKey: ['graph', router.query.id],
    queryFn: () =>
      GraphService.getGraph({
        graphId: router.query.id as string,
      }),
    enabled: !!router.query.id,
  });

  useErrorToast(error);

  useEffect(() => {
    if (editor && data?.graph) {
      editor.loadRaw(data?.graph as SerializedGraph);
    }
  }, [data, editor]);

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
        <EditorTab ref={ref} loading={isLoading} />
      </Box>
    </>
  );
});

const Index = () => {
  return <Wrapper />;
};

export default Index;
