import React, { useState } from 'react';
import { PlayIcon, StopIcon, PauseIcon } from '@radix-ui/react-icons';
import { Box, IconButton, Stack } from '@tokens-studio/ui';
import { useGraph } from '@/hooks/useGraph';


enum PlayState {
    PLAYING = 'playing',
    PAUSED = 'paused',
    STOPPED = 'stopped',

}

export function PlayPanel() {
    const graph = useGraph();

    const [state, setState] = useState(PlayState.STOPPED);

    const onPlay = () => {
        graph.start();
        setState(PlayState.PLAYING);
    };

    const onPause = () => {
        if (state !== PlayState.PAUSED) {
            graph.pause();
            setState(PlayState.PAUSED);
        } else {
            graph.resume();
            setState(PlayState.PLAYING);
        }
    }

    const onStop = () => {
        graph.stop();
        setState(PlayState.STOPPED);
    }


    return (
        <Box
            css={{
                height: '100%',
                width: '100%',
                background: '$bgDefault',
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
                <IconButton disabled={!(state === PlayState.STOPPED)} title="Play" onClick={onPlay} icon={<PlayIcon />} />
                <IconButton disabled={state === PlayState.STOPPED} title="Pause" onClick={onPause} icon={<PauseIcon />} variant={state === PlayState.PAUSED ? 'primary' : 'secondary'} />
                <IconButton disabled={state === PlayState.STOPPED} title="Stop" onClick={onStop} icon={<StopIcon />} />
            </Stack>
        </Box>
    );
}
