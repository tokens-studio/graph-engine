import { DropdownMenu } from '@tokens-studio/ui/DropdownMenu.js';
import { IconButton } from '@tokens-studio/ui/IconButton.js';
import { LayoutLeft } from 'iconoir-react';
import { Tooltip } from '@tokens-studio/ui/Tooltip.js';
import { dockerSelector } from '@/redux/selectors/index.js';
import { useLayoutButton } from '../../../hooks/useLayoutButton.js';
import { useSelector } from 'react-redux';
import React, { MutableRefObject } from 'react';
import type { DockLayout } from 'rc-dock';

export const LayoutDropdown = () => {
  const dockerRef = useSelector(dockerSelector) as MutableRefObject<DockLayout>;

  const onClick = useLayoutButton();

  const saveLayout = React.useCallback(() => {
    const saved = dockerRef.current.saveLayout();
    const blob = new Blob([JSON.stringify(saved)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `layout.json`;
    document.body.appendChild(link);
    link.click();
  }, [dockerRef]);

  const loadLayout = React.useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    //@ts-ignore
    input.onchange = (e: HTMLInputElement) => {
      //@ts-ignore
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        dockerRef.current.loadLayout(data);
      };
      reader.readAsText(file);
    };
    input.click();
  }, [dockerRef]);

  return (
    <DropdownMenu>
      <Tooltip label="Layout" side="bottom">
        <DropdownMenu.Trigger asChild>
          <IconButton variant="invisible" icon={<LayoutLeft />} />
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Portal>
        <DropdownMenu.Content css={{ minWidth: '200px' }}>
          <DropdownMenu.Item onSelect={() => onClick('inputs')}>
            Input
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => onClick('outputs')}>
            Output
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => onClick('nodeSettings')}>
            Node Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => onClick('graphSettings')}>
            Graph Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => onClick('logs')}>
            Logs
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => onClick('legend')}>
            Legend
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => onClick('debugger')}>
            Debugger
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => onClick('dropPanel')}>
            Nodes
          </DropdownMenu.Item>

          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={saveLayout}>
            Save Layout
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={loadLayout}>
            Load Layout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};
