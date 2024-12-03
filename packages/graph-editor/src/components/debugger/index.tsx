import { DebugInfo, debugInfo } from './data.js';
import { Stack, Text } from '@tokens-studio/ui';
import {
  Timeline,
  TimelineAction,
  TimelineEffect,
  TimelineRow,
  TimelineState,
} from '@xzdarcy/react-timeline-editor';
import { observer } from 'mobx-react-lite';
import { useGraph } from '@/hooks/useGraph.js';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import TimelinePlayer from './player.js';

export interface CustomTimelineRow extends TimelineRow {
  name: string;
  actions: CustomTimeLineAction[];
}

export interface CustomTimeLineAction extends TimelineAction {
  /**
   * The color to render the action
   */
  color?: string;
}

export interface DebuggerProps {
  data: DebugInfo;
  effects: Record<string, TimelineEffect>;
}

const DebuggerInner = observer<DebuggerProps>(
  /** @ts-expect-error observer not typed here...? */
  ({ data, domRef, timeline, scale }) => {
    return (
      <Stack style={{ flex: 1 }}>
        <div
          ref={domRef}
          style={{ overflow: 'auto' }}
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            timeline.current?.setScrollTop(target.scrollTop);
          }}
          className={'timeline-list'}
        >
          {data.rows.map((item) => {
            return (
              <div
                className="timeline-list-item"
                key={item.id}
                style={{ padding: 'var(--component-spacing-3xs)' }}
              >
                <Text>{item.name}</Text>
              </div>
            );
          })}
        </div>
        <Timeline
          editorData={[...data.rows]}
          onChange={() => {}}
          disableDrag
          onScroll={({ scrollTop }) => {
            if (domRef.current) {
              domRef.current.scrollTop = scrollTop;
            }
          }}
          autoScroll={true}
          scaleSplitCount={~~(scale / 10)}
          // scale={scale}
          scaleWidth={scale}
          ref={timeline}
          effects={{}}
          getActionRender={(action, row) => {
            return (
              <CustomRender0
                action={action}
                row={row}
                index={Number.parseInt(row.id)}
              />
            );
          }}
        />
      </Stack>
    );
  },
);

export const Debugger = ({ data }: DebuggerProps) => {
  const timelineState =
    useRef<TimelineState>() as MutableRefObject<TimelineState>;
  const autoScrollWhenPlay = useRef<boolean>(true);
  const domRef = useRef<HTMLDivElement>();

  const graph = useGraph();

  useEffect(() => {
    if (!graph) {
      return;
    }

    const NodeStartListener = graph.on('nodeExecuted', (run) => {
      const existing = debugInfo.rows.find((x) => x.id == run.node.id);

      if (!existing) {
        debugInfo.addRow({
          id: run.node.id,
          name: run.node.factory.type,
          actions: [],
        });
      }

      //Now we need to add the actions
      debugInfo.addAction(run.node.id, {
        id: `${run.node.id}-${Date.now()}`,
        start: run.start,
        end: run.end,
        effectId: 'effect0',
      });
    });

    return () => {
      NodeStartListener();
    };
  }, [graph]);

  const [scale, setScale] = useState(100);

  return (
    <Stack direction="column" width="full" style={{ height: '100%' }}>
      <TimelinePlayer
        data={data}
        timelineState={timelineState}
        autoScrollWhenPlay={autoScrollWhenPlay}
        setScale={setScale}
      />
      <DebuggerInner
        data={data}
        /** @ts-expect-error this domRef prop is not typed? */
        domRef={domRef}
        scale={scale}
        timeline={timelineState}
      />
    </Stack>
  );
};

const colors = [
  '#F94144',
  '#F3722C',
  '#F8961E',
  '#F9844A',
  '#F9C74F',
  '#90BE6D',
  '#43AA8B',
  '#577590',
  '#277DA1',
  '#2A9D8F',
  '#2B9348',
];

export const CustomRender0: React.FC<{
  action: CustomTimeLineAction;
  row: TimelineRow;
  index: number;
}> = ({ action, index }) => {
  return (
    <Stack
      style={{
        backgroundColor: action?.color || colors[index % colors.length],
        height: '100%',
        borderRadius: '4px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      align="center"
      justify="center"
    >
      <Text>{Math.round(action.end - action.start)}ms</Text>
    </Stack>
  );
};
