---
title: Programmatic Usage
---

# Programmatic usage

The [@tokens-studio/graph-engine](https://www.npmjs.com/package/@tokens-studio/graph-engine) is intended to be useable both in a UI as well as in code. While verbose it is powerful and supports intellisense by using typescript

### Basic

In this example we are going to construct a graph that performs the math function x = (y +3)/4

```ts
import { Graph, NumberSchema } from "@tokens-studio/graph-engine";
//You can import nodes directly to benefit from treeshaking
import Input from "@tokens-studio/graph-engine/nodes/generic/input";
import Output from "@tokens-studio/graph-engine/nodes/generic/output";
import Add from "@tokens-studio/graph-engine/nodes/math/add";
import Divide from "@tokens-studio/graph-engine/nodes/math/divide";

const graph = new Graph();

const input = new Input({ graph });
const output = new Output({ graph });
const add = new Add({ graph });
const div = new Divide({ graph });


//Create an input port on the input. This would be a dynamic property
input.addInput("y", {
  type: NumberSchema,
});
// Until this is node is executed, it won't have dynamic ports initialized. Let's help it along
input.addOutput("y", {
  type: NumberSchema,
});

//Lets connected the value to the add node
input.outputs.y.connect(add.inputs.a);

//Since we know that we are using a constant lets set the value directly
add.inputs.b.setValue(3);

//Then connect to division

add.outputs.value.connect(div.inputs.a);

//And set its value
div.inputs.b.setValue(4);

//And lastly connect to the output

div.outputs.value.connect(output.inputs.input);

//Psst if you had set an initial value for y, you could actually ask for the output value right now !?
// const alreadyComputed = div.outputs.value.value

const result = await graph.execute({
  inputs: {
    y: {
      type: NumberSchema,
      value: 5,
    },
  },
});

//Let's now save the graph so we can share it with others

const myCoolGraph = graph.serialize();
```
