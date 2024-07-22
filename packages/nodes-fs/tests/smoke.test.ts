import * as lib from '../src/index.js';
import { describe, expect, test } from 'vitest';

describe('smoke', () => {
	test('nodes exist', () => {
		expect(lib.nodes).toBeTruthy();
	});
});
