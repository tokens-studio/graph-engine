import { topologicalSort } from "@/graph";
import { Graph } from "@/graph/graph.js";
import Passthrough from "@/nodes/generic/passthrough";

describe("Graph/topologic", () => {
  it("Creates the expected topologic output ", async () => {
    const graph = new Graph();

    graph.addNode(new Passthrough({ id: "a", graph }));
    graph.addNode(new Passthrough({ id: "b", graph }));
    graph.addNode(new Passthrough({ id: "c", graph }));
    graph.addNode(new Passthrough({ id: "d", graph }));
    graph.addNode(new Passthrough({ id: "e", graph }));
    graph.addNode(new Passthrough({ id: "f", graph }));

    graph.createEdge({
      id: "a->b",
      source: "a",
      target: "b",
      sourceHandle: "value",
      targetHandle: "value",

    });
    graph.createEdge({
      id: "a->c",
      source: "a",
      target: "c",
      sourceHandle: "value",
      targetHandle: "value",
    });
    graph.createEdge({
      id: "b->d",
      source: "b",
      target: "d",
      sourceHandle: "value",
      targetHandle: "value",
    });
    graph.createEdge({
      id: "b->e",
      source: "b",
      target: "e",
      sourceHandle: "value",
      targetHandle: "value",
    });
    graph.createEdge({
      id: "c->f",
      source: "c",
      target: "f",
      sourceHandle: "value",
      targetHandle: "value",
    });
    graph.createEdge({
      id: "e->g",
      source: "e",
      target: "f",
      sourceHandle: "value",
      targetHandle: "value",
    });
  

    const sorted = topologicalSort(graph);

    expect(sorted).toEqual(["a", "c", "b", "e", "f", "d"]);
  });
});
