export function setToPrecision(value: number, precision: number) {
	const shift = 10 ** precision;
	return Math.round(value * shift) / shift;
}
