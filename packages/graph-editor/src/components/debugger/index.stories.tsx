import { CustomTimelineRow, Debugger } from './index.js';
import { DebugInfo } from './data.js';
import { TimelineEffect } from '@xzdarcy/react-timeline-editor';
import React, { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Debugger> = {
  title: 'Components/Debugger',
  component: Debugger,
};

const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: 'effect0',
    name: 'foo',
  },
  effect1: {
    id: 'effect1',
    name: 'bar',
  },
};

const mockRows: CustomTimelineRow[] = new Array(20).fill(0).map((_, i) => {
  return {
    id: i.toString(),
    name: 'Row ' + i,
    actions: new Array(1).fill(0).map((y) => {
      return {
        id: `${i}-${y}`,
        start: i * 2,
        effectId: 'effect0',
        end: i * 2 + 2,
      };
    }),
  };
});

export default meta;
type Story = StoryObj<typeof Debugger>;
export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mockData = useMemo(() => {
      return new DebugInfo({
        rows: mockRows,
      });
    }, []);

    return <Debugger data={mockData} effects={mockEffect} />;
  },
  args: {},
};
