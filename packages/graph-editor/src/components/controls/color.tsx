import { Box, IconButton, Stack, Text } from '@tokens-studio/ui';
import { ColorPickerPopover } from '../colorPicker';
import { FloppyDisk } from 'iconoir-react';
import { IField } from './interface';
import { Input } from '@tokens-studio/graph-engine';
import { delayedUpdateSelector } from '@/redux/selectors';
import { observer } from 'mobx-react-lite';
import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';

export const ColorField = observer(({ port, readOnly }: IField) => {
  const useDelayed = useSelector(delayedUpdateSelector);
  const [val, setVal] = React.useState(port.value);

  React.useEffect(() => {
    setVal(port.value);
  }, [port.value]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let col;
      //Weird  problem with the color picker if the user decides to use the text input
      if (typeof e === 'string') {
        col = e;
      } else {
        col = e.target.value;
      }
      setVal(col);
      if (useDelayed) {
        return;
      }
      (port as Input).setValue(col);
    },
    [port, useDelayed],
  );

  if (readOnly) {
    return (
      <Stack direction="row" justify="between" align="center">
        <Box
          as="button"
          css={{
            all: 'unset',
            backgroundColor: port.value,
            cursor: 'pointer',
            borderRadius: '$small',
            width: 26,
            height: 26,
            outline: '1px solid $borderDefault',
            flexShrink: 0,
            '&:hover': {
              outline: '1px solid $borderDefault',
            },
          }}
          type="button"
        />
        <Text>{port.value}</Text>
      </Stack>
    );
  }

  return (
    <Stack direction="row" justify="between" align="center" gap={2}>
      <ColorPickerPopover value={val} onChange={onChange} />
      <Text muted>{val}</Text>
      {useDelayed && (
        <IconButton
          icon={<FloppyDisk />}
          onClick={() => (port as Input).setValue(val)}
        />
      )}
    </Stack>
  );
});
