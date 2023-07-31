import { styled } from '#/lib/stitches/index.ts';
import React from 'react';

const DragBar = styled('div', {
  variants: {
    direction: {
      horizontal: {
        height: '5px',
        width: '100%',
        borderBottom: '1px solid $borderMuted',
        cursor: 'row-resize',
      },
      vertical: {
        width: '5px',
        height: '100%',
        borderRight: '1px solid $borderMuted',
        cursor: 'col-resize',
      },
    },
  },
  '&:hover': {
    backgroundColor: '$borderMuted',
  },
});

export const Splitter = ({ id = 'drag-bar', ...props }: any) => {
  return (
    <DragBar
      id={id}
      tabIndex={0}
      direction={props.direction || 'horizontal'}
      {...props}
    />
  );
};
