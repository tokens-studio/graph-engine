import * as Toolbar from '@radix-ui/react-toolbar';
import { AddDropdown } from './dropdowns/add.js';
import { AlignDropdown } from './dropdowns/align.js';
import { Button, Tooltip } from '@tokens-studio/ui';
import { HelpDropdown } from './dropdowns/help.js';
import { IconoirProvider, Settings } from 'iconoir-react';
import { LayoutDropdown } from './dropdowns/layout.js';
import { PlayControls } from './groups/PlayControls.js';
import { ToolBarButtonsSelector } from '@/redux/selectors/index.js';
import { ZoomDropdown } from './dropdowns/zoom.js';
import { blackA } from '@radix-ui/colors';
import { styled } from '@stitches/react';
import { useLayoutButton } from './hooks/useLayoutButton.js';
import { useSelector } from 'react-redux';
import React from 'react';

export const GraphToolbar = () => {
  const { onClick } = useLayoutButton();
  const toolbarButtons = useSelector(ToolBarButtonsSelector);
  return (
    <IconoirProvider iconProps={{ width: '1.5em', height: '1.5em' }}>
      <ToolbarRoot aria-label="Formatting options">
        <AddDropdown />
        <ToolbarSeparator />
        <ZoomDropdown />
        <ToolbarSeparator />
        <AlignDropdown />
        <ToolbarSeparator />
        <PlayControls />
        <ToolbarSeparator />
        <LayoutDropdown />
        <Tooltip label="Settings" side="bottom">
          <Button
            variant="invisible"
            style={{ paddingLeft: '0', paddingRight: '0' }}
            onClick={() => onClick('settings')}
          >
            <Settings />
          </Button>
        </Tooltip>
        <HelpDropdown />

        <ToolbarSeparator />

        <>{toolbarButtons}</>
        <ToolbarSeparator style={{ background: 'transparent' }} />
      </ToolbarRoot>
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

const ToolbarSeparator = styled(Toolbar.Separator, {
  width: 1,
  backgroundColor: '$borderDefault',
  margin: '0 10px',
});
