import { ColorScale } from './colorScale.js';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ColorScale> = {
  title: 'Components/Preview/ColorScale',
  component: ColorScale,
};

export default meta;
type Story = StoryObj<typeof ColorScale>;
export const SingleColor: Story = {
  render: () => {
    return (
      <ColorScale
        scale={[
          {
            space: 'srgb',
            channels: [0.2, 0.5, 0.7],
          },
        ]}
      />
    );
  },
  args: {},
};
export const Multiple: Story = {
  render: () => {
    return (
      <ColorScale
        scale={[
          {
            space: 'srgb',
            channels: [0.2, 0.5, 0.7],
          },
          {
            space: 'srgb',
            channels: [0.1, 0.5, 0.7],
          },
          {
            space: 'srgb',
            channels: [0, 0.5, 0.7],
          },
          {
            space: 'srgb',
            channels: [0.2, 0.6, 0.7],
          },
          {
            space: 'srgb',
            channels: [0.2, 0.7, 0.7],
          },
          {
            space: 'srgb',
            channels: [0.2, 0.8, 0.7],
          },
        ]}
      />
    );
  },
  args: {},
};
