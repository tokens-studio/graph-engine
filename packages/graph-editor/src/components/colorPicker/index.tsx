import { HexColorPicker } from 'react-colorful';
import React from 'react';
import { Box, Button, TextInput } from '@tokens-studio/ui';
import InputPopover from './InputPopover';
import { PopoverClose } from '@radix-ui/react-popover';
import { styled } from '@/lib/stitches/index.js';

export function ColorPicker({ value, onChange }) {
  return (
    <HexColorPicker
      color={value}
      onChange={onChange}
      style={{ flexShrink: 0 }}
    />
  );
}

type ColorPickerPopoverProps = {
  value: string;
  defaultOpen?: boolean;
  onChange: (value: any) => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
};

export function ColorPickerPopover({
  value,
  defaultOpen = false,
  onChange,
  showRemoveButton = false,
  onRemove
}: ColorPickerPopoverProps) {
  return (
    <InputPopover
      defaultOpen={defaultOpen}
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
      {showRemoveButton && (
        <PopoverCloseRemoveButton><Button onClick={onRemove} variant="danger">Remove color</Button></PopoverCloseRemoveButton>
      )}
    </InputPopover>
  );
}

const PopoverCloseRemoveButton = styled(PopoverClose, {
  all: 'unset',
  margin: '$3',
});