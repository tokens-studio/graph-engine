import { AppsIcon } from './index.js';
import { BezierIcon } from './index.js';
import { GrabberIcon } from './index.js';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof AppsIcon> = {
  title: 'Icons',
  component: AppsIcon,
};

export default meta;

export const Apps: StoryObj<typeof AppsIcon> = {
  render: () => <AppsIcon />,
  args: {},
};

export const Bezier: StoryObj<typeof BezierIcon> = {
  render: () => <BezierIcon />,
  args: {},
};

export const Grabber: StoryObj<typeof GrabberIcon> = {
  render: () => <GrabberIcon />,
  args: {},
};
