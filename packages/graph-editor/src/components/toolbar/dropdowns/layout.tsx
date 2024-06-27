import React, { MutableRefObject } from 'react';
import {
  Button,
  DropdownMenu,
  Text,
  Tooltip
} from '@tokens-studio/ui';
import { LayoutLeft, Plus, NavArrowRight } from 'iconoir-react';
import { useLayoutButton } from '../hooks/useLayoutButton';
import { useSelector } from 'react-redux';
import { dockerSelector } from '@/redux/selectors';
import DockLayout from 'rc-dock';

export const LayoutDropdown = () => {
  const dockerRef = useSelector(
    dockerSelector,
  ) as MutableRefObject<DockLayout>;

  const { onClick } = useLayoutButton();

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
      reader.onload = (e) => {
        const text = (e.target as any).result;
        const data = JSON.parse(text);
        dockerRef.current.loadLayout(data);
      };
      reader.readAsText(file);
    };
    input.click();
  }, [dockerRef]);

  return (
    <DropdownMenu>
      <Tooltip label="Window" side="bottom">
        <DropdownMenu.Trigger asChild>
          <Button variant='invisible' style={{ paddingLeft: '0', paddingRight: '0' }}>
            <LayoutLeft />
          </Button>
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Portal>
        <DropdownMenu.Content css={{ minWidth: '200px' }}>
          <DropdownMenu.Item onClick={() => onClick('inputs')}>
            Input
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onClick('outputs')}>
            Output
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onClick('nodeSettings')}>
            Node Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onClick('graphSettings')}>
            Graph Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onClick('logs')}>
            Logs
          </DropdownMenu.Item>
          {/* <DropdownMenu.Item>
            Play Controls
          </DropdownMenu.Item> */}
          <DropdownMenu.Item onClick={() => onClick('legend')}>
            Legend
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onClick('debugger')}>
            Debugger
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onClick('dropPanel')}>
            Nodes
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              Layout Presets
              <DropdownMenu.TrailingVisual>
                <NavArrowRight />
              </DropdownMenu.TrailingVisual>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent sideOffset={2} alignOffset={-5}>
                <DropdownMenu.Item>Minimal</DropdownMenu.Item>
                <DropdownMenu.Item>Exploration</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator />

          <DropdownMenu.Item onClick={saveLayout}>
            Save Layout
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={loadLayout}>
            Load Layout
          </DropdownMenu.Item>

        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};
