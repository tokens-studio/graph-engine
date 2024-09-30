import { IField } from './interface.js';
import { Input } from '@tokens-studio/graph-engine';
import { Label } from '@tokens-studio/ui/Label.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { TextInput } from '@tokens-studio/ui/TextInput.js';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const Vec3field = observer(({ port, readOnly }: IField) => {
  const onChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newArr = [...port.value];
      newArr[index] = e.target.value;

      (port as Input).setValue(newArr);
    };

  return (
    <Stack gap={4} align="center">
      <Label>X</Label>
      <TextInput
        disabled={readOnly}
        width={'100%'}
        value={port.value[0]}
        onChange={onChange(0)}
      />
      <Label>Y</Label>
      <TextInput
        disabled={readOnly}
        width={'100%'}
        value={port.value[1]}
        onChange={onChange(1)}
      />
      <Label>Z</Label>
      <TextInput
        disabled={readOnly}
        width={'100%'}
        value={port.value[2]}
        onChange={onChange(2)}
      />
    </Stack>
  );
});
