import { LegendInner } from './index';
import { icons } from '@/registry/icon.js';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LegendInner> = {
  title: 'Panels/Legend',
  component: LegendInner,
};
const iconsRegistry = icons();

export default meta;
type Story = StoryObj<typeof LegendInner>;
export const Default: Story = {
  render: () => <LegendInner iconsRegistry={iconsRegistry} />,
  args: {},
};
