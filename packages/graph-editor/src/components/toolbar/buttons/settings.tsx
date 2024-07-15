import { IconButton, Tooltip } from '@tokens-studio/ui';
import { Settings } from 'iconoir-react';
import { useLayoutButton } from '../../../hooks/useLayoutButton.js';
import React from 'react';

export const SettingsToolbarButton = () => {
  const onClick = useLayoutButton();
  return (
    <Tooltip label="Settings" side="bottom">
      <IconButton
        variant="invisible"
        onClick={() => onClick('settings')}
        icon={<Settings />}
      />
    </Tooltip>
  );
};
