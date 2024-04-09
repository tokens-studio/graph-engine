import { topologicalSort } from "@/graph";
import { Graph } from "@/graph/graph.js";
import { Node } from "@/programmatic";

describe("Graph/topologic", () => {
  it("Creates the expected topologic output ", async () => {
    const graph = new Graph();

    graph.addNode(new Node({ id: "a", graph }));
    graph.addNode(new Node({ id: "b", graph }));
    graph.addNode(new Node({ id: "c", graph }));
    graph.addNode(new Node({ id: "d", graph }));
    graph.addNode(new Node({ id: "e", graph }));
    graph.addNode(new Node({ id: "f", graph }));

    graph.createEdge({
      id: "a->b",
      source: "a",
      target: "b",
      sourceHandle: "input",
      targetHandle: "output",

    });
    graph.createEdge({
      id: "a->c",
      source: "a",
      target: "c",
      sourceHandle: "input",
      targetHandle: "output",
    });
    graph.createEdge({
      id: "b->d",
      source: "b",
      target: "d",
      sourceHandle: "input",
      targetHandle: "output",
    });
    graph.createEdge({
      id: "b->e",
      source: "b",
      target: "e",
      sourceHandle: "input",
      targetHandle: "output",
    });
    graph.createEdge({
      id: "c->f",
      source: "c",
      target: "f",
      sourceHandle: "input",
      targetHandle: "output",
    });
    graph.createEdge({
      id: "e->g",
      source: "e",
      target: "f",
      sourceHandle: "input",
      targetHandle: "output",
    });
  

    const sorted = topologicalSort(graph);

    expect(sorted).toEqual(["a", "c", "b", "e", "f", "d"]);
  });
});
