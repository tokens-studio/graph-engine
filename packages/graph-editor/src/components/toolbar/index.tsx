import React from 'react';
import {
  Button,
  DropdownMenu,
  Text,
  Tooltip
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
import { useSelector } from 'react-redux';
import { mainGraphSelector } from '@/redux/selectors';
import { ImperativeEditorRef } from '@/editor/editorTypes';

export const GraphToolbar = () => {
  const mainGraph = useSelector(mainGraphSelector);
  const graphRef = mainGraph?.ref as (ImperativeEditorRef | undefined);

  const onDownload = () => {
    const saved = graphRef!.save();
    const blob = new Blob([JSON.stringify(saved)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'graph.json';
    document.body.appendChild(link);
    link.click();
  }

  const onUpload = () => {
    if (!graphRef) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    //@ts-expect-error
    input.onchange = (e: HTMLInputElement) => {
      //@ts-expect-error
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target as any).result;
        const data = JSON.parse(text);

        graphRef.loadRaw(data);
      };
      reader.readAsText(file);
    };
    input.click();
  }

  return (
    <IconoirProvider iconProps={{ width: '1.5em', height: '1.5em' }}>
      <ToolbarRoot aria-label="Formatting options">
        <AddDropdown />

        <Button variant='invisible' disabled style={{ paddingRight: '0' }}>
          <Sparks />
        </Button>
        <Button variant='invisible' disabled style={{ paddingLeft: '0', paddingRight: '0' }}>
          <ChatBubbleEmpty />
        </Button>

        <ToolbarSeparator />

        <ZoomDropdown />
        <ToolbarSeparator style={{ background: 'transparent' }} />
        <AlignDropdown />

        <ToolbarSeparator />

        <Button variant='invisible' style={{ paddingLeft: '0', paddingRight: '0' }}>
          <Play />
        </Button>
        <Button variant='invisible' style={{ paddingLeft: '0', paddingRight: '0' }}>
          <Pause />
        </Button>
        <Button variant='invisible' style={{ paddingLeft: '0', paddingRight: '0' }}>
          <Square />
        </Button>

        <ToolbarSeparator />

        <LayoutDropdown />
        <Button variant='invisible' style={{ paddingLeft: '0', paddingRight: '0' }}>
          <Settings />
        </Button>
        <HelpDropdown />

        <ToolbarSeparator />

        <Tooltip label="Upload" side="bottom">
          <Button variant='invisible' onClick={onUpload} style={{ paddingLeft: '0', paddingRight: '0' }}>
            <Upload />
          </Button>
        </Tooltip>
        <Tooltip label="Download" side="bottom">
          <Button variant='invisible' onClick={onDownload} style={{ paddingLeft: '0', paddingRight: '0' }}>
            <Download />
          </Button>
        </Tooltip>

        <ToolbarSeparator style={{ background: 'transparent' }} />

        <Button variant='primary' disabled>Share</Button>
      </ToolbarRoot>
    </IconoirProvider>
  )
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