import { Accordion, Button, Separator, Stack } from '@tokens-studio/ui';
import { IField } from '@tokens-studio/graph-editor';
import { Token } from './token.js';
import { flatten } from '../../utils/index.js';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';

export const TokenSetField = observer(({ port }: IField) => {
	const downloadTokens = () => {
		const element = document.createElement('a');
		const asObj = port.value;
		const file = new Blob([JSON.stringify(asObj)], {
			type: 'application/json'
		});
		element.href = URL.createObjectURL(file);
		element.download = 'tokens.json';
		document.body.appendChild(element);
		element.click();
	};

	const tokens = useMemo(() => flatten(port.value || {}), []);

	return (
		<Stack gap={4} direction='column' align='center'>
			<Accordion type='multiple' defaultValue={['tokens']}>
				<Accordion.Item value='tokens'>
					<Accordion.Trigger>Tokens</Accordion.Trigger>
					<Separator orientation='horizontal' />
					<Accordion.Content>
						<Stack
							gap={4}
							direction='column'
							align='center'
							style={{ padding: 'var(--component-spacing-md)' }}
						>
							{tokens.map(token => (
								<Token token={token} key={token.name} />
							))}
						</Stack>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>

			<Button onClick={downloadTokens}>Download</Button>
		</Stack>
	);
});
