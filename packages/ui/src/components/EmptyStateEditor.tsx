import { Button, EmptyState, Stack } from '@tokens-studio/ui';
import { useCallback } from 'react';
import { useDispatch } from '@tokens-studio/graph-editor';
import BatteryCharging from '@tokens-studio/icons/BatteryCharging.js';
import JournalPage from '@tokens-studio/icons/JournalPage.js';
import PagePlus from '@tokens-studio/icons/PagePlus.js';
import React from 'react';
import globalState from '@/mobx/index.tsx';

interface IEmptyStateProps {
	onLoadExamples: () => void;
	showNodesPanel: boolean;
}

export function EmptyStateEditor({ onLoadExamples }) {
	return (
		<EmptyStateInner
			onLoadExamples={onLoadExamples}
			showNodesPanel={globalState.ui.showNodesPanel}
		/>
	);
}

function EmptyStateInner({ onLoadExamples }: IEmptyStateProps) {
	const dispatch = useDispatch();

	const handleTriggerAddNode = useCallback(() => {
		dispatch.ui.setShowNodesCmdPalette(true);
	}, []);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				pointerEvents: 'none',
				width: '100%',
				height: '100%',
				position: 'relative',
				zIndex: 100
			}}
		>
			<EmptyState
				icon={<BatteryCharging style={{ width: 48, height: 48 }} />}
				title='Build scalable and flexible design systems.'
				description='Add your first node to get started or load an example'
			>
				<Stack direction='row' gap={3} style={{ pointerEvents: 'all' }}>
					<Button onClick={onLoadExamples} icon={<PagePlus />}>
						Load example
					</Button>
					<Button
						emphasis='high'
						appearance='accent'
						onClick={handleTriggerAddNode}
						icon={<JournalPage />}
					>
						Add your first node
					</Button>
				</Stack>
			</EmptyState>
		</div>
	);
}
