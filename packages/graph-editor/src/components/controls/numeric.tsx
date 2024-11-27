import { IField } from './interface.js';
import { IconButton, Stack, TextInput } from '@tokens-studio/ui';
import { Input } from '@tokens-studio/graph-engine';
import { delayedUpdateSelector } from '@/redux/selectors/index.js';
import { observer } from 'mobx-react-lite';
import { useSelector } from 'react-redux';
import FloppyDisk from '@tokens-studio/icons/FloppyDisk.js';
import React, { useCallback } from 'react';

export const NumericField = observer(({ port, readOnly }: IField) => {
  const [intermediate, setIntermediate] = React.useState<string | undefined>(
    undefined,
  );
  const [hadErr, setHadErr] = React.useState<boolean>(false);
  const useDelayed = useSelector(delayedUpdateSelector);
  const [val, setVal] = React.useState(port.value);

  React.useEffect(() => {
    setVal(port.value);
  }, [port.value]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!readOnly) {
        const number = Number.parseFloat(e.target.value);
        if (!Number.isNaN(number)) {
          if (!useDelayed) {
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
    [port, readOnly, useDelayed],
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
      {useDelayed && (
        <IconButton
          icon={<FloppyDisk />}
          onClick={() => (port as Input).setValue(val)}
        />
      )}
    </Stack>
  );
});
