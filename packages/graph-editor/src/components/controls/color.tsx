import { observer } from 'mobx-react-lite';
import { IField } from './interface';
import React, { useCallback } from 'react';
import { Input } from '@tokens-studio/graph-engine';
import { Box, Stack, Text } from '@tokens-studio/ui';
import { ColorPickerPopover } from '../colorPicker';

export const ColorField = observer(({ port, readOnly }: IField) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      //Weird  problem with the color picker if the user decides to use the text input
      if (typeof e === 'string') {
        (port as Input).setValue(e);
      } else {
        (port as Input).setValue(e.target.value);
      }
    },
    [port],
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
            width: 16,
            height: 16,
            outline: '1px solid $borderMuted',
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
      <ColorPickerPopover value={port.value} onChange={onChange} />
      <Text muted>{port.value}</Text>
    </Stack>
  );
});
