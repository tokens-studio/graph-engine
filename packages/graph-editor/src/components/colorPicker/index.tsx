import { Button, TextInput } from '@tokens-studio/ui';
import { HexColorPicker } from 'react-colorful';
import { PopoverClose } from '@radix-ui/react-popover';
import InputPopover from './InputPopover.js';
import React from 'react';
import styles from './index.module.css';

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
  onChange: (value: string) => void;
  showRemoveButton?: boolean;
  onRemove?: () => void;
};

export function ColorPickerPopover({
  value,
  defaultOpen = false,
  onChange,
  showRemoveButton = false,
  onRemove,
}: ColorPickerPopoverProps) {
  return (
    <InputPopover
      defaultOpen={defaultOpen}
      trigger={
        <Button
          as="button"
          style={{ background: value }}
          className={styles.colorPickerTrigger}
          type="button"
        />
      }
    >
      <ColorPicker value={value} onChange={onChange} />
      <TextInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {showRemoveButton && (
        <PopoverClose className={styles.popoverCloseRemoveButton}>
          <Button onClick={onRemove} emphasis="high" appearance="danger">
            Remove color
          </Button>
        </PopoverClose>
      )}
    </InputPopover>
  );
}