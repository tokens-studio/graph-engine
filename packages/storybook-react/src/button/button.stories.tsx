import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from './button';
import { ThemeProvider } from '../context';

const meta: Meta<typeof Button> = {
    component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: 'Primary',
    },
    render: (args) => {
        const { children, ...rest } = args;
        return <ThemeProvider {...rest}><Button {...args} /></ThemeProvider>
    }
};

export const MultipleContexts: Story = {
    args: {
        children: 'Multiple Contexts',
        theme: 'knight'
    },
    render: (args) => {
        const { children, ...rest } = args;
        return <>
            <ThemeProvider mode="dark"><Button {...args} /></ThemeProvider>
            <ThemeProvider mode="light"><Button {...args} /></ThemeProvider>
        </>
    }
}


export const NestedContexts: Story = {
    args: {
        children: 'Multiple Contexts',
        theme: 'knight'
    },
    render: (args) => {
        const { children, ...rest } = args;
        return <>
            <ThemeProvider mode="dark">
                <ThemeProvider theme="ninja">
                    <Button {...args} />
                </ThemeProvider>
            </ThemeProvider>
        </>
    }
}