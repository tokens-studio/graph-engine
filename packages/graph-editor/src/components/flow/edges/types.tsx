import { Position } from '@reactflow/core';
import type { HTMLAttributes } from 'react';
import React from 'react';

export type EdgeToolbarProps = HTMLAttributes<HTMLDivElement> & {
  edgeId: string;
  isVisible?: boolean;
  position?: Position;
  offset?: number;
};
