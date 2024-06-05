import { UpgradeFunction } from "./types.js";
import cmp from "semver-compare";

export const lookup: Record<string, UpgradeFunction> = {
};

export const sortedUpgrades = Object.entries(lookup).sort((a, b) =>
  cmp(a[0], b[0])
);
