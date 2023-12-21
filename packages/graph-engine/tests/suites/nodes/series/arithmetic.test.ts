import Node from "@/nodes/series/arithmetic.js";

describe("series/arithmetic", () => {
  it("generates the expected series", async () => {
    const node = new Node();
    node.inputs.base.setValue(16);
    node.inputs.stepsDown.setValue(1);
    node.inputs.steps.setValue(1);
    node.inputs.increment.setValue(1);
    node.inputs.precision.setValue(0);

    await node.execute();

    const output = node.outputs.array.value;

    expect(output).toStrictEqual([15, 16, 17]);
  });
});

// describe("series/arithmetic with precision", () => {
//   it("handles precision correctly", async () => {
//     // Case 1: Test for precision = 1
//     const output1 = await executeNode({
//       input: {
//         base: 16,
//         stepsDown: 1,
//         steps: 1,
//         increment: 0.5,
//         precision: 1,
//       },
//       node,
//       state: {},
//       nodeId: "",
//     });

//     expect(output1).toStrictEqual({
//       "-1": 15.5,
//       0: 16.0,
//       1: 16.5,
//       asArray: [
//         {
//           index: -1,
//           value: 15.5,
//         },
//         {
//           index: 0,
//           value: 16.0,
//         },
//         {
//           index: 1,
//           value: 16.5,
//         },
//       ],
//     });

//     // Case 2: Test for precision = 2
//     const output2 = await executeNode({
//       input: {
//         base: 16,
//         stepsDown: 2,
//         steps: 2,
//         increment: 0.25,
//         precision: 2,
//       },
//       node,
//       state: {},
//       nodeId: "",
//     });

//     expect(output2).toStrictEqual({
//       "-2": 15.5,
//       "-1": 15.75,
//       0: 16.0,
//       1: 16.25,
//       2: 16.5,
//       asArray: [
//         {
//           index: -2,
//           value: 15.5,
//         },
//         {
//           index: -1,
//           value: 15.75,
//         },
//         {
//           index: 0,
//           value: 16.0,
//         },
//         {
//           index: 1,
//           value: 16.25,
//         },
//         {
//           index: 2,
//           value: 16.5,
//         },
//       ],
//     });

//     // Case 3: Test for a negative increment with precision
//     const output3 = await executeNode({
//       input: {
//         base: 16,
//         stepsDown: 2,
//         steps: 2,
//         increment: -0.3,
//         precision: 1,
//       },
//       node,
//       state: {},
//       nodeId: "",
//     });

//     expect(output3).toStrictEqual({
//       "-2": 16.6,
//       "-1": 16.3,
//       0: 16.0,
//       1: 15.7,
//       2: 15.4,
//       asArray: [
//         {
//           index: -2,
//           value: 16.6,
//         },
//         {
//           index: -1,
//           value: 16.3,
//         },
//         {
//           index: 0,
//           value: 16.0,
//         },
//         {
//           index: 1,
//           value: 15.7,
//         },
//         {
//           index: 2,
//           value: 15.4,
//         },
//       ],
//     });
//   });
// });
