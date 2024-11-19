export function setToPrecision(value: number, precision: number) {
	const shift = 10 ** precision;
	return Math.round(value * shift) / shift;
}

export function getDecimalCount(value: number) {
	return value == 0 ? 0 : Math.max(0, -Math.floor(Math.log10(Math.abs(value))));
}
