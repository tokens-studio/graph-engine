import { NodeTypes } from '@tokens-studio/graph-engine';
import React, { useCallback } from 'react';
import { styled } from "#/lib/stitches";


type DragItemProps = {
  data?: any;
  type: NodeTypes;
  children: React.ReactNode;
};

const StyledButton = styled('button', {
  all: 'unset',
  padding: '$1 $3',
  borderRadius: '$small',
  
  '&:hover': {
    background: '$bgSubtle',
  },
})

export const DragItem = ({ data, type, children }: DragItemProps) => {
  const onDragStart = useCallback(
    (event) => {
      event.dataTransfer.setData(
        'application/reactflow',
        JSON.stringify({
          type,
          data,
        }),
      );
      event.dataTransfer.effectAllowed = 'move';
    },
    [data, type],
  );

  return (
    <StyledButton type="button" onDragStart={onDragStart} draggable>
      {children}
    </StyledButton>
  );
};
