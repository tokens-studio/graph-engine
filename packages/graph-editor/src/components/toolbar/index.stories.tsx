import { GraphToolbar } from './index.js';
import { ReactFlowProvider } from 'reactflow';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof GraphToolbar> = {
  title: 'Components/Graph Toolbar',
  component: GraphToolbar,
};

export default meta;
type Story = StoryObj<typeof GraphToolbar>;
export const Default: Story = {
  render: () => {
    return (
      <ReactFlowProvider>
        <GraphToolbar />
      </ReactFlowProvider>
    );
  },
  args: {},
};
