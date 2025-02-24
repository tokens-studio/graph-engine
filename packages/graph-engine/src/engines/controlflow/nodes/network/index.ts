import anthropic from './anthropic.js';
import delay from './delay.js';
import fetchJson from './fetchJson.js';
import hold from './hold.js';
import passthrough from './passthrough.js';
import start from './start.js';
import time from './time.js';
import toMessage from './toMessage.js';

export const nodes = [
	anthropic,
	delay,
	fetchJson,
	hold,
	start,
	toMessage,
	passthrough,
	time
];
