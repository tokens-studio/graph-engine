import { UpgradeFunction } from './types.js';
import { compareVersions } from 'compare-versions';
import { removePositionAnnotations } from './removePositionAnnotations.js';
import { removeRedundantInputValues } from './removeRedundantInputValues.js';

export const lookup: Record<string, UpgradeFunction> = {
	'0.9.11': removeRedundantInputValues,
	'0.9.12': removePositionAnnotations
};

export const sortedUpgrades = Object.entries(lookup).sort((a, b) =>
	compareVersions(a[0], b[0])
);
