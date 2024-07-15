import {
  LayoutButtons,
  layoutButtons,
} from '../components/toolbar/layoutButtons.js';
import { MutableRefObject, useCallback } from 'react';
import { TabData } from 'rc-dock';
import { dockerSelector } from '@/redux/selectors/refs.js';
import { useSelector } from 'react-redux';
import type { DockLayout } from 'rc-dock';

export const useLayoutButton = () => {
  const dockerRef = useSelector(dockerSelector) as MutableRefObject<DockLayout>;

  const onClick = useCallback(
    (id: LayoutButtons) => {
      const existing = dockerRef.current.find(id) as TabData;

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
            id,
            title: layoutButtons[id].title,
            content: layoutButtons[id].content,
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

  return onClick;
};
