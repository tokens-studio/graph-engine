import { CurveEditor } from './index';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CurveEditor> = {
  title: 'Components/Curve Editor',
  component: CurveEditor,
};

export default meta;
type Story = StoryObj<typeof CurveEditor>;
export const Default: Story = {
  render: (args) => <CurveEditor />,
  args: {},
};
