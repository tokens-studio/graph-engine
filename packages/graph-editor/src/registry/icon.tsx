import React from 'react';
import { BezierIcon } from '@/components/icons/BezierIcon.tsx';
import { ColorWheelIcon } from '@radix-ui/react-icons';
import { COLOR, CURVE} from '@tokens-studio/graph-engine';

/**
 * Default icons for the graph editor
 * These icons are used to represent the different types of custom types in the graph editor
 */
export const icons = {
  [COLOR]: <ColorWheelIcon />,
  [CURVE]: <BezierIcon />,

} as Record<string, React.ReactNode>;
