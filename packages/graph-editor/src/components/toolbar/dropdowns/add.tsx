import React from 'react';
import {
  Button,
  DropdownMenu,
  Text
} from '@tokens-studio/ui';
import { Plus, NavArrowRight } from 'iconoir-react';

export const AddDropdown = () => (
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <Button variant='primary'>
        <Plus />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content css={{ minWidth: '200px'}}>
        <DropdownMenu.Item>
          Quick Search ..
          <DropdownMenu.TrailingVisual>
          ⇧K
          </DropdownMenu.TrailingVisual>
        </DropdownMenu.Item>
        
        <DropdownMenu.Separator />

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            Generic
            <DropdownMenu.TrailingVisual>
              <NavArrowRight />
            </DropdownMenu.TrailingVisual>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent sideOffset={2} alignOffset={-5}>
              <DropdownMenu.Item>Input</DropdownMenu.Item>
              <DropdownMenu.Item>Output</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>

      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu>
);
