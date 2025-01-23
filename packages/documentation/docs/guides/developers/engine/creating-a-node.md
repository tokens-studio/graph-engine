# Creating a node

## 1. Decide on the namespace for your node.

You should use [reverse-domain-notation](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) to create a custom node to ensure that you won't get a namespace collision.

## 2. Create your node definition file

Use the following as a template

```ts
import {
  INodeDefinition,
  NumberSchema,
  Node,
} from "@tokens-studio/graph-engine";
import type { ToInput, ToOutput } from "@tokens-studio/graph-engine";

export default class MyCustomNode extends Node {
  //This is the title associated with your node
  static title = "Add";
  //This is your reverse domain notation node name
  static type = "studio.tokens.math.add";
  //The description for your node. This is optional
  static description = "Add node allows you to add two numbers.";
  //The following declaration for inputs and outputs helps improve the experience for developers using typescript, but this can be considered optional
  declare inputs: ToInput<{
    a: number;
    b: number;
  }>;
  declare outputs: ToOutput<{
    value: number;
  }>;

  //Add your custom logic to node creation.
  //You will likely want to expose input and output ports for the node
  constructor(props: INodeDefinition) {
    super(props);
    this.addInput("a", {
      type: NumberSchema,
    });
    this.addInput("b", {
      type: NumberSchema,
    });
    this.dataflow.addOutput("value", {
      type: NumberSchema,
    });
  }

  //This is the main logic of your node. The execute can be async or not.
  execute() {
    //These will be strongly typed if you used declarations
    const { a, b } = this.getAllInputs();
    this.outputs.value.set(a + b);
  }
}
```

## 3. Add testing

Add a testing file. The following is a basic test of the logic of the above math node

```ts
//This will depend on where you created your node file in step 2
import Node from "@/nodes/math/add";
import { Graph } from "@tokens-studio/graph-engine";
import { expect } from "chai";

describe("math/add", () => {
  it("adds two numbers", async () => {
    const graph = new Graph();
    const node = new Node({ graph });

    node.inputs.a.setValue(1);
    node.inputs.b.setValue(1);

    //For more complicated nodes you will likely want to interact with the graph object instead of executing the node directly
    await node.run();
    expect(node.outputs.value.value).toStrictEqual(3);
  });
});
```

## 4. Load the node into the UI (Optional)

Now that you've made a visual representation of your node, you likely will want to add it into the visual editor.

You will need to load your node as a `panelItems` in the editor.

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import {nodeLookup, Editor, PanelGroup, DropPanelStore, PanelItem,defaultPanelGroupsFactory } from '@tokens-studio/graph-editor';
import '@tokens-studio/graph-editor/index.css';
import MyCustomNode from './somewhere';

//This exposes the node under a specific panel in the editor
export const panelItems = defaultPanelGroupsFactory();

panelItems.groups.push(new PanelGroup({
    title: 'Custom',
    key: 'custom',
    items:
         new PanelItem({
            type: MyCustomNode.type,
            //Add a cool svg image here
            icon: '??',
            text: MyCustomNode.title,
            description: MyCustomNode.description,
            //Add some custome path here for the node
            docs: '',
        })),
}))

//This adds the node class to the editor so it can construct it when needed
export const nodeTypes = {
    //Default
    ...nodeLookup,
    [MyCustomNode.type]:MyCustomNode
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div id='graph-editor'>
      <Editor
        nodeTypes = {nodeTypes}
        panelItems={panelItems}
      />
    </div>
  </React.StrictMode>,
)


```

Congratulations, you have created your first node!
