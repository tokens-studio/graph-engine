import { clean } from "../../src/index.js";

describe("clean", () => {
  // Tests that clean function returns a new graph object with no dangling edges when given a graph with no dangling edges
  it("should return the same graph object when given a graph with no dangling edges", () => {
    const graph = {
      nodes: [
        { id: "1", type: "x", data: {}, position: { x: 0, y: 0 } },
        { id: "2", type: "y", data: {}, position: { x: 0, y: 0 } },
      ],
      edges: [
        {
          id: "x",
          source: "1",
          target: "2",
          sourceHandle: "a",
          targetHandle: "b",
        },
      ],
      state: {},
    };
    const result = clean(graph);
    expect(result).toEqual(graph);
  });

  it("should return the same graph object when given a graph with only one node and no edges", () => {
    const graph = {
      nodes: [{ id: "1", type: "x", data: {}, position: { x: 0, y: 0 } }],
      edges: [],
      state: {},
    };
    const result = clean(graph);
    expect(result).toEqual(graph);
  });

  it("should return a new graph object with no dangling edges when given a graph with one node and one dangling edge", () => {
    const graph = {
      nodes: [{ id: "1", type: "x", data: {}, position: { x: 0, y: 0 } }],
      edges: [
        {
          id: "x",
          source: "1",
          target: "2",
          sourceHandle: "a",
          targetHandle: "b",
        },
      ],
      state: {},
    };
    const expected = {
      nodes: [{ id: "1", type: "x", data: {}, position: { x: 0, y: 0 } }],
      edges: [],
      state: {},
    };
    const result = clean(graph);
    expect(result).toEqual(expected);
  });
});
