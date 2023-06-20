# Creating a node

1. Decide on the namespace for your node.

You should use [reverse-domain-notation](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) to create a custom node to ensure that you won't get a namespace collision.

2. Create the index.ts file

This would be located at `./packages/graph-engine/src/nodes/[TYPE]/[NODE_NAME].ts`. Populate the values with your custom logic and expose a `node` property which is a `NodeDefinition` type.

3. Add your node to the index exports located at `./packages/graph-engine/src/nodes/[TYPE]/index.ts`

This ensures that your node is exported as part of the bundled `nodes` import available from the graph engine package via

```ts
import { nodes } from "@tokens-studio/graph-engine";
```

This includes all nodes, however an advanced user can ignore this and import specific nodes if they wish to perform manual tree-shaking

4. Add testing

Create `./packages/graph-engine/tests/suites/nodes/[TYPE]/[NODE_NAME].test.ts` and add testing relevant to your node.

5. Expose your node in the UI Drop panel

Goto `./packages/ui/src/components/flow/dropPanel.tsx`, and add your node under its type using your unique node id type. You can optionally also create an icon for the node or configure additional state that must be passed in during creation

6. Create the Node UI

Create `./packages/ui/src/components/flow/nodes/[TYPE]/[NODE_NAME].tsx` which will be your UI for your node. The following is the minimum possible UI for a node. You will need to replace `TYPE`,`NODE_NAME` with the expected values. See the documentation inside the `WrapNode` for more insight on how it handles state management behind the scenes

```tsx
import { Stack, Text } from "@tokens-studio/ui";
import { Handle, HandleContainer } from "#/components/flow/handles.tsx";
import { WrapNode, useNode } from "../../wrapper/nodeV2.tsx";
import { node } from "@tokens-studio/graph-engine/nodes/TYPE/NODE_NAME.js";
import PreviewAny from "../../preview/any.tsx";
import React from "react";

const MyNode = (props) => {
  const { input, output, state, setState } = useNode();

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="input">
          <Text>Input</Text>
        </Handle>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id="output">
          <Text>Output</Text>
          <PreviewAny value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(MyNode, {
  ...node,
  title: "NODE_NAME",
});
```

7. Register the node

In `./packages/ui/src/components/flow/nodes/index.ts`, import your created node and add it to the array of nodes inside the `processTypes` function

Congratulations, you have created your first node! Verify everything works by dropping your node inside the the editor interface from the drop panel on the left handside.

**Note** you can do the UI steps during your development above by using the command `npm run dev:ui:live` to constantly build the graph-engine source while you play with the UI.
