import { dockerSelector } from "@/redux/selectors";
import DockLayout, { TabData } from "rc-dock";
import { MutableRefObject } from "react";
import { useSelector } from "react-redux";
import { LayoutButtons, layoutButtons } from "../layoutButtons";

export const useLayoutButton = () => {
  const dockerRef = useSelector(
    dockerSelector,
  ) as MutableRefObject<DockLayout>;

  const onClick = (id: LayoutButtons) => {
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
  };

  return {
    onClick
  }
}
