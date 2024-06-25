import { HexColorPicker } from 'react-colorful';
import React from 'react';
import { Box, TextInput } from '@tokens-studio/ui';
import InputPopover from './InputPopover';

export function ColorPicker({ value, onChange }) {
  return (
    <HexColorPicker
      color={value}
      onChange={onChange}
      style={{ flexShrink: 0 }}
    />
  );
}

export function ColorPickerPopover({ value, onChange }) {
  return (
    <InputPopover
      trigger={
        <Box
          as="button"
          style={{ background: value, }}
          css={{

            all: 'unset',
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
      }
    >
      <ColorPicker value={value} onChange={onChange} />
      <TextInput value={value} onChange={onChange} />
    </InputPopover>
  );
}
