import { Dialog, Select, Separator, Stack, Text } from '@tokens-studio/ui';
import { EditorExternalSet, IField } from '@tokens-studio/graph-editor';
import { Input } from '@tokens-studio/graph-engine';
import { observer } from 'mobx-react-lite';
import { useLocalGraph } from '@tokens-studio/graph-editor/hooks/useLocalGraph.js';
import EmptyPage from '@tokens-studio/icons/EmptyPage.js';
import Link from '@tokens-studio/icons/Link.js';
import MathBook from '@tokens-studio/icons/MathBook.js';
import React, { useEffect, useState } from 'react';
import WarningTriangle from '@tokens-studio/icons/WarningTriangle.js';

export const ExternalTokenSetField = observer(({ port, readOnly }: IField) => {
	const [tokenSets, setTokenSets] = useState<EditorExternalSet[]>([]);
	const [prevSelectedSet, setPrevSelectedSet] = useState(port.value || '');
	const [showForbidDialog, setShowForbidDialog] = useState(false);
	const [showWarningDialog, setShowWarningDialog] = useState(false);
	const [showBackLinkDialog, setShowBackLinkDialog] = useState(false);
	const [themeContextWarningSet, setThemeContextWarningSet] = useState('');
	const [selectedSet, setSelectedSet] = useState<EditorExternalSet | undefined>(
		undefined
	);

	const editorGraph = useLocalGraph();
	const graph = port.node.getGraph();
	const graphGeneratorId = graph.annotations['graphGeneratorId'] as string;

	useEffect(() => {
		port.node.load('', { listSets: true }).then(sets => {
			setTokenSets(sets);
		});
	}, [editorGraph, port.node]);

	// show warning dialog if the selected dynamic set now contains a Theme Context node
	// (and didn't before, so it could be selected)
	useEffect(() => {
		if (port.node.annotations['themeContextWarningSet']) {
			setThemeContextWarningSet(
				port.node.annotations['themeContextWarningSet'] as string
			);
			setShowWarningDialog(true);

			if (!readOnly) {
				(port as Input).setValue('');
			}
		}
	}, [port.node.annotations, port, readOnly]);

	const onChange = (value: string) => {
		const _selectedSet = tokenSets.find(set => set.name === value);

		if (_selectedSet?.containsThemeContextNode) {
			setShowForbidDialog(true);
			if (!readOnly) {
				// revert to previous selection
				(port as Input).setValue(prevSelectedSet);
			}
		} else if (
			_selectedSet &&
			_selectedSet.referencedDynamicSets?.split(';').includes(graphGeneratorId)
		) {
			setShowBackLinkDialog(true);
			if (!readOnly) {
				// revert to previous selection
				(port as Input).setValue(prevSelectedSet);
			}
		} else {
			setPrevSelectedSet(value);
			if (!readOnly) {
				(port as Input).setValue(value);
			}
		}

		setSelectedSet(_selectedSet);
	};

	return (
		<>
			<Dialog
				open={showForbidDialog}
				onOpenChange={open => setShowForbidDialog(open)}
			>
				<Dialog.SimplePortal>
					<Dialog.Title>
						You have reached the future of design systems! 😎
					</Dialog.Title>
					<Stack direction='column' gap={3}>
						<Text>
							There are currently technical limitations on the integration
							platforms, but since you are already here, drop us a message!
						</Text>
						<Separator />
						<Text>
							This set <b>{selectedSet?.name}</b> contains a{' '}
							<b>Theme Context</b> node which prevents token resolution. Please
							select a different set or remove the <b>Theme Context</b> node
							from <b>{selectedSet?.name}</b>.
						</Text>
					</Stack>
				</Dialog.SimplePortal>
			</Dialog>

			<Dialog
				open={showWarningDialog}
				onOpenChange={open => setShowWarningDialog(open)}
			>
				<Dialog.SimplePortal>
					<Dialog.Title>Warning</Dialog.Title>
					<Stack direction='column' gap={3}>
						<Text>
							The selected external set <b>{themeContextWarningSet}</b> contains
							a <b>Theme Context</b> node. This is currently not allowed, so the
							set has been deselected. If you need to reference{' '}
							<b>{themeContextWarningSet}</b>, first remove the{' '}
							<b>Theme Context</b> node from it.
						</Text>
					</Stack>
				</Dialog.SimplePortal>
			</Dialog>

			<Dialog
				open={showBackLinkDialog}
				onOpenChange={open => setShowBackLinkDialog(open)}
			>
				<Dialog.SimplePortal>
					<Dialog.Title>Warning</Dialog.Title>
					<Stack direction='column' gap={3}>
						<Text>
							Cannot reference <b>{selectedSet?.name}</b> because it already
							references this graph, which would create a circular reference.
						</Text>
					</Stack>
				</Dialog.SimplePortal>
			</Dialog>

			<Select
				value={port.value || ''}
				onValueChange={(value: string) => {
					const set = tokenSets.find(s => s.name === value);

					if (set) {
						// store the full object in the node's annotations for later use
						port.node.annotations['selectedSetData'] = set;
						onChange(value);
					}
				}}
			>
				<Select.Trigger value={port.value || 'Select token set'} />
				<Select.Content>
					{tokenSets?.map((set: EditorExternalSet) => {
						const nameParts = set.name.split('/');
						const folderParts = nameParts.slice(0, -1);

						return (
							<Select.Item key={set.generatorId} value={set.name}>
								<Stack direction='row' gap={2}>
									{set.type == 'Dynamic' ? <MathBook /> : <EmptyPage />}
									<Stack direction='row'>
										{folderParts.map(part => (
											<Text>
												<b>{part}</b>/
											</Text>
										))}
										<Text>{nameParts.at(-1)}</Text>
										{set.referencedDynamicSets
											?.split(';')
											.includes(graphGeneratorId) ? (
											<Stack direction='row'>
												<Link
													style={{ marginLeft: 'var(--component-spacing-xs)' }}
													color='var(--color-danger-1000)'
												/>
											</Stack>
										) : (
											''
										)}
										{set.containsThemeContextNode === true ? (
											<Stack direction='row'>
												<WarningTriangle
													style={{ marginLeft: 'var(--component-spacing-xs)' }}
													color='var(--color-danger-1000)'
												/>
											</Stack>
										) : (
											''
										)}
									</Stack>
								</Stack>
							</Select.Item>
						);
					})}
				</Select.Content>
			</Select>
		</>
	);
});
