'use client';

import { Editor, Frame, System } from '@tokens-studio/graph-editor';
import { EmptyStateEditor } from '../EmptyStateEditor.tsx';
import { ExamplesPicker } from '../ExamplesPicker.tsx';
import { Graph } from '@tokens-studio/graph-engine';
import {
	capabilities,
	controls,
	icons,
	menu,
	panelItems,
	specifics
} from './data.tsx';
import { loadCompounds } from '@/data/compounds/index.tsx';
import { observer } from 'mobx-react-lite';
import { tabLoader } from './tabLoader.tsx';
import { useGetEditor } from '@/hooks/useGetEditor.ts';
import React, { useCallback, useMemo } from 'react';
import Spinner from '../spinner/index.tsx';
import globalState from '@/mobx/index.tsx';
import initialLayout from '@/data/layout/default.json';
import styles from './styles.module.css';
import type { LayoutBase } from 'rc-dock';
import type { ReactElement } from 'react';

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

		const sys = useMemo(() => {
			const graph = new Graph();
			return new System({
				frames: [
					new Frame({
						graph,
						specifics,
						panelItems,
						nodeLoader: loadCompounds,
						capabilities,
						controls,
						icons,
						toolbarButtons
					})
				],
				tabLoader
			});
		}, []);

		return (
			<div className={styles.container}>
				<Editor
					id={''}
					// @ts-ignore
					system={sys}
					ref={ref}
					showMenu={false}
					menuItems={menu}
					initialLayout={initialLayout as unknown as LayoutBase}
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
