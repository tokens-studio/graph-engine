import { ControlButton, ControlProps, Controls } from 'reactflow';
import { MiniMap } from '@reactflow/minimap';
import { styled } from '@/lib/stitches/index.ts';
import React from 'react';
import { Settings } from '../Settings';

export const ControlsStyled = styled(Controls, {
  display: 'flex',
  flexDirection: 'row',
  padding: '$1',
  color: '$fgDefault',
  backgroundColor: '$bgDefault',
  borderRadius: '$medium',
  boxShadow: '$small',
  border: '1px solid $borderSubtle',
  button: {
    width: 16,
    height: 16,
    borderRadius: '$small',
    backgroundColor: '$bgDefault',
    borderBottom: 'transparent',
    '&:hover': {
      backgroundColor: '$bgSubtle',
    },
    path: {
      fill: 'currentColor',
    },
  },
});

export const MiniMapStyled = styled(MiniMap, {
  backgroundColor: '$bgSubtle',

  '.react-flow__minimap-mask': {
    fill: '$bgSubtle !important',
  },

  '.react-flow__minimap-node': {
    fill: '$inputBorderRest',
    stroke: 'none',
  },
});

export const CustomControls = (props: ControlProps) => {
  return <ControlsStyled showInteractive={false} {...props} />;
};
