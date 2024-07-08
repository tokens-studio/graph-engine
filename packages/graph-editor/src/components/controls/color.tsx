import { Box, IconButton, Stack, Text } from '@tokens-studio/ui';
import { ColorPickerPopover } from '../colorPicker/index.js';
import { FloppyDisk } from 'iconoir-react';
import { IField } from './interface.js';
import { Input, toColor, toColorObject, toHex } from '@tokens-studio/graph-engine';
import { delayedUpdateSelector } from '@/redux/selectors/index.js';
import { observer } from 'mobx-react-lite';
import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';

export const ColorField = observer(({ port, readOnly }: IField) => {
  const useDelayed = useSelector(delayedUpdateSelector);
  const [val, setVal] = React.useState('');

  React.useEffect(() => {
    //Convert to hex
    try {
      const hex = toHex(toColor(port.value));
      setVal(hex);
    } catch {
      //Ignore
    }
  }, [port.value]);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let col;
      console.log(e);
      
      (port as Input).setValue(col);
    },
    [port, useDelayed],
  );

  if (readOnly) {
    const hex = toHex(toColor(port.value));

    return (
      <Stack direction="row" justify="between" align="center">
        <Box
          as="button"
          css={{
            all: 'unset',
            backgroundColor: hex,
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
        <Text>{hex}</Text>
      </Stack>
    );
  }

  return (
    <Stack direction="row" justify="between" align="center" gap={2}>
      <ColorPickerPopover value={port.value} onChange={onChange} />
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
