import { ControlButton, ControlProps, Controls, MiniMap } from 'reactflow';
import { styled } from '#/lib/stitches/index.ts';
import React from 'react';
import { Settings } from '../Settings';

export const ControlsStyled = styled(Controls, {
  display: 'flex',
  flexDirection: 'row',
  padding: '$2',
  backgroundColor: '$bgSubtle',
  borderRadius: '$medium',
  button: {
    width: 24,
    height: 24,
    borderRadius: '$small',
    backgroundColor: '$bgSubtle',
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
  return (
    <ControlsStyled showInteractive={false} {...props}>
      <ControlButton>
        <Settings />
      </ControlButton>             
    </ControlsStyled>
  );
};
