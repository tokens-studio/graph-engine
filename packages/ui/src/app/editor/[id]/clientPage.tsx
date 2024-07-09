'use client';
import {
	SaveButton,
	ShareButton,
	createToolbarButtons
} from '@/components/editor/toolbar.tsx';
import { SerializedGraph } from '@tokens-studio/graph-engine';
import { client } from '@/api/sdk/index.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useErrorToast } from '@/hooks/useToast.tsx';
import Editor from '@/components/editor/index.tsx';
import globalState from '@/mobx/index.tsx';

const Page = ({ id }) => {
	const [isLoading, setStillLoading] = useState(true);
	const editor = globalState.refs.editor.get();

	const toolbarButtons = useMemo(() => {
		return createToolbarButtons([
			<SaveButton id={id} />,
			<ShareButton id={id} />
		]);
	}, [id]);

	const ref = useCallback(editor => {
		globalState.refs.editor.set(editor);
	}, []);
	const { data, error } = client.graph.getGraph.useQuery(['getGraph', id], {
		params: {
			id: id
		}
	});
	useErrorToast(error);

	useEffect(() => {
		if (editor && data?.body) {
			editor.loadRaw(data.body.graph as SerializedGraph);
			setStillLoading(false);
		}
	}, [data, editor]);

	return (
		<Editor ref={ref} loading={isLoading} toolbarButtons={toolbarButtons} />
	);
};

export default Page;
