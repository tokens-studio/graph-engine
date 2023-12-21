import { topologicalSort } from "@/graph";
import { Graph } from "@/graph/graph.js";
import { Node } from "@/programmatic";

describe("Graph/topologic", () => {
  it("Creates the expected topologic output ", async () => {
    const g = new Graph();

    g.addNode(new Node({ id: "a" }));
    g.addNode(new Node({ id: "b" }));
    g.addNode(new Node({ id: "c" }));
    g.addNode(new Node({ id: "d" }));
    g.addNode(new Node({ id: "e" }));
    g.addNode(new Node({ id: "f" }));

    g.createEdge("a->b", "a", "b", "input", "output");
    g.createEdge("a->c", "a", "c", "input", "output");
    g.createEdge("b->d", "b", "d", "input", "output");
    g.createEdge("b->e", "b", "e", "input", "output");
    g.createEdge("c->f", "c", "f", "input", "output");
    g.createEdge("e->g", "e", "f", "input", "output");

    const sorted = topologicalSort(g);

    expect(sorted).toEqual(["a", "c", "b", "e", "f", "d"]);
  });
});
