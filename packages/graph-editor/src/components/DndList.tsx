import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableElementProps,
  SortableHandle,
} from 'react-sortable-hoc';
import React from 'react';
import styles from './DndList.module.css';

interface ISortableHandleElement {
  children: React.ReactNode;
  className?: string;
}

interface ISortableItem extends SortableElementProps {
  children: React.ReactNode;
  className?: string;
}

interface ISortableContainer extends SortableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const DndTrigger: React.ComponentClass<ISortableHandleElement, unknown> =
  SortableHandle(
    ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => (
      <div className={`${styles.trigger} ${className || ''}`}>{children}</div>
    ),
  );

export const DndItem: React.ComponentClass<ISortableItem, unknown> =
  SortableElement(
    ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => <div className={`${styles.item} ${className || ''}`}>{children}</div>,
  );

export const DndList: React.ComponentClass<ISortableContainer, unknown> =
  SortableContainer(
    ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => {
      return (
        <div className={`${styles.container} ${className || ''}`}>
          {children}
        </div>
      );
    },
  );
