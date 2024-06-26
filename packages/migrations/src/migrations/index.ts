import { UpgradeFunction } from './types.js';
import { compareVersions } from 'compare-versions';

export const lookup: Record<string, UpgradeFunction> = {};

export const sortedUpgrades = Object.entries(lookup).sort((a, b) =>
	compareVersions(a[0], b[0])
);
