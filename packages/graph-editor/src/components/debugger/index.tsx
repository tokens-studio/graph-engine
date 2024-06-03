import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Timeline, TimelineInteractionMode, TimelineModel } from "animation-timeline-js";
import { Box, Text, Stack, IconButton } from "@tokens-studio/ui";
import './debugger.css';
import { DragHandGesture, ZoomIn, ZoomOut } from "iconoir-react";
type Props = {
    time?: number;
    model: TimelineModel;
};

function TimelineComponent(props: Props) {
    const { model, time } = props;
    const timelineElRef = useRef<HTMLDivElement>(null);
    const [timeline, setTimeline] = useState<Timeline>();


    // Example to subscribe and pass model or time update:
    useEffect(() => {
        timeline?.setModel(model);
    }, [model, timeline]);

    // Example to subscribe and pass model or time update:
    useEffect(() => {
        if (time || time === 0) {
            timeline?.setTime(time);
        }
    }, [time, timeline]);

    useEffect(() => {
        let newTimeline: Timeline | null = null;
        // On component init
        if (timelineElRef.current) {
            newTimeline = new Timeline({ id: timelineElRef.current });
            newTimeline.setInteractionMode(TimelineInteractionMode.Selection);
            newTimeline.onSelected(function (obj) {
                console.log('Selected Event: (' + obj.selected.length + '). changed selection :' + obj.changed.length, 2);
            });


            // Here you can subscribe on timeline component events
            setTimeline(newTimeline);
        }

        // cleanup on component unmounted.
        return () => newTimeline?.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timelineElRef.current]);

    useEffect(() => {
        if (!timeline) return;
        const start = Date.now();
        const interval = setInterval(() => {
            if (!timeline) return;
            const model = timeline?.getModel();
            const groupKey = '' + Date.now();

            model?.rows[0].keyframes!.push(
                {
                    val: Date.now() - start,
                    group: groupKey,
                },

            )
            model?.rows[0].keyframes!.push(
                {
                    val: Date.now() + 1000 - start,
                    group: groupKey,
                },

            )
            timeline?.setModel(model!);
        }
            , 1500);
        return () => clearInterval(interval);
    }
        , [timeline]);


    const setZoomMode = useCallback(() => {
        timeline?.setInteractionMode(TimelineInteractionMode.Zoom);
    }, [timeline]);

    const setDrag = useCallback(() => {
        timeline?.setInteractionMode(TimelineInteractionMode.Pan);
    }, [timeline]);

    return <Box css={{ width: '100%' }}>
        <Stack className="toolbar" gap={1}>
            <IconButton onClick={setDrag} icon={<DragHandGesture />}></IconButton>
            <IconButton onClick={setZoomMode} icon={<ZoomIn />}></IconButton>
        </Stack>
        <Stack direction="row" gap={1} css={{ width: '100%' }}>
            <Box className="outline">
                <div className="outline-header"></div>
                <div className="outline-scroll-container" >

                    {model.rows.map((row, index) => {
                        return <div className="outline-items" key={index} ><Text size="xsmall" className='outline-node'>{row.title}</Text> </div>
                    })}
                </div>
            </Box>
            <div style={{ width: "100%", minHeight: 300 }} ref={timelineElRef} />
        </Stack>
    </Box>;
}


export function Debugger() {
    return (
        <TimelineComponent
            time={0}
            model={{
                rows: [
                    {
                        title: 'Row 1',
                        keyframesDraggable: false,
                        groupsDraggable: false,
                        keyframes: [
                            {
                                val: 1,
                            },
                            {
                                val: 20,
                            },
                        ],
                    },
                    {
                        title: 'Row 2',
                        keyframesDraggable: false,
                        groupsDraggable: false,
                        keyframes: [
                            {
                                val: 1,
                            },
                            {
                                val: 20,
                            },
                        ],
                    }
                ],
            }}
        />
    );
}
