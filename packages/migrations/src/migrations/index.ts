import { upgrade as upgrade1 } from "./0.12.0.js";
import cmp from "semver-compare";
import { UpgradeFunction } from "./types.js";

export const lookup: Record<string, UpgradeFunction> = {
  "0.12.0": upgrade1,
};

export const sortedUpgrades = Object.entries(lookup).sort((a, b) =>
  cmp(a[0], b[0])
);
