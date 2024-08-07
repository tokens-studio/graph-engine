import { IField } from './interface.js';
import { Input } from '@tokens-studio/graph-engine';
import { Label, Stack, TextInput } from '@tokens-studio/ui';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const Vec2field = observer(({ port, readOnly }: IField) => {
  const onChangeX = (e: React.ChangeEvent<HTMLInputElement>) => {
    (port as Input).setValue([e.target.value, port.value[1]]);
  };

  const onChangeY = (e: React.ChangeEvent<HTMLInputElement>) => {
    (port as Input).setValue([port.value[0], e.target.value]);
  };

  return (
    <Stack gap={4} align="center">
      <Label>X</Label>
      <TextInput
        disabled={readOnly}
        width={'100%'}
        value={port.value[0]}
        onChange={onChangeX}
      />
      <Label>Y</Label>
      <TextInput
        disabled={readOnly}
        width={'100%'}
        value={port.value[1]}
        onChange={onChangeY}
      />
    </Stack>
  );
});
