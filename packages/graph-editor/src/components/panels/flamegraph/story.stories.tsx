import { FlameGraph } from './index';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof FlameGraph> = {
  title: 'Panels/FlameGraph',
  component: FlameGraph,
};

export default meta;
type Story = StoryObj<typeof FlameGraph>;
export const Default: Story = {
  render: (args) => <FlameGraph />,
  args: {},
};
