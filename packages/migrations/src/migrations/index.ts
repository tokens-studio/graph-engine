import cmp from "semver-compare";
import { UpgradeFunction } from "./types.js";

export const lookup: Record<string, UpgradeFunction> = {
};

export const sortedUpgrades = Object.entries(lookup).sort((a, b) =>
  cmp(a[0], b[0])
);
