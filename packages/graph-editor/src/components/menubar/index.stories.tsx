import { MenuBar } from './index';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { defaultMenuDataFactory } from './defaults';

const meta: Meta<typeof MenuBar> = {
  title: 'Components/MenuBar',
  component: MenuBar,
};

const menu = defaultMenuDataFactory();

export default meta;
type Story = StoryObj<typeof MenuBar>;
export const Default: Story = {
  render: (args) => <MenuBar menu={menu} />,
  args: {},
};
