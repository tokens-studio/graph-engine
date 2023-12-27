import React from 'react';
import { IconButton, Dialog } from '@tokens-studio/ui';
import { SettingsIcon } from '@iconicicons/react';
import { Settings } from '../panels/settings';

export const SettingsDialog = () => {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <IconButton
          css={{ flexShrink: 0 }}
          icon={<SettingsIcon />}
          variant="invisible"
          tooltip="Settings"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>

          <Settings />
          <Dialog.CloseButton />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
