import { GrabberIcon } from '@/components/icons/GrabberIcon.js';
import { NodeHoverCard } from '@/components/NodeHoverCard.js';
import React, { useCallback } from 'react';
import styles from './DragItem.module.css';

type DragItemProps = {
  data?: unknown;
  type: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  docs?: string;
  icon?: React.ReactNode | string;
};

export const DragItem = ({
  data,
  type,
  title,
  description,
  icon,
  docs,
  children,
  ...rest
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
    <div
      className={styles.wrapper}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      draggable="true"
      {...rest}
    >
      <NodeHoverCard
        isDragging={isDragging}
        title={title}
        description={description}
        docs={docs}
        icon={icon}
      >
        <button type="button" className={styles.button}>
          <span className={styles.grabber}>
            <GrabberIcon />
          </span>
          {children}
        </button>
      </NodeHoverCard>
    </div>
  );
};
