import { CommandMenu } from './index';
import React, { createRef, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { defaultPanelGroupsFactory } from '../panels/dropPanel';
import { createMockStore } from '@/stories/utils';
import { Provider } from 'react-redux';

const meta: Meta<typeof CommandMenu> = {
  title: 'Components/CommandMenu',
  component: CommandMenu,
};

const defaultPanelItems = defaultPanelGroupsFactory();

const mockedStore = createMockStore({
  ui: {
    showNodesCmdPalette: true,
  },
});

export default meta;
type Story = StoryObj<typeof CommandMenu>;
export const Default: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return (
      <Provider store={mockedStore}>
        <div ref={ref}>
          <CommandMenu

            items={defaultPanelItems}
            handleSelectNewNodeType={() => {}}
          />
        </div>
      </Provider>
    );
  },
  args: {},
};
