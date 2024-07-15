import constant from './constant.js';
import delay from './delay.js';
import input from './input.js';
import note from './note.js';
import objectMerge from './objectMerge.js';
import objectPath from './objectProperty.js';
import objectify from './objectify.js';
import output from './output.js';
import panic from './panic.js';
import passthrough from './passthrough.js';
import subgraph from './subgraph.js';
import time from './time.js';

export const nodes = [
	constant,
	input,
	output,
	objectify,
	passthrough,
	subgraph,
	panic,
	note,
	objectPath,
	objectMerge,
	time,
	delay
];
