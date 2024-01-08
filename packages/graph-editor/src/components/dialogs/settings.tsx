import React from 'react';
import { IconButton, Dialog } from '@tokens-studio/ui';

import { Settings } from '../panels/settings';
import { GearIcon } from '@radix-ui/react-icons';

export const SettingsDialog = () => {
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <IconButton
          css={{ flexShrink: 0 }}
          icon={<GearIcon />}
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
