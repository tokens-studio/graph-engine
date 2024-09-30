import { Box } from '@tokens-studio/ui/Box.js';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableElementProps,
  SortableHandle,
} from 'react-sortable-hoc';
import React from 'react';
import type * as Stitches from '@stitches/react';

interface ISortableHandleElement {
  children: React.ReactNode;
  css?: Stitches.CSS;
}

interface ISortableItem extends SortableElementProps {
  children: React.ReactNode;
  css?: Stitches.CSS;
}

interface ISortableContainer extends SortableContainerProps {
  children: React.ReactNode;
  css?: Stitches.CSS;
}

export const DndTrigger: React.ComponentClass<ISortableHandleElement, unknown> =
  SortableHandle(
    ({ children, css }: { children: React.ReactNode; css: Stitches.CSS }) => (
      <Box css={{ cursor: 'pointer', ...css }}>{children}</Box>
    ),
  );

export const DndItem: React.ComponentClass<ISortableItem, unknown> =
  SortableElement(
    ({ children, css }: { children: React.ReactNode; css: Stitches.CSS }) => (
      <Box css={css}>{children}</Box>
    ),
  );

export const DndList: React.ComponentClass<ISortableContainer, unknown> =
  SortableContainer(
    ({ children, css }: { children: React.ReactNode; css: Stitches.CSS }) => {
      return <Box css={css}>{children}</Box>;
    },
  );
