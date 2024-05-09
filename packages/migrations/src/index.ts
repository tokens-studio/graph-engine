import { Graph } from "@tokens-studio/graph-engine";
import { sortedUpgrades } from "./migrations/index.js";
import cmp from "semver-compare";

export const findUpgrades = (version: string) =>
  sortedUpgrades.filter(([v]) => cmp(v, version) === 1);

export interface IUpdateGraph {
  verbose?: boolean;
}

export const updateGraph = async (
  graph: Graph,
  opts: IUpdateGraph = { verbose: true }
) => {
  const { verbose } = opts;

  //Check the version
  const version = graph.version || "0.0.0";
  //Copy the graph to prevent mutation
  const copiedGraph = JSON.parse(JSON.stringify(graph));

  const newGraph = await findUpgrades(version).reduce(
    async (accP, [version, upgrader]) => {
      const acc = await accP;
      if (verbose) {
        console.log(`Upgrading to ${version}`);
      }
      return await upgrader(acc);
    },
    Promise.resolve(copiedGraph)
  );

  return newGraph;
};

export * from "./utils.js";
