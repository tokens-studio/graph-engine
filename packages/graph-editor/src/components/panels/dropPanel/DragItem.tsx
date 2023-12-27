import React, { useCallback } from 'react';
import { styled } from '@/lib/stitches';
import { NodeHoverCard } from '@/components/NodeHoverCard';
import { GrabberIcon } from '@/components/icons/GrabberIcon';

type DragItemProps = {
  data?: any;
  type: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  docs?: string;
  icon?: React.ReactNode | string;
};

const StyledWrapper = styled('div', {
  userSelect: 'none',
});

const StyledGrabber = styled('span', {
  opacity: 0,
  color: '$fgSubtle',
  position: 'absolute',
  left: '$1',
  top: 0,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
});

const StyledButton = styled('button', {
  cursor: 'grab',
  padding: '$1 $3',
  paddingLeft: '$5',
  borderRadius: '$small',
  border: 'none',
  width: '100%',
  position: 'relative',

  '&:hover': {
    background: '$bgSubtle',
    [`& ${StyledGrabber}`]: {
      opacity: 1,
    },
  },
  backgroundColor: '$buttonSecondaryBgHover',
});

export const DragItem = ({
  data,
  type,
  title,
  description,
  icon,
  docs,
  children,
}: DragItemProps) => {
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
    <StyledWrapper
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable="true"
    >
      <NodeHoverCard
        isDragging={isDragging}
        title={title}
        description={description}
        docs={docs}
        icon={icon}
      >
        <StyledButton type="button">
          <StyledGrabber>
            <GrabberIcon />
          </StyledGrabber>
          {children}
        </StyledButton>
      </NodeHoverCard>
    </StyledWrapper>
  );
};
