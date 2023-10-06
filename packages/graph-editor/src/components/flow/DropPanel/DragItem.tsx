import { NodeTypes } from '@tokens-studio/graph-engine';
import React, { useCallback } from 'react';
import { styled } from '#/lib/stitches';
import { NodeHoverCard } from '#/components/NodeHoverCard';

type DragItemProps = {
  data?: any;
  type: NodeTypes;
  children: React.ReactNode;
  title?: string;
  description?: string;
  docs?: string;
  icon?: React.ReactNode | string;
};

const StyledWrapper = styled('div', {
  userSelect: 'none',
});

const StyledButton = styled('button', {
  cursor: 'pointer',
  padding: '$1 $3',
  borderRadius: '$small',
  border: 'none',
  width: '100%',

  '&:hover': {
    background: '$bgSubtle',
  },
  backgroundColor: '$buttonSecondaryBgHover',
});

export const DragItem = ({ data, type, title, description, icon, docs, children }: DragItemProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const onDragStart = useCallback(
    (event) => {
      setIsDragging(true);
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

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <StyledWrapper onDragStart={onDragStart} onDragEnd={onDragEnd} draggable="true">
      <NodeHoverCard isDragging={isDragging} title={title} description={description} docs={docs} icon={icon}>
          <StyledButton type="button">
            {children}
          </StyledButton>
      </NodeHoverCard>
    </StyledWrapper>
  );
};
