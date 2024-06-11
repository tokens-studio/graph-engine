import { Timeline, TimelineAction, TimelineEffect, TimelineRow, TimelineState } from '@xzdarcy/react-timeline-editor';
import React, { useRef, useState } from 'react';
import { Box, Stack, Text } from "@tokens-studio/ui";
import TimelinePlayer from './player';
import './debugger.scss';
import { DebugInfo } from './data';
import { observer } from "mobx-react-lite"


export interface CustomTimelineRow extends TimelineRow {
    name: string
    actions: CustomTimeLineAction[]
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


const DebuggerInner = observer(({ data, domRef, timeline, scale }) => {

    return <Stack css={{ flex: 1 }}>
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
                    <Box className="timeline-list-item" key={item.id} css={{ padding: '$1' }}>
                        <Text>{item.name}</Text>
                    </Box>
                );
            })}
        </div>



        <Timeline
            editorData={[...data.rows]}
            onChange={() => { }}
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
                return <CustomRender0 action={action} row={row} index={Number.parseInt(row.id)} />;
            }}
            {...rest}
        />
    </Stack>
});


export const Debugger = ({ data, effects }: DebuggerProps) => {

    const timelineState = useRef<TimelineState>();
    const autoScrollWhenPlay = useRef<boolean>(true);
    const domRef = useRef<HTMLDivElement>();

    const [scale, setScale] = useState(100);

    return (
        <Stack direction='column' width='full' css={{ height: '100%' }}>
            <TimelinePlayer data={data} timelineState={timelineState} autoScrollWhenPlay={autoScrollWhenPlay} setScale={setScale} />
            <DebuggerInner data={data} domRef={domRef} scale={scale} timeline={timelineState} />
        </Stack>

    );
};


const colors = [
    '#F94144',
    "#F3722C",
    "#F8961E",
    "#F9844A",
    "#F9C74F",
    "#90BE6D",
    "#43AA8B",
    "#577590",
    "#277DA1",
    "#2A9D8F",
    "#2B9348",

]

export const CustomRender0: React.FC<{ action: CustomTimeLineAction; row: TimelineRow, index: number }> = ({ action, row, index }) => {
    return (
        <Stack css={{
            backgroundColor: action?.color || colors[index % colors.length], height: '100%', borderRadius: '4px', cursor: 'pointer', userSelect: 'none'
        }} align='center' justify='center'>
            <Text>{Math.round(action.end - action.start)}ms</Text>
        </Stack>
    );
};