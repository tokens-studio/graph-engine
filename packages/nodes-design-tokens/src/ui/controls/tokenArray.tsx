import { Accordion, Button, Separator, Stack } from '@tokens-studio/ui';
import { IField, IResolvedToken, flatTokensRestoreToMap } from '@tokens-studio/graph-editor';
import { Token } from './token.js';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const TokenArrayField = ({ port }: IField) => {
	return <TokenArrayFieldInner value={port.value} />;
};

interface TokenArrayFieldInnerProps {
	value: IResolvedToken[];
}

export const TokenArrayFieldInner = observer(({ value }: TokenArrayFieldInnerProps) => {
	const downloadTokens = () => {
		const element = document.createElement('a');
		const asObj = flatTokensRestoreToMap(value);
		const file = new Blob([JSON.stringify(asObj)], {
			type: 'application/json'
		});
		element.href = URL.createObjectURL(file);
		element.download = 'tokens.json';
		document.body.appendChild(element);
		element.click();
	};

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
							{(value || []).map(token => (
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
