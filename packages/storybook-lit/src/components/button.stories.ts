import { html } from 'lit-html';
import type { ButtonProps } from './button';
import type { Meta, StoryObj } from '@storybook/web-components';

import './button';
import './context';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/web-components/writing-stories/introduction
const meta = {
	title: 'StoryDocker/Button',
	tags: ['autodocs'],
	render: args =>
		html`<theme-context .values=${args}
			><tok-button>asd</tok-button><theme-context></theme-context
		></theme-context>`,
	argTypes: {
		theme: {
			options: ['samurai', 'knight', 'ninja'],
			control: { type: 'select' }
		},
		mode: {
			options: ['light', 'dark'],
			control: { type: 'select' }
		}
	}
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<ButtonProps>;

export const Primary: Story = {
	render: args => {
		return html`<theme-context .values=${args}
			><tok-button>Single Context</tok-button></theme-context
		>`;
	}
};

export const MultipleContexts: Story = {
	args: {
		children: 'Multiple Contexts',
		theme: 'knight'
	},
	render: args => {
		const { children, ...rest } = args;
		return html`<theme-context .values=${rest}>
			<theme-context .values=${{ mode: 'dark' }}>
				<tok-button>${children}</tok-button>
			</theme-context>
			<theme-context .values=${{ mode: 'light' }}>
				<tok-button>${children}</tok-button>
			</theme-context>
			<theme-context></theme-context
		></theme-context>`;
	}
};

export const NestedContexts: Story = {
	args: {
		children: 'Multiple Contexts',
		theme: 'knight'
	},
	render: args => {
		const { children, ...rest } = args;
		return html`<theme-context .values=${rest}>
			<theme-context .values=${{ mode: 'dark' }}>
				<tok-button>${children}</tok-button>
			</theme-context>
			<theme-context></theme-context
		></theme-context>`;
	}
};
