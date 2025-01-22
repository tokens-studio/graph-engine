// New file: packages/nodes-design-tokens/src/ui/controls/externalTokenSet.tsx
import { IField } from '@tokens-studio/graph-editor';
import { Input } from '@tokens-studio/graph-engine';
import { Select } from '@tokens-studio/ui';
import { observer } from 'mobx-react-lite';
import { useExternalData } from '@tokens-studio/graph-editor';
import React from 'react';

export const ExternalTokenSetField = observer(({ port, readOnly }: IField) => {
	const { tokenSets } = useExternalData();

	const onChange = (value: string) => {
		if (!readOnly) {
			(port as Input).setValue(value);
		}
	};

	return (
		<Select value={port.value || ''} onValueChange={onChange}>
			<Select.Trigger />
			<Select.Content>
				{tokenSets?.map(set => (
					<Select.Item key={set.identifier} value={set.identifier}>
						{set.name}
					</Select.Item>
				))}
			</Select.Content>
		</Select>
	);
});
