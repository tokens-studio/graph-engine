'use client';

import '@tokens-studio/graph-editor/index.css';
import { Box } from '@tokens-studio/ui';
import { useDispatch } from '@/hooks/index.ts';
import { useSelector } from 'react-redux';
import React, { useCallback, useEffect } from 'react';
import {
  showJourneySelector,
} from '@/redux/selectors/index.ts';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useJourney } from '@/components/journeys/basic.tsx';
import { JoyrideTooltip } from '@/components/joyride/tooltip.tsx';
import { EditorTab } from '@/components/editor/index.tsx';
import globalState, { GlobalState } from '@/mobx/index.tsx';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router.js';
import { GraphService } from '@/api/index.ts';
import { useQuery } from '@tanstack/react-query';
import { useErrorToast } from '@/hooks/useToast.tsx';
import { ImperativeEditorRef } from '@tokens-studio/graph-editor';

const Wrapper = observer(({ theme }: { theme: GlobalState['ui']['theme'] }) => {
  const dispatch = useDispatch();

  const router = useRouter();
  const [editor, setEditor] = React.useState<ImperativeEditorRef>();

  const ref = useCallback((editor) => {

    setEditor(editor);
  }, []);

  // const ref = React.createRef<ImperativeEditorRef>();

  const showJourney = useSelector(showJourneySelector);


  const { isLoading, data, error } = useQuery({
    queryKey: ['graph', router.query.id],
    queryFn: () => GraphService.getGraph({
      graphId: router.query.id as string
    }),
    enabled: !!router.query.id
  });

  useErrorToast(error);


  useEffect(() => {
    if (editor && data?.graph) {
      editor.loadRaw(data?.graph)
    }
  }, [data, editor])




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
  return <Wrapper theme={globalState.ui.theme} />;
}


export default Index;
