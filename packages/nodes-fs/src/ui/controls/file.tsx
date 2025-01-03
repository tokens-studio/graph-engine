import { Text } from '@tokens-studio/ui/Text.js';
import { observer } from 'mobx-react-lite';
import React from 'react';
import type { IField } from '@tokens-studio/graph-editor';

export const FileField = observer(({ port }: IField) => {
	return <Text>{port.value ? 'None' : '<File>'}</Text>;
});
