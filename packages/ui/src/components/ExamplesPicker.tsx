import { Command } from 'cmdk';
import { IExample } from '../types/IExample.tsx';
import { Stack, Text } from '@tokens-studio/ui';
import { examples } from '../data/examples/examples.tsx';
import React from 'react';
import Search from '@tokens-studio/icons/Search.js';

const ExamplesPicker = ({ open, onClose, loadExample }) => {
	const handleSelectItem = (example: IExample) => {
		loadExample(example.file);
		onClose();
	};

	return (
		<Command.Dialog
			open={open}
			label='Load an example'
			onOpenChange={() => onClose()}
		>
			<div
				style={{
					color: 'var(--color-neutral-canvas-default-fg-default)',
					display: 'flex',
					flexDirection: 'row',
					gap: 1,
					marginBottom: 'var(--component-spacing-md)',
					padding: '0 var(--component-spacing-lg)'
				}}
			>
				<Search />
				<Command.Input placeholder='Find an example to load…' />
			</div>
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>

				{examples.map(example => (
					<Command.Item
						key={example.key}
						value={example.key}
						onSelect={() => handleSelectItem(example)}
						style={{ cursor: 'pointer' }}
					>
						<Stack direction='column' gap={2} align='start'>
							<Text style={{ font: 'var(--typegraphy-body-sm)' }}>
								{example.title}
							</Text>
							<Text
								style={{
									color: 'var(--color-neutral-canvas-default-fg-subtle)',
									font: 'var(--typegraphy-body-sm)'
								}}
							>
								{example.description}
							</Text>
						</Stack>
					</Command.Item>
				))}
			</Command.List>
		</Command.Dialog>
	);
};

export { ExamplesPicker };
