import { node } from "@/nodes/color/convert.js";
import { executeNode } from "@/core.js";

describe("color/convert", () => {
  it("converts csslike colors to rgb", async () => {
    const output = await executeNode({
      input: {
        color: "red",
        space: "rgb",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      a: 255,
      b: 0,
      c: 0,
      channels: [255, 0, 0, undefined],
      d: undefined,
      labels: ["r", "g", "b", "alpha"],
    });
  });

  it("converts csslike colors to gl", async () => {
    const output = await executeNode({
      input: {
        color: "red",
        space: "gl",
      },
      node,
      state: {},
      nodeId: "",
    });

    expect(output).toStrictEqual({
      a: 1,
      b: 0,
      c: 0,
      channels: [1, 0, 0, undefined],
      d: undefined,
      labels: ["r", "g", "b", "alpha"],
    });
  });

  it("converts to p3 from hex", async () => {
    const output = await executeNode({
      input: {
        color: "#52F234",
      },
      node,
      state: {
        space: "p3",
      },
      nodeId: "",
    });

    expect(output).toStrictEqual({
      a: 0.513799063361875,
      b: 0.9363407960900638,
      c: 0.3440788676962286,
      channels: [
        0.513799063361875,
        0.9363407960900638,
        0.3440788676962286,
        undefined,
      ],
      d: undefined,
      labels: ["r", "g", "b", "alpha"],
    });
  });

  it("converts to oklab from hex", async () => {
    const output = await executeNode({
      input: {
        color: "#52F234",
      },
      node,
      state: {
        space: "oklab",
      },
      nodeId: "",
    });

    expect(output).toStrictEqual({
      a: 0.8446731133698594,
      b: -0.19979243108966394,
      c: 0.16178227223673358,
      channels: [
        0.8446731133698594,
        -0.19979243108966394,
        0.16178227223673358,
        undefined,
      ],
      d: undefined,
      labels: ["l", "a", "b", "alpha"],
    });
  });

  it("converts to oklab from oklab", async () => {
    const output = await executeNode({
      input: {},
      node,
      state: {
        color: "oklab(40.1% 0.1143 0.045)",
        space: "cubehelix",
      },
      nodeId: "",
    });

    expect(output).toStrictEqual({
      a: -11.61375995607493,
      b: 0.7511787849960817,
      c: 0.2469609193911593,
      channels: [
        -11.61375995607493,
        0.7511787849960817,
        0.2469609193911593,
        undefined,
      ],
      d: undefined,
      labels: ["h", "s", "l", "alpha"],
    });
  });
});
