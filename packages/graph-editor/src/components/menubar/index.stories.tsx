import { MenuBar } from './index';
import { defaultMenuDataFactory } from './defaults';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof MenuBar> = {
  title: 'Components/MenuBar',
  component: MenuBar,
};

const menu = defaultMenuDataFactory();

export default meta;
type Story = StoryObj<typeof MenuBar>;
export const Default: Story = {
  render: () => <MenuBar menu={menu} />,
  args: {},
};
