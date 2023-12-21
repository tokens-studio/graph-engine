import Node from "@/nodes/string/split.js";

describe("string/split", () => {
  it("splits a string as expected", async () => {
    const node = new Node();
    node.inputs.value.setValue("HHH");
    node.inputs.value.setValue("H,H,H");
    await node.execute();
    expect(node.outputs.value.value).toStrictEqual(["H", "H", "H"]);
  });
});
