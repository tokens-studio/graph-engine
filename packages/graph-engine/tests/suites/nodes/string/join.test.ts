import Node from "@/nodes/string/join.js";

describe("string/join", () => {
  it("should join the string array correctly", async () => {
    const node = new Node();

    node.inputs.array.setValue(["a", "b", "c"]);
    node.inputs.separator.setValue(",");

    await node.execute();

    expect(node.outputs.value.value).toStrictEqual("a,b,c");
  });
});
