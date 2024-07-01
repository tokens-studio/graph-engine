import React from 'react';
import {
  Button,
  Tooltip
} from '@tokens-studio/ui';
import * as Toolbar from '@radix-ui/react-toolbar';
import { styled } from '@stitches/react';
import { violet, blackA, mauve } from '@radix-ui/colors';
import {  IconoirProvider, Download, Settings, Upload } from 'iconoir-react';
import { AlignDropdown } from './dropdowns/align';
import { AddDropdown } from './dropdowns/add';
import { ZoomDropdown } from './dropdowns/zoom';
import { LayoutDropdown } from './dropdowns/layout';
import { HelpDropdown } from './dropdowns/help';
import { useSelector } from 'react-redux';
import { mainGraphSelector } from '@/redux/selectors';
import { ImperativeEditorRef } from '@/editor/editorTypes';
import { useLayoutButton } from './hooks/useLayoutButton';
import { PlayControls } from './groups/PlayControls';

export const GraphToolbar = () => {
  const mainGraph = useSelector(mainGraphSelector);
  const graphRef = mainGraph?.ref as (ImperativeEditorRef | undefined);
const { onClick } = useLayoutButton();

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
        <ToolbarSeparator />
        <ZoomDropdown />
        <ToolbarSeparator />
        <AlignDropdown />
        <ToolbarSeparator />
        <PlayControls />
        <ToolbarSeparator />
        <LayoutDropdown />
        <Tooltip label="Settings" side="bottom">
          <Button variant='invisible' style={{ paddingLeft: '0', paddingRight: '0' }} onClick={() => onClick('settings')}>
            <Settings />
          </Button>
        </Tooltip>
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

const ToolbarSeparator = styled(Toolbar.Separator, {
  width: 1,
  backgroundColor: '$borderDefault',
  margin: '0 10px',
});