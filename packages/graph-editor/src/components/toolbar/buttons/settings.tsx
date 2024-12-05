import { IconButton, Tooltip } from '@tokens-studio/ui';
import { useLayoutButton } from '../../../hooks/useLayoutButton.js';
import React from 'react';
import Settings from '@tokens-studio/icons/Settings.js';

export const SettingsToolbarButton = () => {
  const onClick = useLayoutButton();
  return (
    <Tooltip label="Settings" side="bottom">
      <IconButton
        emphasis="low"
        onClick={() => onClick('settings')}
        icon={<Settings />}
      />
    </Tooltip>
  );
};
