import { TabData } from 'rc-dock';
import { dockerSelector } from '@/redux/selectors/refs.js';
import { useSelector } from 'react-redux';
import React, { MutableRefObject, useCallback } from 'react';
import type { DockLayout } from 'rc-dock';

export type PanelFactory = {
  group: string;
  id: string;
  title: React.ReactElement | string;
  content: React.ReactElement;
};

export const useOpenPanel = () => {
  const dockerRef = useSelector(dockerSelector) as MutableRefObject<DockLayout>;

  const toggle = useCallback(
    (panel: PanelFactory) => {
      const existing = dockerRef.current.find(panel.id) as TabData;

      if (existing) {
        // Look for the panel
        if (existing.parent?.tabs.length === 1) {
          // Close the panel instead
          dockerRef.current.dockMove(existing.parent, null, 'remove');
        } else {
          // Close the tab
          dockerRef.current.dockMove(existing, null, 'remove');
        }
      } else {
        dockerRef.current.dockMove(
          {
            cached: true,
            group: 'popout',
            id: panel.id,
            title: panel.title,
            content: panel.content,
          },
          null,
          'float',
          {
            left: 500,
            top: 300,
            width: 320,
            height: 400,
          },
        );
      }
    },
    [dockerRef],
  );

  return { toggle };
};
