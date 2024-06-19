import React from 'react';
import {
  Button,
  DropdownMenu,
  Text
} from '@tokens-studio/ui';
import { AlignHorizontalCenters, CompAlignLeft, CompAlignRight, CompAlignTop, CompAlignBottom, NavArrowRight, AlignHorizontalSpacing, AlignVerticalSpacing } from 'iconoir-react';

export const AlignDropdown = () => (
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <Button variant='invisible' style={{paddingLeft: '0', paddingRight: '0'}}>
        <AlignHorizontalCenters />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content css={{ minWidth: '200px'}}>
        <DropdownMenu.Item>
          <DropdownMenu.LeadingVisual>
            <CompAlignLeft />
          </DropdownMenu.LeadingVisual>
          Align Left
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <DropdownMenu.LeadingVisual>
            <AlignHorizontalCenters />
          </DropdownMenu.LeadingVisual>
          Align Center
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <DropdownMenu.LeadingVisual>
            <CompAlignRight />
          </DropdownMenu.LeadingVisual>
          Align Right
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Item>
          <DropdownMenu.LeadingVisual>
            <CompAlignTop />
          </DropdownMenu.LeadingVisual>
          Align Top
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <DropdownMenu.LeadingVisual>
            <AlignHorizontalCenters />
          </DropdownMenu.LeadingVisual>
          Align Center
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <DropdownMenu.LeadingVisual>
            <CompAlignBottom />
          </DropdownMenu.LeadingVisual>
          Align Bottom
        </DropdownMenu.Item>

        <DropdownMenu.Separator />


        <DropdownMenu.Item>
          <DropdownMenu.LeadingVisual>
            <AlignHorizontalSpacing />
          </DropdownMenu.LeadingVisual>
          Distribute Horizontally
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <DropdownMenu.LeadingVisual>
            <AlignVerticalSpacing />
          </DropdownMenu.LeadingVisual>
          Distribute Vertically
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu>
);
