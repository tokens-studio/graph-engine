import { DropPanel, DropPanelInner } from './index';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { defaultPanelGroupsFactory } from './index';

const meta: Meta<typeof DropPanel> = {
  title: 'Panels/DropPanel',
  component: DropPanel,
};

const defaultPanelItems = defaultPanelGroupsFactory();

export default meta;
type Story = StoryObj<typeof DropPanel>;
export const Default: Story = {
  render: (args) => <DropPanelInner  data={defaultPanelItems} />,
  args: {},
};
