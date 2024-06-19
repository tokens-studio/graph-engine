import React from 'react';
import {
  Button,
  DropdownMenu,
  Text
} from '@tokens-studio/ui';
import { Plus, NavArrowRight } from 'iconoir-react';

export const ZoomDropdown = () => (
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <Button>100%</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content css={{ minWidth: '200px'}}>
        <DropdownMenu.Item>
          10%
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          25%
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          50%
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          100%
          <DropdownMenu.TrailingVisual>
          ⇧1
          </DropdownMenu.TrailingVisual>
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Item>
          Center on Node
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Center on Node & Edges
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Item>
          Zoom In

          <DropdownMenu.TrailingVisual>
            ⌘+
          </DropdownMenu.TrailingVisual>

        </DropdownMenu.Item>
        <DropdownMenu.Item>
          Zoom Out

          <DropdownMenu.TrailingVisual>
            ⌘-
          </DropdownMenu.TrailingVisual>

        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            Load Viewport
            <DropdownMenu.TrailingVisual>
              <NavArrowRight />
            </DropdownMenu.TrailingVisual>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent sideOffset={2} alignOffset={-5}>
              <DropdownMenu.Item>
                Viewport 1
                <DropdownMenu.TrailingVisual>1</DropdownMenu.TrailingVisual>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                Viewport 2
                <DropdownMenu.TrailingVisual>2</DropdownMenu.TrailingVisual>
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            Save Viewport
            <DropdownMenu.TrailingVisual>
              <NavArrowRight />
            </DropdownMenu.TrailingVisual>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent sideOffset={2} alignOffset={-5}>
              <DropdownMenu.Item>
                Viewport 1
                <DropdownMenu.TrailingVisual>⌘1</DropdownMenu.TrailingVisual>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                Viewport 2
                <DropdownMenu.TrailingVisual>⌘2</DropdownMenu.TrailingVisual>
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>

      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu>
);
