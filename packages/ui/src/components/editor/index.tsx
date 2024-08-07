'use client';

import { Box, Spinner } from '@tokens-studio/ui';
import { Editor } from '@tokens-studio/graph-editor';
import { EmptyStateEditor } from '../EmptyStateEditor.tsx';
import { ExamplesPicker } from '../ExamplesPicker.tsx';
import {
	capabilities,
	controls,
	icons,
	menu,
	nodeTypes,
	panelItems,
	specifics
} from './data.ts';
import { observer } from 'mobx-react-lite';
import { useGetEditor } from '@/hooks/useGetEditor.ts';
import React, { ReactElement, useCallback } from 'react';
import globalState from '@/mobx/index.tsx';

export const EditorTab = observer(
	(
		{
			loading,
			toolbarButtons
		}: { loading?: boolean; toolbarButtons?: ReactElement[] },
		ref
	) => {
		const { loadExample } = useGetEditor();
		const onCloseExamplePicker = useCallback(() => {
			globalState.ui.showExamplePicker = false;
		}, []);

		const onOpenExamplePicker = useCallback(() => {
			globalState.ui.showExamplePicker = true;
		}, []);

		return (
			<Box css={{ position: 'relative', width: '100%', height: '100%' }}>
				<Editor
					id={''}
					// @ts-ignore
					ref={ref}
					showMenu={false}
					menuItems={menu}
					panelItems={panelItems}
					nodeTypes={nodeTypes}
					capabilities={capabilities}
					controls={controls}
					specifics={specifics}
					icons={icons}
					toolbarButtons={toolbarButtons}
					emptyContent={
						<EmptyStateEditor onLoadExamples={onOpenExamplePicker} />
					}
				></Editor>
				{
					<ExamplesPicker
						open={globalState.ui.showExamplePicker}
						onClose={onCloseExamplePicker}
						loadExample={loadExample}
					/>
				}
				{loading && (
					<Box
						css={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundColor: '$gray1',
							opacity: 0.5,
							zIndex: 1000,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Spinner />
					</Box>
				)}
			</Box>
		);
	},
	{
		forwardRef: true
	}
);

EditorTab.displayName = 'EditorTab';

export default EditorTab;
