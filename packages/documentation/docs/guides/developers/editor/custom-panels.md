---
title: Custom Panels
---

# Custom Panels

Custom panels can be added for the editor. To create a custom panel we first need to go over how the panel gets trigger to be opened. In this case we are going to assume it's through clicking on an item in the menu bar. Lets create a custom `menu.tsx` file quick.

```tsx
import {
  defaultMenuDataFactory,
  windowButton,
} from "@tokens-studio/graph-editor";
import CustomPanel from "./customPanel.tsx";
import React from "react";

export const menu = defaultMenuDataFactory();

const windows = menu.items.find((x) => x.name === "window");
if (!windows) {
  throw new Error("Window menu not found");
}

/**
 * The window button utility is an easy way to toggle hiding and showing the custom panel we are creating
 */
windows.items.push(
  windowButton({
    name: "myId",
    id: "myId",
    title: "Custom Panel",
    content: <CustomPanel />,
  }),
);
```

We would need to pass this menu into the editor, so in your `app.tsx` file

```tsx
import { Editor } from '@tokens-studio/graph-editor';
import React from 'react';
import { menu } from './menu.tsx';

export const App (){

  return  <Editor showMenu menuItems={menu} />
}
```

Now we need to implement the logic for the custom panel. Create a `customPanel.tsx` file

```tsx
import React from "react";
import { useGraph } from "@tokens-studio/graph-editor";
import { annotatedVersion } from "@tokens-studio/graph-engine";

/**
 * In this toy example we just want to display the version of the engine
 */
export default function Panel() {
  const graph = useGraph();
  return <div>{graph?.annotations[annotatedVersion]}</div>;
}
```
