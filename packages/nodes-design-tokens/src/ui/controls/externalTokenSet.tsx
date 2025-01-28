import { EditorExternalSet, IField } from '@tokens-studio/graph-editor';
import { Input } from '@tokens-studio/graph-engine';
import { Select } from '@tokens-studio/ui';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

export const ExternalTokenSetField = observer(({ port, readOnly }: IField) => {
	const [tokenSets, setTokenSets] = useState([]);

	useEffect(() => {
		port.node.load('', {listSets: true}).then(sets => setTokenSets(sets));
	}, []);
	
	const onChange = (value: string) => {
		if (!readOnly) {
			(port as Input).setValue(value);
		}
	};

	return (
		<Select value={port.value || ''} onValueChange={onChange}>
			<Select.Trigger value={port.value || ''} />
			<Select.Content>
				{tokenSets?.map((set: EditorExternalSet) => (
					<Select.Item key={set.name} value={set.name}>
						{set.name}
					</Select.Item>
				))}
			</Select.Content>
		</Select>
	);
});
