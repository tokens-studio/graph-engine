import { LegendInner } from './index';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { icons } from '@/registry/icon.js';

const meta: Meta<typeof LegendInner> = {
  title: 'Panels/Legend',
  component: LegendInner,
};
const iconsRegistry = icons();

export default meta;
type Story = StoryObj<typeof LegendInner>;
export const Default: Story = {
  render: (args) => <LegendInner iconsRegistry={iconsRegistry} />,
  args: {},
};
