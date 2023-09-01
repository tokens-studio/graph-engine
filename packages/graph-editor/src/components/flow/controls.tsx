import { ControlButton, ControlProps, Controls, MiniMap } from 'reactflow';
import { styled } from '#/lib/stitches/index.ts';
import React from 'react';
import { Settings } from '../Settings';

export const ControlsStyled = styled(Controls, {
  button: {
    backgroundColor: '$bgSurface',
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
    <ControlsStyled {...props}>
      <ControlButton title="Settings">
        <Settings />
      </ControlButton>
    </ControlsStyled>
  );
};
