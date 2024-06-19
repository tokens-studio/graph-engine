import React from 'react';
import {
  Button,
  DropdownMenu,
  Text
} from '@tokens-studio/ui';
import * as Toolbar from '@radix-ui/react-toolbar';
import { styled } from '@stitches/react';
import { violet, blackA, mauve } from '@radix-ui/colors';
import { ChatBubbleEmpty, IconoirProvider, Download, Pause, Play, Settings, Sparks, Square, Upload } from 'iconoir-react';
import { AlignDropdown } from './dropdowns/align';
import { AddDropdown } from './dropdowns/add';
import { ZoomDropdown } from './dropdowns/zoom';
import { LayoutDropdown } from './dropdowns/layout';
import { HelpDropdown } from './dropdowns/help';

export const GraphToolbar = () => (
  <IconoirProvider iconProps={{ width:'1.5em', height:'1.5em' }}> 
  <ToolbarRoot aria-label="Formatting options">
    <AddDropdown />

    <Button variant='invisible' disabled style={{paddingRight: '0'}}>
      <Sparks />
    </Button>
    <Button variant='invisible' disabled style={{paddingLeft: '0', paddingRight: '0'}}>
      <ChatBubbleEmpty />
    </Button>
    
    <ToolbarSeparator />

    <ZoomDropdown />
    <ToolbarSeparator style={{background: 'transparent'}}/>
    <AlignDropdown />

    <ToolbarSeparator />

    <Button variant='invisible' style={{paddingLeft: '0', paddingRight: '0'}}>
      <Play />
    </Button>
    <Button variant='invisible' style={{paddingLeft: '0', paddingRight: '0'}}>
      <Pause />
    </Button>
    <Button variant='invisible' style={{paddingLeft: '0', paddingRight: '0'}}>
      <Square />
    </Button>

    <ToolbarSeparator />

    <LayoutDropdown />
    <Button variant='invisible' style={{paddingLeft: '0', paddingRight: '0'}}>
      <Settings />
    </Button>
    <HelpDropdown />

    <ToolbarSeparator />

    <Button variant='invisible' style={{paddingLeft: '0', paddingRight: '0'}}>
      <Upload />
    </Button>
    <Button variant='invisible' style={{paddingLeft: '0', paddingRight: '0'}}>
      <Download />
    </Button>

    <ToolbarSeparator style={{background: 'transparent'}}/>

    <Button variant='primary' disabled>Share</Button>
  </ToolbarRoot>
  </IconoirProvider>
);

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

const itemStyles = {
  all: 'unset',
  flex: '0 0 auto',
  color: mauve.mauve11,
  height: 25,
  padding: '0 5px',
  borderRadius: 4,
  display: 'inline-flex',
  fontSize: 13,
  lineHeight: 1,
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': { backgroundColor: violet.violet3, color: violet.violet11 },
  '&:focus': { position: 'relative', boxShadow: `0 0 0 2px ${violet.violet7}` },
};

const ToolbarToggleItem = styled(Toolbar.ToggleItem, {
  ...itemStyles,
  backgroundColor: 'white',
  marginLeft: 2,
  '&:first-child': { marginLeft: 0 },
  '&[data-state=on]': { backgroundColor: violet.violet5, color: violet.violet11 },
});

const ToolbarSeparator = styled(Toolbar.Separator, {
  width: 1,
  backgroundColor: '$borderDefault',
  margin: '0 10px',
});

const ToolbarLink = styled(
  Toolbar.Link,
  {
    ...itemStyles,
    backgroundColor: 'transparent',
    color: mauve.mauve11,
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
  },
  { '&:hover': { backgroundColor: 'transparent', cursor: 'pointer' } },
  { '@bp1': { display: 'inline-flex' } }
);

const ToolbarButton = styled(
  Toolbar.Button,
  {
    ...itemStyles,
    color: 'white',
    backgroundColor: violet.violet9,
  },
  { '&:hover': { backgroundColor: violet.violet10, color: 'white' } }
);