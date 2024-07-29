export const keyOrder = ['theme', 'mode'];
export const defaultValues = {
	theme: 'samurai',
	mode: 'light'
};

export type theme = 'samurai' | 'knight' | 'ninja';
export type mode = 'light' | 'dark' | 'dim';

export type Context = {
	theme: theme;
	mode: mode;
};
