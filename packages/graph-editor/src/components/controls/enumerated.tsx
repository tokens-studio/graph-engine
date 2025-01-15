import { IField } from './interface.js';
import { Input } from '@tokens-studio/graph-engine';
import { Select } from '@tokens-studio/ui/Select.js';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';

export const EnumeratedTextfield = observer(({ port, readOnly }: IField) => {
  const onChange = useCallback(
    (value) => {
      if (!readOnly) {
        (port as Input).setValue(value);
      }
    },
    [port, readOnly],
  );

  return (
    <Select value={port.value || '-'} onValueChange={onChange}>
      <Select.Trigger label="Value" value={port.value || '-'} />
      <Select.Content>
        {port.type.enum.map((x, i) => (
          <Select.Item value={x} key={i}>
            {x}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
});
