import { LoadingNode } from './loadingNode.js';
import React from 'react';
import ReactFlow from 'reactflow';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LoadingNode> = {
  title: 'Components/Nodes/LoadingNode',
  component: LoadingNode,
};

export default meta;
type Story = StoryObj<typeof LoadingNode>;
export const Default: Story = {
  render: () => {
    return (
      <ReactFlow
        nodes={[
          {
            id: '1',
            type: 'loadingNode',
            position: { x: 100, y: 100 },
          },
        ]}
        nodeTypes={{
          loadingNode: LoadingNode,
        }}
      ></ReactFlow>
    );
  },
  args: {},
};
