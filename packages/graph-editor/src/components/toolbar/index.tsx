import * as Toolbar from '@radix-ui/react-toolbar';
import { AddDropdown } from './dropdowns/add.js';
import { AlignDropdown } from './dropdowns/align.js';
import { Button, Tooltip } from '@tokens-studio/ui';
import { Download, IconoirProvider, Settings, Upload } from 'iconoir-react';
import { HelpDropdown } from './dropdowns/help.js';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import { LayoutDropdown } from './dropdowns/layout.js';
import { PlayControls } from './groups/PlayControls.js';
import { ZoomDropdown } from './dropdowns/zoom.js';
import { blackA } from '@radix-ui/colors';
import { mainGraphSelector } from '@/redux/selectors/index.js';
import { styled } from '@stitches/react';
import { useLayoutButton } from './hooks/useLayoutButton.js';
import { useSelector } from 'react-redux';
import React from 'react';

export const GraphToolbar = () => {
  const mainGraph = useSelector(mainGraphSelector);
  const graphRef = mainGraph?.ref as ImperativeEditorRef | undefined;
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
  };

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
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        graphRef.loadRaw(data);
      };
      reader.readAsText(file);
    };
    input.click();
  };

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

        <Tooltip label="Upload" side="bottom">
          <Button
            variant="invisible"
            onClick={onUpload}
            style={{ paddingLeft: '0', paddingRight: '0' }}
          >
            <Upload />
          </Button>
        </Tooltip>
        <Tooltip label="Download" side="bottom">
          <Button
            variant="invisible"
            onClick={onDownload}
            style={{ paddingLeft: '0', paddingRight: '0' }}
          >
            <Download />
          </Button>
        </Tooltip>

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
