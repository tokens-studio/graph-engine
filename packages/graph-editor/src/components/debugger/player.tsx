import { DebugInfo } from './data.js';
import { IconButton, Select, Stack, Text } from '@tokens-studio/ui';
import { TimelineState } from '@xzdarcy/react-timeline-editor';
import Pause from '@tokens-studio/icons/Pause.js';
import Play from '@tokens-studio/icons/Play.js';
import React, { useEffect, useState } from 'react';
import Trash from '@tokens-studio/icons/Trash.js';
import UndoAction from '@tokens-studio/icons/UndoAction.js';
import ZoomIn from '@tokens-studio/icons/ZoomIn.js';
import ZoomOut from '@tokens-studio/icons/ZoomOut.js';

export const scaleWidth = 160;
export const scale = 5;
export const startLeft = 20;

export const Rates = [0.2, 0.5, 1.0, 1.5, 2.0];

export interface TimelinePlayerProps {
  timelineState: React.MutableRefObject<TimelineState> | undefined;
  autoScrollWhenPlay: React.MutableRefObject<boolean>;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  data: DebugInfo;
}

const TimelinePlayer = (props: TimelinePlayerProps) => {
  const { timelineState, autoScrollWhenPlay, setScale, data } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    if (!timelineState?.current) return;
    const engine = timelineState.current;
    engine.listener.on('play', () => setIsPlaying(true));
    engine.listener.on('paused', () => setIsPlaying(false));
    engine.listener.on('afterSetTime', ({ time }) => setTime(time));
    engine.listener.on('setTimeByTick', ({ time }) => {
      setTime(time);

      if (autoScrollWhenPlay.current) {
        const autoScrollFrom = 500;
        const left = time * (scaleWidth / scale) + startLeft - autoScrollFrom;
        timelineState.current.setScrollLeft(left);
      }
    });

    return () => {
      if (!engine) return;
      engine.pause();
      engine.listener.offAll();
    };
  }, []);

  const handlePlayOrPause = () => {
    if (!timelineState?.current) return;
    if (timelineState.current.isPlaying) {
      timelineState.current.pause();
    } else {
      timelineState.current.play({ autoEnd: true });
    }
  };

  const handleRateChange = (rate: string) => {
    if (!timelineState?.current) return;
    const asNum = parseFloat(rate);
    setRate(asNum);
    timelineState.current.setPlayRate(asNum);
  };

  const timeRender = (time: number) => {
    const float = (parseInt((time % 1) * 100 + '') + '').padStart(2, '0');
    const min = (parseInt(time / 60 + '') + '').padStart(2, '0');
    const second = (parseInt((time % 60) + '') + '').padStart(2, '0');
    return <>{`${min}:${second}.${float.replace('0.', '')}`}</>;
  };

  const reset = () => {
    if (!timelineState?.current) return;
    timelineState.current.setTime(0);
  };
  const zoomIn = () => {
    setScale((prev) => prev * 1.2);
  };
  const zoomOut = () => {
    setScale((prev) => prev * 0.8);
  };
  const trash = () => {
    data.clear();
  };

  return (
    <Stack align="center" gap={2} css={{ padding: '$2' }}>
      <IconButton
        icon={isPlaying ? <Pause /> : <Play />}
        onClick={handlePlayOrPause}
        variant={'primary'}
      ></IconButton>
      <Select onValueChange={handleRateChange}>
        <Select.Trigger label="Speed" value={rate + 'x'} />
        <Select.Content>
          {Rates.map((rate) => {
            return (
              <Select.Item key={rate} value={'' + rate}>
                {rate}x
              </Select.Item>
            );
          })}
        </Select.Content>
      </Select>

      <IconButton icon={<UndoAction />} onClick={reset}></IconButton>
      <IconButton icon={<ZoomIn />} onClick={() => zoomIn()}></IconButton>
      <IconButton icon={<ZoomOut />} onClick={() => zoomOut()}></IconButton>
      <IconButton icon={<Trash />} onClick={() => trash()}></IconButton>
      <Text>{timeRender(time)}</Text>
    </Stack>
  );
};

export default TimelinePlayer;
