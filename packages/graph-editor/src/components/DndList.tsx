import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableElementProps,
  SortableHandle,
} from 'react-sortable-hoc';
import React from 'react';
import styles from './DndList.module.css';

interface ISortableHandleElement extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface ISortableItem extends SortableElementProps, React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface ISortableContainer extends SortableContainerProps, React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const DndTrigger: React.ComponentClass<ISortableHandleElement, unknown> =
  SortableHandle(
    ({
      children,
      className,
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={`${styles.trigger} ${className || ''}`}>{children}</div>
    ),
  );

export const DndItem: React.ComponentClass<ISortableItem, unknown> =
  SortableElement(
    ({
      children,
      className,
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={`${styles.item} ${className || ''}`}>{children}</div>
    ),
  );

export const DndList: React.ComponentClass<ISortableContainer, unknown> =
  SortableContainer(
    ({
      children,
      className,
    }: React.HTMLAttributes<HTMLDivElement>) => {
      return (
        <div className={`${styles.container} ${className || ''}`}>
          {children}
        </div>
      );
    },
  );
