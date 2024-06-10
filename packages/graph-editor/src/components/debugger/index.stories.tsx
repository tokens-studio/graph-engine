import { CustomTimelineRow, Debugger } from './index';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TimelineEffect, TimelineRow } from '@xzdarcy/react-timeline-editor';

const meta: Meta<typeof Debugger> = {
    title: 'Components/Debugger',
    component: Debugger,
};

const mockEffect: Record<string, TimelineEffect> = {
    effect0: {
        id: "effect0",
        name: "foo",
    },
    effect1: {
        id: "effect1",
        name: "bar",
    },
};


const mockData: CustomTimelineRow[] = new Array(20).fill(0).map((_, i) => {

    return {
        id: i.toString(),
        name: 'Row ' + i,
        actions: new Array(1).fill(0).map(y => {
            return {
                id: `${i}-${y}`,
                start: i * 2,
                effectId: 'effect0',
                end: i * 2 + 2,
            }
        })
    }
})

export default meta;
type Story = StoryObj<typeof Debugger>;
export const Default: Story = {
    render: (args) => <Debugger data={mockData} effects={mockEffect} />,
    args: {},
};
