import { RootModel } from './root.ts';
import { createModel } from '@rematch/core';

export interface UIState {
	previewCode: string;
	theme: string;
	showExamplePicker: boolean;
	showNodesPanel: boolean;
}

export const uiState = createModel<RootModel>()({
	state: {
		previewCode: '',
		theme: 'dark',
		showExamplePicker: false,
		showNodesPanel: true
	} as UIState,
	reducers: {
		setTheme(state, theme: string) {
			return {
				...state,
				theme
			};
		},

		setPreviewCode(state, previewCode: string) {
			return {
				...state,
				previewCode
			};
		}
	},
	effects: dispatch => ({
		toggleTheme(_, state) {
			dispatch.ui.setTheme(state.ui.theme === 'light' ? 'dark' : 'light');
		}
	})
});
