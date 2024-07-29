import { ColorPickerPopover } from './index.js';
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ColorPickerPopover> = {
  title: 'Components/Color Picker Popover',
  component: ColorPickerPopover,
};

export default meta;
type Story = StoryObj<typeof ColorPickerPopover>;
export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('#232312');

    return <ColorPickerPopover value={value} onChange={setValue} />;
  },
  args: {},
};
