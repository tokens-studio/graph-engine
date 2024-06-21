import { FloppyDisk } from 'iconoir-react';
import { IField } from './interface';
import { IconButton, Stack, Text } from '@tokens-studio/ui';
import { Input } from '@tokens-studio/graph-engine';
import { Slider } from '../slider';
import { delayedUpdateSelector } from '@/redux/selectors';
import { observer } from 'mobx-react-lite';
import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';

export const SliderField = observer(({ port, readOnly }: IField) => {
  const min = port.type.minimum || 0;
  const max = port.type.maximum || 1;
  const step = port.type.multipleOf || (max - min) / 100;

  const useDelayed = useSelector(delayedUpdateSelector);
  const [val, setVal] = React.useState(port.value);

  React.useEffect(() => {
    setVal(port.value);
  }, [port.value]);

  const onChange = useCallback(
    (value: number[]) => {
      if (!readOnly) {
        if (!useDelayed) {
          (port as Input).setValue(value[0]);
        } else {
          setVal(value[0]);
        }
      }
    },
    [port, readOnly, useDelayed],
  );

  return (
    <Stack direction="row" gap={2}>
      <Slider
        value={[val]}
        min={min}
        max={max}
        step={step}
        onValueChange={onChange}
      />
      <Text>{val}</Text>
      {useDelayed && (
        <IconButton
          icon={<FloppyDisk />}
          onClick={() => (port as Input).setValue(val)}
        />
      )}
    </Stack>
  );
});
