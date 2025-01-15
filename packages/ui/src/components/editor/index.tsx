'use client';

import { DropPanelInner, Editor } from '@tokens-studio/graph-editor';
import { EmptyStateEditor } from '../EmptyStateEditor.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { ExamplesPicker } from '../ExamplesPicker.tsx';
import { Spinner } from '@tokens-studio/ui/Spinner.js';
import {
	capabilities,
	controls,
	icons,
	menu,
	nodeTypes,
	panelItems,
	previewItems,
	specifics
} from './data.tsx';
import { defaultLayout } from './layout.ts';
import { observer } from 'mobx-react-lite';
import { useGetEditor } from '@/hooks/useGetEditor.ts';
import React, { useCallback } from 'react';
import globalState from '@/mobx/index.tsx';
import type { ReactElement } from 'react';
import type { TabBase, TabData } from 'rc-dock';

const tabLoader = (tab: TabBase): TabData | undefined => {
	const { id } = tab;
	switch (id) {
		case 'previewNodesPanel':
			return {
				group: 'popout',
				id: 'previewNodesPanel',
				title: 'Preview',
				content: (
					<ErrorBoundary fallback={<div />}>
						<DropPanelInner data={previewItems} />
					</ErrorBoundary>
				),
				closable: true
			};
	}
};

export const EditorTab = observer(
	(
		{
			loading,
			toolbarButtons
		}: { loading?: boolean; toolbarButtons?: ReactElement },
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
			<div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
					initialLayout={defaultLayout}
					tabLoader={tabLoader}
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
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundColor: 'var(--color-neutral-canvas-minimal-bg)',
							opacity: 0.5,
							zIndex: 1000,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Spinner />
					</div>
				)}
			</div>
		);
	},
	{
		forwardRef: true
	}
);

EditorTab.displayName = 'EditorTab';

export default EditorTab;
