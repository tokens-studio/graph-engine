import { node as flatten } from './flatten.js';
import { node as inlineTokens } from './inlineTokens.js';
import { node as invert } from './invert.js';
import { node as remap } from './remap.js';
import { node as resolve } from './resolve.js';

export default [flatten, remap, resolve, inlineTokens, invert];
