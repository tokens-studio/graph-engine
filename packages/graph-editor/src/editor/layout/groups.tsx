import { IconButton } from '@tokens-studio/ui/IconButton.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { TabGroup } from 'rc-dock';
import ArrowUpRight from '@tokens-studio/icons/ArrowUpRight.js';
import Maximize from '@tokens-studio/icons/Maximize.js';
import React from 'react';
import Reduce from '@tokens-studio/icons/Reduce.js';
import Xmark from '@tokens-studio/icons/Xmark.js';

const DockButton = (rest) => {
  return <IconButton size="small" emphasis="low" {...rest} />;
};

export const groups: Record<string, TabGroup> = {
  popout: {
    animated: true,
    floatable: true,

    panelExtra: (panelData, context) => {
      const buttons: React.ReactElement[] = [];
      if (panelData?.parent?.mode !== 'window') {
        const maxxed = panelData?.parent?.mode === 'maximize';
        buttons.push(
          <DockButton
            key="maximize"
            title={
              panelData?.parent?.mode === 'maximize' ? 'Restore' : 'Maximize'
            }
            icon={maxxed ? <Reduce /> : <Maximize />}
            onClick={() => context.dockMove(panelData, null, 'maximize')}
          ></DockButton>,
        );
        buttons.push(
          <DockButton
            key="new-window"
            title="Open in new window"
            icon={<ArrowUpRight />}
            onClick={() => context.dockMove(panelData, null, 'new-window')}
          ></DockButton>,
        );
      }
      buttons.push(
        <DockButton
          key="close"
          title="Close"
          icon={<Xmark />}
          onClick={() => context.dockMove(panelData, null, 'remove')}
        ></DockButton>,
      );
      return <Stack>{buttons}</Stack>;
    },
  },
  /**
   * Note that the graph has a huge issue when ran in a popout window, as such we disable it for now
   */
  graph: {
    animated: true,
    floatable: true,
    panelExtra: (panelData, context) => {
      const buttons: React.ReactElement[] = [];
      if (panelData?.parent?.mode !== 'window') {
        const maxxed = panelData?.parent?.mode === 'maximize';
        buttons.push(
          <DockButton
            key="maximize"
            title={
              panelData?.parent?.mode === 'maximize' ? 'Restore' : 'Maximize'
            }
            icon={maxxed ? <Reduce /> : <Maximize />}
            onClick={() => context.dockMove(panelData, null, 'maximize')}
          ></DockButton>,
        );
      }

      return <Stack>{buttons}</Stack>;
    },
  },
};
