import type * as Stitches from '@stitches/react';
import { Box } from '@tokens-studio/ui';
import React, { useState } from 'react'
import {
  SortableContainer,
  SortableElement,
  SortableContainerProps,
  SortableElementProps,
  SortableHandle,
} from 'react-sortable-hoc'

interface ISortableHandleElement {
  children: React.ReactNode
  css?: Stitches.CSS
}

interface ISortableItem extends SortableElementProps {
  children: React.ReactNode
  css?: Stitches.CSS
}

interface ISortableContainer extends SortableContainerProps {
  children: React.ReactNode
  css?: Stitches.CSS
}

export const DndTrigger: React.ComponentClass<ISortableHandleElement, any> = SortableHandle(
  ({ children, css }: { children: React.ReactNode; css: Stitches.CSS }) => (
    <Box css={css}>{children}</Box>
  )
)

export const DndItem: React.ComponentClass<ISortableItem, any> = SortableElement(
  ({ children, css }: { children: React.ReactNode; css: Stitches.CSS }) => (
    <Box css={css}>{children}</Box>
  )
)

export const DndList: React.ComponentClass<ISortableContainer, any> = SortableContainer(
  ({ children, css }: { children: React.ReactNode; css: Stitches.CSS }) => {
    return <Box css={css}>{children}</Box>
  }
)