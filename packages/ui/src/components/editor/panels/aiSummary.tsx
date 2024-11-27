import { Button, Scroll, Stack } from '@tokens-studio/ui';
import {
	ImperativeEditorRef,
	mainGraphSelector
} from '@tokens-studio/graph-editor';
import { client } from '@/api/sdk/index.ts';
import { useSelector } from 'react-redux';
import MDEditor from '@uiw/react-md-editor';
import React from 'react';

export const AISummary = () => {
	const mainGraph = useSelector(mainGraphSelector);
	const graphRef = mainGraph?.ref as ImperativeEditorRef | undefined;
	const { data, isPending, mutateAsync } = client.ai.getAISummary.useMutation();
	const onSummarize = () => {
		const raw = graphRef!.save();

		mutateAsync({
			body: {
				graph: raw
			}
		});
	};

	return (
		<div
			style={{
				padding: 'var(--component-spacing-md)',
				height: '100%',
				overflow: 'scroll'
			}}
		>
			<Stack direction='column'>
				<div>
					<Button emphasis='high' onClick={onSummarize} loading={isPending}>
						Summarize
					</Button>
				</div>
				<Scroll style={{ height: '100%' }}>
					{data && (
						<MDEditor.Markdown
							source={data.body.summary.replace(/\\n/g, '\n')}
						/>
					)}
				</Scroll>
			</Stack>
		</div>
	);
};
