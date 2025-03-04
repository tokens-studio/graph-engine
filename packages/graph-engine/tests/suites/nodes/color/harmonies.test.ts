import { Color as ColorType } from '../../../../src/types.js';
import { Graph } from '../../../../src/graph/graph.js';
import { Red, toColor } from '../../../../src/nodes/color/lib/utils.js';
import { describe, expect, test } from 'vitest';
import Node from '../../../../src/nodes/color/harmonies.js';

describe('color/harmonies', () => {
	test('generates triadic harmony with default settings', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		await node.execute();
		const colors = node.outputs.colors.value as ColorType[];

		expect(colors).toHaveLength(3);
		expect(colors[0]).toEqual(Red); // Base color (default red)

		// Convert to HSL to check hue shifts
		const baseHue = 0; // Red is at 0 degrees
		const expectedHues = [
			baseHue,
			(baseHue + 120) % 360,
			(baseHue - 120 + 360) % 360
		];

		colors.forEach((color, index) => {
			const hslColor = toColor(color).to('hsl');
			expect(Math.round(hslColor.coords[0])).toBe(expectedHues[index]);
		});
	});

	test('generates complementary harmony', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.harmonyType.setValue('complementary');
		node.inputs.numberOfColors.setValue(2);

		await node.execute();
		const colors = node.outputs.colors.value as ColorType[];

		expect(colors).toHaveLength(2);

		// Check if second color is complement (180 degrees from base)
		const secondColor = toColor(colors[1]).to('hsl');
		expect(Math.round(secondColor.coords[0])).toBe(180); // Complement of red
	});

	test('generates split-complementary harmony', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.harmonyType.setValue('splitComplementary');
		node.inputs.numberOfColors.setValue(3);

		await node.execute();
		const colors = node.outputs.colors.value as ColorType[];

		expect(colors).toHaveLength(3);

		// Check if colors are at expected angles (150 and -150 from base)
		const expectedHues = [0, 150, 210]; // For red base color
		colors.forEach((color, index) => {
			const hslColor = toColor(color).to('hsl');
			expect(Math.round(hslColor.coords[0])).toBe(expectedHues[index]);
		});
	});

	test('generates tetradic harmony', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.harmonyType.setValue('tetradic');
		node.inputs.numberOfColors.setValue(4);

		await node.execute();
		const colors = node.outputs.colors.value as ColorType[];

		expect(colors).toHaveLength(4);

		// Check if colors are at expected angles (90, 180, 270 from base)
		const expectedHues = [0, 90, 180, 270]; // For red base color
		colors.forEach((color, index) => {
			const hslColor = toColor(color).to('hsl');
			expect(Math.round(hslColor.coords[0])).toBe(expectedHues[index]);
		});
	});

	test('generates analogous harmony', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.harmonyType.setValue('analogous');
		node.inputs.numberOfColors.setValue(3);

		await node.execute();
		const colors = node.outputs.colors.value as ColorType[];

		expect(colors).toHaveLength(3);

		// Check if colors are at expected angles (-30 and +30 from base)
		const expectedHues = [0, 330, 30]; // For red base color
		colors.forEach((color, index) => {
			const hslColor = toColor(color).to('hsl');
			expect(Math.round(hslColor.coords[0])).toBe(expectedHues[index]);
		});
	});

	test('handles custom number of colors by repeating', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.harmonyType.setValue('triadic');
		node.inputs.numberOfColors.setValue(5);

		await node.execute();
		const colors = node.outputs.colors.value as ColorType[];

		expect(colors).toHaveLength(5);
		// Should repeat the pattern: base, +120, -120, base, +120
		const expectedHues = [0, 120, 240, 0, 120];
		colors.forEach((color, index) => {
			const hslColor = toColor(color).to('hsl');
			expect(Math.round(hslColor.coords[0])).toBe(expectedHues[index]);
		});
	});

	test('preserves saturation and lightness', async () => {
		const graph = new Graph();
		const node = new Node({ graph });

		node.inputs.color.setValue({
			space: 'srgb',
			channels: [1, 0, 0],
			alpha: 0.5 // Testing alpha preservation
		});

		await node.execute();
		const colors = node.outputs.colors.value as ColorType[];

		colors.forEach(color => {
			const hslColor = toColor(color).to('hsl');
			// Red in HSL has specific saturation and lightness values
			expect(Math.round(hslColor.coords[1])).toBe(100); // Full saturation (100%)
			expect(Math.round(hslColor.coords[2])).toBe(50); // 50% lightness
			expect(color.alpha).toBe(0.5); // Alpha should be preserved
		});
	});
});
