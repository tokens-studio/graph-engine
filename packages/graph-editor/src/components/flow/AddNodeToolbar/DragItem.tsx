import { NodeTypes } from '@tokens-studio/graph-engine';
import React, { useCallback } from 'react';

import { DropdownMenuItem } from './Panel';

type DragItemProps = {
  data?: any;
  type: NodeTypes;
  children: React.ReactNode;
};

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
    <button type="button" onDragStart={onDragStart} draggable>
      {children}
    </button>
  );
};
