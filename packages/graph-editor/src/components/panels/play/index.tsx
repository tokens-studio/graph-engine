import React, { useState } from 'react';
import { Play, Pause, Square } from 'iconoir-react';
import { Box, IconButton, Stack } from '@tokens-studio/ui';
import { useGraph } from '@/hooks/useGraph';
import { useDispatch } from '@/hooks';
import { annotatedPlayState } from '@tokens-studio/graph-engine';
import { useSelector } from 'react-redux';
import { playStateSelector } from '@/redux/selectors/graph';


enum PlayState {
    PLAYING = 'playing',
    PAUSED = 'paused',
    STOPPED = 'stopped',

}

export function PlayPanel() {
    const dispatch = useDispatch();
    const state = useSelector(playStateSelector);

    const onPlay = () => {
        dispatch.graph.startGraph();
    };

    const onPause = () => {
        if (state !== PlayState.PAUSED) {
            dispatch.graph.pauseGraph();
        } else {
            dispatch.graph.resumeGraph();
        }
    }

    const onStop = () => {
        dispatch.graph.stopGraph();
    }


    return (
        <Box
            css={{
                height: '100%',
                width: '100%',
                flex: 1,
                display: 'flex',
                overflow: 'auto',
                flexDirection: 'column',
            }}
        >
            <Stack
                direction="row"
                gap={4}
                css={{ height: '100%', flex: 1, padding: '$3' }}
            >
                <IconButton disabled={!(state === PlayState.STOPPED)} title="Play" onClick={onPlay} icon={<Play />} />
                <IconButton disabled={state === PlayState.STOPPED} title="Pause" onClick={onPause} icon={<Pause />} variant={state === PlayState.PAUSED ? 'primary' : 'secondary'} />
                <IconButton disabled={state === PlayState.STOPPED} title="Stop" onClick={onStop} icon={<Square />} />
            </Stack>
        </Box>
    );
}
