import { GrabberIcon } from './index';
import { BezierIcon } from './index';
import { AppsIcon } from './index';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AppsIcon> = {
  title: 'Icons',
  component: AppsIcon,
};

export default meta;

export const Apps: StoryObj<typeof AppsIcon> = {
  render: (args) => <AppsIcon />,
  args: {},
};

export const Bezier: StoryObj<typeof BezierIcon> = {
  render: (args) => <BezierIcon />,
  args: {},
};

export const Grabber: StoryObj<typeof GrabberIcon> = {
  render: (args) => <GrabberIcon />,
  args: {},
};
