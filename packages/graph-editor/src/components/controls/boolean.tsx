import { Checkbox } from '@tokens-studio/ui';
import { IField } from './interface';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { Input } from '@tokens-studio/graph-engine';

export const BooleanField = observer(({ port, readOnly }: IField) => {
  const onChange = useCallback(
    (checked) => {
      if (!readOnly) {
        (port as Input).setValue(checked);
      }
    },
    [port, readOnly],
  );

  return <Checkbox checked={port.value} onCheckedChange={onChange} />;
});
