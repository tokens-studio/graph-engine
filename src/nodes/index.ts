import { NodeDefinition } from '../types.js';
import accessibility from './accessibility/index.js';
import array from './array/index.js';
import color from './color/index.js';
import css from './css/index.js';
import generic from './generic/index.js';
import input from './input/index.js';
import logic from './logic/index.js';
import math from './math/index.js';
import series from './series/index.js';
import sets from './set/index.js';
import string from './string/index.js';
import typing from './typing/index.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nodes: NodeDefinition<any>[] = ([] as NodeDefinition<any, any, any>[]).concat(accessibility, array, color, css, generic, input, logic, math, series, sets, string, typing)