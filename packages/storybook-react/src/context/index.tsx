import React from 'react';
import cx from 'classnames';
export const ContextProvider = React.createContext({});

export const ThemeProvider = ({ children, ...rest }) => {
	const context = React.useContext(ContextProvider);

	const merged = { ...context, ...rest };
	return (
		<ContextProvider.Provider value={merged}>
			{children}
		</ContextProvider.Provider>
	);
};

export type ContextDefaults = Record<string, string>;

export const useStyledClass = (
	baseClass: string,
	keys: string[],
	defaults: ContextDefaults
) => {
	const context = React.useContext(ContextProvider);

	//We expect the context to be a key values object
	//We need to extract values from the context based on the ordering of the keys

	const theme = keys.map(key => context[key] || defaults[key]).join('-');

	const klass = `${baseClass}--${theme}`;

	return cx(baseClass, klass);
};
