import { GlobalState } from '@/mobx/index.tsx';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

const PageLayout = observer(
	({
		theme,
		children
	}: {
		children: React.ReactNode;
		theme: GlobalState['ui']['theme'];
	}) => {
		const theTheme = theme;
		useEffect(() => {
			if (theTheme) {
				document.body.className = theTheme + '-theme';
			}
		}, [theTheme]);
		return (
			<Stack style={{ height: '100%', width: '100%' }}>
				<div></div>
				<div style={{ flex: '1' }}>{children}</div>
			</Stack>
		);
	}
);

export default PageLayout;
