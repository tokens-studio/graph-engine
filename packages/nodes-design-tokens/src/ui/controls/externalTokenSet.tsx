import { Dialog, Select, Stack, Text } from '@tokens-studio/ui';
import { EditorExternalSet, IField } from '@tokens-studio/graph-editor';
import { Input } from '@tokens-studio/graph-engine';
import { observer } from 'mobx-react-lite';
import { useLocalGraph } from '@tokens-studio/graph-editor/hooks/useLocalGraph.js';
import React, { useEffect, useState } from 'react';

export const ExternalTokenSetField = observer(({ port, readOnly }: IField) => {
	const [tokenSets, setTokenSets] = useState<EditorExternalSet[]>([]);
	const editorGraph = useLocalGraph();
	const [previousValue, setPreviousValue] = useState(port.value || '');
	const [showDialog, setShowDialog] = useState(false);
	const [selectedSet, setSelectedSet] = useState<EditorExternalSet | undefined>(undefined);

	useEffect(() => {
		port.node.load('', {listSets: true}).then(sets => {
			setTokenSets(sets);
		});
	}, [editorGraph, port.node]);
	
	const onChange = (value: string) => {
		const _selectedSet = tokenSets.find(set => set.name === value);
		
		if (_selectedSet?.containsThemeContextNode) {
			// revert to previous selection
			if (!readOnly) {
				(port as Input).setValue(previousValue);
			}
			setShowDialog(true);
		} else {
			if (!readOnly) {
				(port as Input).setValue(value);
			}
			setPreviousValue(value);
		}

		setSelectedSet(_selectedSet);
	};

	return (
		<>
			<Dialog open={showDialog} onOpenChange={(open) => setShowDialog(open)}>
				<Dialog.SimplePortal>
					<Dialog.Title>Warning: Theme Context Present</Dialog.Title>
					<Stack direction="column" gap={3}>
						<Text>This set contains a Theme Context node which may affect token resolution.</Text>
						<Text>Please select a different set or remove the Theme Context node from <b>{selectedSet?.name}</b>.</Text>
					</Stack>
				</Dialog.SimplePortal>
			</Dialog>

			<Select value={port.value || ''} onValueChange={onChange}>
				<Select.Trigger value={port.value || ''} />
				<Select.Content>
					{tokenSets?.map((set: EditorExternalSet) => (
						<Select.Item key={set.name} value={set.name}>
							{set.name + (set.containsThemeContextNode ? ' ⚠️' : '')}
						</Select.Item>
					))}
				</Select.Content>
			</Select>
		</>
	);
});
