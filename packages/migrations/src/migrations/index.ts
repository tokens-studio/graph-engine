import { UpgradeFunction } from './types.js';
import { compareVersions } from 'compare-versions';
import { removeRedundantInputValues } from './removeRedundantInputValues.js';

export const lookup: Record<string, UpgradeFunction> = {
	'0.9.11': removeRedundantInputValues
};

export const sortedUpgrades = Object.entries(lookup).sort((a, b) =>
	compareVersions(a[0], b[0])
);
