import { Graph } from "#/graph/graph.js";
import { topologicalSort } from "#/index.js";

describe("Graph/topologic", () => {
  it("Creates the expected topologic output ", async () => {
    const g = new Graph();

    g.setNode("a", "a");
    g.setNode("b", "b");
    g.setNode("c", "c");
    g.setNode("d", "d");
    g.setNode("e", "e");
    g.setNode("f", "f");

    g.setEdge("a->b", "a", "b", "input", "output");
    g.setEdge("a->c", "a", "c", "input", "output");
    g.setEdge("b->d", "b", "d", "input", "output");
    g.setEdge("b->e", "b", "e", "input", "output");
    g.setEdge("c->f", "c", "f", "input", "output");
    g.setEdge("e->g", "e", "f", "input", "output");

    const sorted = topologicalSort(g);

    expect(sorted).toEqual(["a", "c", "b", "e", "f", "d"]);
  });
});
