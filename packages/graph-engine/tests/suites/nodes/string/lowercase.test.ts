import Node from "@/nodes/string/lowercase.js";

describe("string/lowercase", () => {
  it("lowercases all characters", async () => {
    const node = new Node();

    node.inputs.value.setValue("HHH");

    await node.execute();

    expect(node.outputs.value.value).toStrictEqual("hhh");
  });
});
