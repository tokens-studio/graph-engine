import { IField } from './interface.js';
import { Input } from '@tokens-studio/graph-engine';
import { Label } from '@tokens-studio/ui/Label.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { TextInput } from '@tokens-studio/ui/TextInput.js';
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
