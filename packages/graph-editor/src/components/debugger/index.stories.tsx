import { Debugger } from './index';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Debugger> = {
    title: 'Components/Debugger',
    component: Debugger,
};


export default meta;
type Story = StoryObj<typeof Debugger>;
export const Default: Story = {
    render: (args) => <Debugger />,
    args: {},
};
