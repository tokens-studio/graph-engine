import bezier from './bezier.js';
import constructFloatCurve from './constructFloatCurve.js';
import deconstructFloatCurve from './deconstructFloatCurve.js';
import flipFloatCurve from './flipFloatCurve.js';
import floatCurve from './floatCurve.js';
import presetBezier from './presetBeziers.js';
import sample from './sample.js';
import sampleFloatCurve from './sampleFloatCurve.js';

export const nodes = [
	bezier,
	floatCurve,
	presetBezier,
	sample,
	deconstructFloatCurve,
	flipFloatCurve,
	constructFloatCurve,
	sampleFloatCurve
];
