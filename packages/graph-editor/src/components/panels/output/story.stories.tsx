import { Sidesheet } from './index';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { Graph } from '@tokens-studio/graph-engine';
import Passthrough from '@tokens-studio/graph-engine/nodes/generic/passthrough.js';
import { createMockStore } from '@/stories/utils';

const graph = new Graph();

const node = new Passthrough();

graph.addNode(node);

const mockedStore = createMockStore({
  graph: {
    graph: graph,
    currentNode: node.id,
  },
});

const meta: Meta<typeof Sidesheet> = {
  title: 'Panels/Side sheet',
  component: Sidesheet,
};

export default meta;
type Story = StoryObj<typeof Sidesheet>;
export const Default: Story = {
  render: (args) => (
    <Provider store={mockedStore}>
      <Sidesheet />
    </Provider>
  ),
  args: {},
};
