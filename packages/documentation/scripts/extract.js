/* eslint-disable */
const CLASS = 128;
const TS_PREFIX = "```ts".length;
const TS_SUFFIX = "```".length;

const fs = require("fs-extra");

function extractExamples(x) {
  if (!x.children) {
    return [];
  }

  //Find the class definition
  const klass = x.children.filter((x) => x.kind == 128)[0];

  if (!klass || !klass.comment?.blockTags) {
    return [];
  }

  const examples = klass.comment?.blockTags.reduce((acc, x) => {
    if (x.tag == "@example") {
      x.content.map((y) => {
        if (y.text.startsWith("```json")) {
          //7 is the offset for the ```json
          // -3 is the offset for the ```
          acc.push({
            type: "json",
            value: y.text.slice(7, -3),
          });
        } else if (y.text.startsWith("```ts")) {
          //5 is the offset for the ```ts
          // -3 is the offset for the ```
          acc.push({
            type: "ts",
            value: y.text.slice(5, -3),
          });
        }
      });
    }
    return acc;
  }, []);

  return examples;
}

async function writeExamples(examples, name) {
  if (!examples || examples.length == 0) {
    return;
  }

  const { jsonExamples, tsExamples } = examples.reduce(
    (acc, x) => {
      if (x.type == "json") {
        acc.jsonExamples.push(x);
      }
      if (x.type == "ts") {
        acc.tsExamples.push(x);
      }
      return acc;
    },
    {
      jsonExamples: [],
      tsExamples: [],
    },
  );

  await Promise.all(
    jsonExamples.map(async (x, i) => {
      await fs.outputFile(
        `./src/components/editor/raw/${name}/${i}.json`,
        x.value,
      );
    }),
  );
  //Then write the import file
  await fs.outputFile(
    `./src/components/editor/nodes/${name}/index.ts`,
    jsonExamples
      .map(
        (_, i) =>
          `export { default as example${i} } from '@site/src/components/editor/raw/${name}/${i}.json';`,
      )
      .join("\n"),
  );

  const imports = jsonExamples.map((_, i) => `example${i}`).join(",");

  //Return the
  return {
    import: `import {${imports}} from '@site/src/components/editor/nodes/${name}/index.ts';`,
    examples: jsonExamples
      .map((example, i) => {
        return `<div style={{height:'100vh',width:'65vw'}}>
    <Editor initialLayout={InitialLayout} showMenu={false} initialGraph={example${i}} />
</div>`;
      })
      .concat(
        tsExamples.map((x) => {
          return `
\`\`\`ts
${x.value}
\`\`\`
`;
        }),
      )
      .join("\n"),
  };
}

function extractInputs(inputs) {
  if (!inputs) {
    return null;
  }

  const vals = (inputs.type.typeArguments || []).reduce((acc, x) => {
    // Then we don't know the type
    if (!x.declaration) {
      return acc;
    }

    //This only appears to occur for  [key: string]: any;
    if (!x.declaration.children) {
      acc.push(`
#### *ANY*

This uses dynamically generated keys and values.
\`[key: string]: any;\`
`);
      return acc;
    }

    x.declaration.children.map((x) => {
      const description = x.comment?.summary[0].text;
      const defaultValue = x.comment?.blockTags
        ?.filter((x) => x.tag == "@default")[0]
        ?.content[0].text.slice(TS_PREFIX, -TS_SUFFIX)
        .trim();
      acc.push(`
#### ${x.name}

${description || "*No description*"}

${defaultValue ? `- Default: ${defaultValue}` : ""}
`);
    });
    return acc;
  }, []);

  return vals.join("\n");
}

async function generate() {
  try {
    const docsJson = require("../../graph-engine/docs/docs.json");

    console.log("Cleaning existing");

    await fs.emptyDir("./docs/nodes");
    await fs.emptyDir("./src/components/editor/raw");
    await fs.emptyDir("./src/components/editor/nodes");

    const nodes = docsJson.children
      .filter((x) => x.name.startsWith("nodes"))
      .map(async (x) => {
        //No children, no need to process
        if (!x.children || x.children.length == 0) {
          return Promise.resolve();
        }

        //Look for a default declaration  that is the class
        const children = x.children
          .filter((y) => y.kind == CLASS && y.name == "default")
          .map((x) =>
            x.children.reduce((acc, value) => {
              acc[value.name] = value;
              return acc;
            }, {}),
          );

        //No class found, no need to process
        if (children.length == 0) {
          return Promise.resolve();
        }

        const values = children[0];

        //get the name
        const name = x.name.split("/").pop();
        const fullName = x.name;
        //Dynamically construct the doc file

        const inputs = extractInputs(values.inputs);
        const outputs = extractInputs(values.outputs);

        const rawExamples = extractExamples(x);
        const examples = await writeExamples(rawExamples, fullName);

        //If there are examples then we need to add them to the doc

        return fs.outputFile(
          `./docs/${x.name}.mdx`,
          `---
title: ${name.charAt(0).toUpperCase() + name.slice(1)}
---
import { Editor, PanelGroup, DropPanelStore, PanelItem } from '@tokens-studio/graph-editor';
import {InitialLayout} from '@site/src/components/editor/layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
${examples?.import || ""}

# ${name}

Node Type ID: \`${values.type?.defaultValue}\`

## Package 

This is a core package available at [Graph Engine](https://www.npmjs.com/package/@tokens-studio/graph-engine)

To install 

<Tabs>
  <TabItem value="npm" label="NPM" default>
\`\`\`bash
npm install @tokens-studio/graph-engine
\`\`\`
  </TabItem>
  <TabItem value="yarn" label="Yarn">
\`\`\`bash
yarn add @tokens-studio/graph-engine
\`\`\`
  </TabItem>
</Tabs>



## Description
${values.description?.defaultValue.slice(1, -1)}

## Inputs

${inputs ? inputs : "*No inputs*"}

## Outputs

${outputs ? outputs : "*No outputs*"}


## Example

${examples?.examples || "*No examples*"}

`,
        );
      });

    await Promise.all(nodes);
  } catch (err) {
    console.error("No docs.json file found. Build the graph engine docs first");
    console.error(err);
    process.exit(1);
  }
}
generate();
