import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { IField } from './interface';
import { TextInput } from '@tokens-studio/ui';
import { Input } from '@tokens-studio/graph-engine';

export const NumericField = observer(({ port, readOnly }: IField) => {
  const [intermediate, setIntermediate] = React.useState<string | undefined>(
    undefined,
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!readOnly) {
        const number = Number.parseFloat(e.target.value);

        if (!Number.isNaN(number)) {
          (port as Input).setValue(number);
          setIntermediate(undefined);
        } else {
          setIntermediate(e.target.value);
        }
      }
    },
    [port, readOnly],
  );

  return (
    <TextInput
      validationStatus={!!intermediate ? 'error' : undefined}
      width={'100%'}
      value={intermediate === undefined ? port.value : intermediate}
      onChange={onChange}
      disabled={readOnly}
    />
  );
});
