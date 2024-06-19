import React from 'react';
import {
  Button,
  DropdownMenu,
  Text
} from '@tokens-studio/ui';
import { LayoutLeft, Plus, NavArrowRight } from 'iconoir-react';

export const LayoutDropdown = () => (
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <Button variant='invisible' style={{paddingLeft: '0', paddingRight: '0'}}>
        <LayoutLeft />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content css={{ minWidth: '200px'}}>
        <DropdownMenu.Item>
          Input
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Output
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Node Settings
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Graph Settings
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Logs
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Play Controls
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Legend
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Debugger
        </DropdownMenu.Item>
        <DropdownMenu.Item>
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
        
        <DropdownMenu.Item>
          Save Layout
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Load Layout
        </DropdownMenu.Item>

      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu>
);
