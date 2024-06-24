import { Settings } from './index.js';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Settings> = {
  title: 'Panels/Settings',
  component: Settings,
};

export default meta;
type Story = StoryObj<typeof Settings>;
export const Default: Story = {
  render: () => <Settings />,
  args: {},
};
