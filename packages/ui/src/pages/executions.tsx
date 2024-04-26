'use client';
import { Box } from '@tokens-studio/ui';
import { LiveProvider } from 'react-live';
import { scope } from '@/components/preview/scope.tsx';
import { useDispatch } from '@/hooks/index.ts';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import {
    previewCodeSelector,
    showJourneySelector,
} from '@/redux/selectors/index.ts';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useJourney } from '@/components/journeys/basic.tsx';
import { JoyrideTooltip } from '@/components/joyride/tooltip.tsx';
import { EditorTab } from '@/components/editor/index.tsx';
import globalState, { GlobalState } from '@/mobx/index.tsx';

const Page = () => {



    return (
        <>
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
            />

        </>
    );
};


export default Page;
