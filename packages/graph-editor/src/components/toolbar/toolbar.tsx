import * as Toolbar from '@radix-ui/react-toolbar';
import { IconoirProvider } from 'iconoir-react';
import { ToolBarButtonsSelector } from '@/redux/selectors/index.js';
import { blackA } from '@radix-ui/colors';
import { styled } from '@stitches/react';
import { useSelector } from 'react-redux';
import React from 'react';

export const GraphToolbar = () => {
  const toolbarButtons = useSelector(ToolBarButtonsSelector);
  return (
    <IconoirProvider iconProps={{ width: '1.5em', height: '1.5em' }}>
      <ToolbarRoot>{toolbarButtons}</ToolbarRoot>
    </IconoirProvider>
  );
};

const ToolbarRoot = styled(Toolbar.Root, {
  display: 'flex',
  padding: 10,
  gap: '$1',
  width: 'auto',
  minWidth: 'max-content',
  borderRadius: 6,
  backgroundColor: '$bgSubtle',
  boxShadow: `0 2px 10px ${blackA.blackA4}`,
});

export const ToolbarSeparator = styled(Toolbar.Separator, {
  width: 1,
  backgroundColor: '$borderDefault',
  margin: '0 10px',
});
