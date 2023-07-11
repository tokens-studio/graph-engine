import React from 'react';
import {
  Button,
  Dialog,
  DropdownMenu,
  IconButton,
  Label,
  Stack,
} from '@tokens-studio/ui';
import { ChevronDownIcon, SettingsIcon } from '@iconicicons/react';
import { useSelector } from 'react-redux';
import { edgeType as edgeTypeSelector } from '#/redux/selectors/edgeType.ts';
import { useDispatch } from '#/hooks/useDispatch.ts';
import { EdgeType } from '#/redux/models/settings.ts';

const EdgeValues = Object.values(EdgeType);

export const Settings = () => {
  const edgeType = useSelector(edgeTypeSelector);
  const dispatch = useDispatch();

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <IconButton tooltip="settings" icon={<SettingsIcon />} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>

          <Stack direction="row" gap={2} justify="between">
            <Label>Edge Type</Label>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" asDropdown size="small">
                  {edgeType}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content side="top">
                {EdgeValues.map((value, index) => {
                  return (
                    <DropdownMenu.Item
                      key={index}
                      onClick={() => dispatch.settings.setEdgeType(value)}
                    >
                      {value}
                    </DropdownMenu.Item>
                  );
                })}
                <DropdownMenu.Item></DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </Stack>

          <Dialog.CloseButton />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
