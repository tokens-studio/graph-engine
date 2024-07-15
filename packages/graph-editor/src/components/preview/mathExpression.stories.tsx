import { MathExpression } from './mathExpression.js';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof MathExpression> = {
  title: 'Components/Preview/MathExpression',
  component: MathExpression,
};

export default meta;
type Story = StoryObj<typeof MathExpression>;
export const Default: Story = {
  render: () => {
    return <MathExpression value={'(\\frac{10}{4x} \\approx 2^{12})'} />;
  },
  args: {},
};
