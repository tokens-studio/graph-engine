import { IField } from './interface.js';
import { IconButton, Stack, TextInput } from '@tokens-studio/ui';
import { Input } from '@tokens-studio/graph-engine';
import { observer } from 'mobx-react-lite';

import FloppyDisk from '@tokens-studio/icons/FloppyDisk.js';
import React, { useCallback } from 'react';

export const NumericField = observer(({ port, readOnly, settings }: IField) => {
  const [intermediate, setIntermediate] = React.useState<string | undefined>(
    undefined,
  );
  const [hadErr, setHadErr] = React.useState<boolean>(false);
  const [val, setVal] = React.useState(port.value);

  React.useEffect(() => {
    setVal(port.value);
  }, [port.value]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!readOnly) {
        const number = Number.parseFloat(e.target.value);
        if (!Number.isNaN(number)) {
          if (!settings.delayedUpdate) {
            (port as Input).setValue(number);
          } else {
            setVal(number);
          }
          setHadErr(false);
        } else {
          setHadErr(true);
        }
        setVal(number);
        setIntermediate(e.target.value);
      }
    },
    [readOnly, settings.delayedUpdate, port],
  );

  return (
    <Stack gap={3}>
      <TextInput
        validationStatus={hadErr ? 'error' : undefined}
        width={'100%'}
        value={intermediate === undefined ? val : intermediate}
        onChange={onChange}
        disabled={readOnly}
      />
      {settings.delayedUpdate && (
        <IconButton
          icon={<FloppyDisk />}
          onClick={() => (port as Input).setValue(val)}
        />
      )}
    </Stack>
  );
});
