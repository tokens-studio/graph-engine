'use client';
import {
	SaveButton,
	ShareButton,
	createToolbarButtons
} from '@/components/editor/toolbar.tsx';
import { SerializedGraph } from '@tokens-studio/graph-engine';
import { client } from '@/api/sdk/index.ts';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useErrorToast } from '@/hooks/useToast.tsx';
import Editor from '@/components/editor/index.tsx';
import globalState, { RefState } from '@/mobx/index.tsx';

const Page = observer(({ id, refs }: { id: string; refs: RefState }) => {
	const [isLoading, setStillLoading] = useState(true);
	const toolbarButtons = useMemo(() => {
		return createToolbarButtons(
			<>
				<SaveButton id={id} />
				<ShareButton id={id} />
			</>
		);
	}, [id]);

	const ref = useCallback(editor => {
		refs.setEditor(editor);
	}, []);
	const { data, error } = client.graph.getGraph.useQuery(['getGraph', id], {

		params: {
			id: id
		}
	},{
		//Do not allow reloading during development
		staleTime: Infinity
	});
	useErrorToast(error);

	useEffect(() => {
		if (refs.editor && data?.body) {
			refs.editor.loadRaw(data.body.graph as SerializedGraph);
			setStillLoading(false);
		}
	}, [data, refs.editor]);

	return (
		<Editor ref={ref} loading={isLoading} toolbarButtons={toolbarButtons} />
	);
});

export const Wrapper = ({ id }) => <Page id={id} refs={globalState.refs} />;

export default Wrapper;
