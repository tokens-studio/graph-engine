import globalState from '@/mobx/index.tsx';
import type { SerializedGraph } from '@tokens-studio/graph-engine';

export function useGetEditor() {
	async function loadExample(file) {
		const editor = globalState.refs.editor;
		if (!editor) {
			return;
		}

		await editor.clear();
		await editor.loadRaw(file as SerializedGraph);
	}

	return { loadExample };
}
