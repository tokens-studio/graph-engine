import { MenuBar } from './index';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof MenuBar> = {
  title: 'Components/MenuBar',
  component: MenuBar,
};

export default meta;
type Story = StoryObj<typeof MenuBar>;
export const Default: Story = {
  render: (args) => <MenuBar />,
  args: {},
};
