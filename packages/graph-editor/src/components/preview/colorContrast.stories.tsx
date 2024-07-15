import { ColorContrast } from './colorContrast.js';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ColorContrast> = {
  title: 'Components/Preview/ColorContrast',
  component: ColorContrast,
};

export default meta;
type Story = StoryObj<typeof ColorContrast>;
export const Default: Story = {
  render: () => {
    return (
      <ColorContrast
        value={{
          space: 'srgb',
          channels: [0.2, 0.5, 0.7],
        }}
      />
    );
  },
  args: {},
};
