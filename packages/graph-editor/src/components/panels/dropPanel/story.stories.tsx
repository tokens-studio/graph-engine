import {
  DropPanel,
  DropPanelInner,
  defaultPanelGroupsFactory,
} from './index.js';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DropPanel> = {
  title: 'Panels/DropPanel',
  component: DropPanel,
};

const defaultPanelItems = defaultPanelGroupsFactory();

export default meta;
type Story = StoryObj<typeof DropPanel>;
export const Default: Story = {
  render: () => <DropPanelInner data={defaultPanelItems} />,
  args: {},
};
