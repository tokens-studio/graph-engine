import { ColorCompare } from './colorCompare.js';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ColorCompare> = {
  title: 'Components/Preview/ColorCompare',
  component: ColorCompare,
};

export default meta;
type Story = StoryObj<typeof ColorCompare>;
export const Default: Story = {
  render: () => {
    return (
      <ColorCompare
        colors={[
          {
            space: 'srgb',
            channels: [0.5, 0.5, 0.5],
          },
          {
            space: 'srgb',
            channels: [0.2, 0.5, 0.7],
          },
          {
            space: 'srgb',
            channels: [0.7, 0.5, 0.2],
          },
        ]}
      />
    );
  },
  args: {},
};
