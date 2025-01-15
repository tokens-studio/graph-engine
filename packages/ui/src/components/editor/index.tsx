'use client';

import { DropPanelInner, Editor } from '@tokens-studio/graph-editor';
import { EmptyStateEditor } from '../EmptyStateEditor.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { ExamplesPicker } from '../ExamplesPicker.tsx';
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
import { loadCompounds } from '@/data/compounds/index.tsx';
import { observer } from 'mobx-react-lite';
import { tabLoader } from './tabLoader.tsx';
import { useGetEditor } from '@/hooks/useGetEditor.ts';
import React, { useCallback } from 'react';
import Spinner from '../spinner/index.tsx';
import globalState from '@/mobx/index.tsx';
import initialLayout from '@/data/layout/default.json';
import styles from './styles.module.css';
import type { LayoutBase } from 'rc-dock';
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
			<div className={styles.container}>
				<Editor
					id={''}
					// @ts-ignore
					ref={ref}
					showMenu={false}
					menuItems={menu}
					initialLayout={initialLayout as unknown as LayoutBase}
					panelItems={panelItems}
					nodeTypes={nodeTypes}
					nodeLoader={loadCompounds}
					capabilities={capabilities}
					tabLoader={tabLoader}
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
				{loading && <Spinner />}
			</div>
		);
	},
	{
		forwardRef: true
	}
);

EditorTab.displayName = 'EditorTab';

export default EditorTab;
