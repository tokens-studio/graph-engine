import Node from "@/nodes/typing/passUnit.js";

describe("typing/passUnit", () => {
  it("adds unit if falsey value", async () => {
    const node = new Node();

    node.inputs.value.setValue("0");
    node.inputs.fallback.setValue("px");

    await node.execute();

    const output = node.outputs.value.value;
    expect(output).toStrictEqual("0px");
  });

  it("adds unit if not detected", async () => {
    const node = new Node();

    node.inputs.value.setValue("3");
    node.inputs.fallback.setValue("px");

    await node.execute();

    const output = node.outputs.value.value;
    expect(output).toStrictEqual("3px");
  });

  it("does not add unit if  detected", async () => {
    const node = new Node();

    node.inputs.value.setValue("3px");
    node.inputs.fallback.setValue("px");

    await node.execute();

    const output = node.outputs.value.value;
    expect(output).toStrictEqual("3px");
  });
});
