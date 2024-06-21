import { CommandMenu } from './index';
import { Provider } from 'react-redux';
import { createMockStore } from '@/stories/utils';
import { defaultPanelGroupsFactory } from '../panels/dropPanel';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

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
  render: () => {
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
