import React from 'react';
import { BezierIcon } from '@/components/icons/BezierIcon.tsx';
import { ColorWheelIcon } from '@radix-ui/react-icons';
import { COLOR, CURVE, TOKEN, TOKEN_SET } from '@tokens-studio/graph-engine';
import { TokenIcon } from '@/components/icons/token';
import { TokenSetIcon } from '@/components/icons/tokenSet';

export const icons = {
  [COLOR]: <ColorWheelIcon />,
  [CURVE]: <BezierIcon />,
  [TOKEN]: <TokenIcon />,
  [TOKEN_SET]: <TokenSetIcon />,
} as Record<string, React.ReactNode>;
