import { CurveEditor } from './index.js';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { vec } from 'mafs';

const meta: Meta<typeof CurveEditor> = {
  title: 'Components/Curve Editor',
  component: CurveEditor,
};

export default meta;
type Story = StoryObj<typeof CurveEditor>;
export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [points, setPoints] = React.useState<vec.Vector2[]>([
      [0, 0],
      [0.25, 0.6],
      [0.75, 0.4],
      [1, 1],
    ]);

    const onChange = (index: number, value: vec.Vector2) => {
      points[index] = value;
      setPoints([...points]);
    };

    return <CurveEditor points={points} onChange={onChange} />;
  },
  args: {},
};
