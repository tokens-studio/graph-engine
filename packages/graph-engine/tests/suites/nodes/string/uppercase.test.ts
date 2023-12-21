import Node from "@/nodes/string/uppercase.js";

describe("string/uppercase", () => {
  it("uppercases all characters", async () => {
    const node = new Node();
    node.inputs.value.setValue("jjj");
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual("JJJ");
  });
});
