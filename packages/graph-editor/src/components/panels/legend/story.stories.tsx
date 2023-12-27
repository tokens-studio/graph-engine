import { Legend } from './index';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Legend> = {
  title: 'Panels/Legend',
  component: Legend,
};

export default meta;
type Story = StoryObj<typeof Legend>;
export const Default: Story = {
  render: (args) => <Legend />,
  args: {},
};
