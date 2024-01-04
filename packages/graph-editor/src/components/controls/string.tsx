import { observer } from 'mobx-react-lite';
import { IField } from './interface';
import React from 'react';
import { Input } from '@tokens-studio/graph-engine';
import { Text, TextInput } from '@tokens-studio/ui';

export const Textfield = observer(({ port, readOnly }: IField) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    (port as Input).setValue(e.target.value);
  };

  if (readOnly) {
    return <Text>{port.value}</Text>;
  }

  return <TextInput width={'100%'} value={port.value} onChange={onChange} />;
});
