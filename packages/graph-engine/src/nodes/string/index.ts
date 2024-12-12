import caseConvert from './case.js';
import interpolate from './interpolate.js';
import join from './join.js';
import lowercase from './lowercase.js';
import normalize from './normalize.js';
import pad from './pad.js';
import regex from './regex.js';
import replace from './replace.js';
import split from './split.js';
import stringify from './stringify.js';
import uppercase from './uppercase.js';

export const nodes = [
	interpolate,
	join,
	caseConvert,
	lowercase,
	normalize,
	pad,
	regex,
	replace,
	split,
	stringify,
	uppercase
];
