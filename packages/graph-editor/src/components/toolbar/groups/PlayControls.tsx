import { Button } from '@tokens-studio/ui';
import { Play, Square } from 'iconoir-react';
import { playStateSelector } from '@/redux/selectors/index.js';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';

enum PlayState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
}

export const PlayControls = () => {
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
  };

  const onStop = () => {
    dispatch.graph.stopGraph();
  };

  return (
    <>
      <Button
        variant="invisible"
        onClick={onPlay}
        disabled={!(state === PlayState.STOPPED)}
        style={{ paddingLeft: '0', paddingRight: '0' }}
      >
        <Play />
      </Button>
      <Button
        variant={state === PlayState.PAUSED ? 'secondary' : 'invisible'}
        onClick={onPause}
        disabled={state === PlayState.STOPPED}
        style={{ paddingLeft: '0', paddingRight: '0' }}
      ></Button>
      <Button
        variant="invisible"
        onClick={onStop}
        disabled={state === PlayState.STOPPED}
        style={{ paddingLeft: '0', paddingRight: '0' }}
      >
        <Square />
      </Button>
    </>
  );
};
