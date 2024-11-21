type ScaleConfig = {
	prefix?: string;
	separator?: string;
	shortNames: boolean;
	descriptive: boolean;
};

const MULTIPLIERS = Array.from({ length: 24 }, (_, i) => i + 1);

function generateScale(config: ScaleConfig): string[] {
	const { prefix = '', separator = '', shortNames, descriptive } = config;
	const sizes: { size: string; value: number }[] = [];

	// Define base sizes with corresponding numeric values
	const baseSizes = descriptive
		? [
				{ size: 'x-small', value: -2 },
				{ size: 'small', value: -1 },
				{ size: 'medium', value: 0 },
				{ size: 'large', value: 1 },
				{ size: 'x-large', value: 2 }
			]
		: shortNames
			? [
					{ size: 'xs', value: -2 },
					{ size: 's', value: -1 },
					{ size: 'm', value: 0 },
					{ size: 'l', value: 1 },
					{ size: 'xl', value: 2 }
				]
			: [
					{ size: 'xs', value: -2 },
					{ size: 'sm', value: -1 },
					{ size: 'md', value: 0 },
					{ size: 'lg', value: 1 },
					{ size: 'xl', value: 2 }
				];

	sizes.push(...baseSizes);

	// Function to format extra sizes
	const formatSize = (mult: number, base: string) => {
		if (descriptive) {
			return `${mult}x${separator}${base}`;
		} else {
			return `${mult > 1 ? mult : ''}${base}`;
		}
	};

	// Add extra small sizes
	MULTIPLIERS.slice(1).forEach(mult => {
		const sizeStr = formatSize(
			mult,
			descriptive ? 'small' : shortNames ? 'xs' : 'xs'
		);
		sizes.push({ size: sizeStr, value: -2 - mult });
	});

	// Add extra large sizes
	MULTIPLIERS.slice(1).forEach(mult => {
		const sizeStr = formatSize(mult, descriptive ? 'large' : 'xl');
		sizes.push({ size: sizeStr, value: 2 + mult });
	});

	// Sort sizes by their numeric value
	sizes.sort((a, b) => a.value - b.value);

	// Build the final scale with optional prefix
	const scale = sizes.map(item => `${prefix}${item.size}`);

	return scale;
}

export const SCHEMAS = {
	default: generateScale({ shortNames: false, descriptive: false }),
	short: generateScale({ shortNames: true, descriptive: false }),
	long: generateScale({ shortNames: false, descriptive: true, separator: '-' })
} as const;

export type SchemaType = keyof typeof SCHEMAS;
