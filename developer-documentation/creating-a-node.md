# Creating a node

1. Decide on the namespace for your node.

You should use [reverse-domain-notation](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) to create a custom node to ensure that you won't get a namespace collision.

2. Create your node definition file

Use the following as a template

```ts 
import { INodeDefinition, ToInput, ToOutput,NumberSchema,Node } from "@tokens-studio/graph-engine";

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
      visible: true,
    });
    this.addInput("b", {
      type: NumberSchema,
      visible: true,
    });
    this.addOutput("value", {
      type: NumberSchema,
      visible: true,
    });
  }

  //This is the main logic of your node. The execute can be async or not.
  execute(){
    const { a, b } = this.getAllInputs();
    this.setOutput("value", a + b);
  }
}
```

3. Expose your node

You will likely want to provide an ESM compatible exports to the file to help with treeshaking.

4. Add testing

Add a testing file. The following is a basic test of the logic of the above math node

```ts
//This will depend on where you created your node file in step 2
import Node from "@/nodes/math/add";
import { Graph } from "@tokens-studio/graph-engine";
import {describe, it, expect} from '@jest/globals';

describe("math/add", () => {
  it("adds two numbers", async () => {
    const graph = new Graph();
    const node = new Node({ graph });
    graph.addNode(node);
    node.inputs.a.setValue(1);
    node.inputs.b.setValue(1);

    //For more complicated nodes you will likely want to interact with the graph object instead of executing the node directly
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(3);
  });
});
```



Congratulations, you have created your first node! Verify everything works by dropping your node inside the the editor interface from the drop panel on the left handside.

**Note** you can do the UI steps during your development above by using the command `npm run dev:ui:live` to constantly build the graph-engine source while you play with the UI.
