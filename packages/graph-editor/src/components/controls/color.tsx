import { ColorPickerPopover } from '../colorPicker/index.js';
import { IField } from './interface.js';
import { IconButton, Stack, Text } from '@tokens-studio/ui';
import { Input, hexToColor, toColor, toHex } from '@tokens-studio/graph-engine';
import { observer } from 'mobx-react-lite';
import FloppyDisk from '@tokens-studio/icons/FloppyDisk.js';
import React, { useCallback } from 'react';
import styles from './color.module.css';

export const ColorField = observer(({ port, readOnly, settings }: IField) => {
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
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      let col;
      //Weird  problem with the color picker if the user decides to use the text input
      if (typeof e === 'string') {
        col = e;
      } else {
        col = e.target.value;
      }
      setVal(col);
      if (settings.delayedUpdate) {
        return;
      }

      //We need to convert from hex
      (port as Input).setValue(hexToColor(col));
    },
    [port, settings.delayedUpdate],
  );

  if (readOnly) {
    const hex = toHex(toColor(port.value));

    return (
      <Stack direction="row" justify="between" align="center">
        <button
          className={styles.colorButton}
          style={{ backgroundColor: hex }}
          type="button"
        />
        <Text>{hex}</Text>
      </Stack>
    );
  }

  return (
    <Stack direction="row" justify="between" align="center" gap={2}>
      <ColorPickerPopover value={val} onChange={onChange} />
      <Text muted>{val}</Text>
      {settings.delayedUpdate && (
        <IconButton
          icon={<FloppyDisk />}
          onClick={() => (port as Input).setValue(val)}
        />
      )}
    </Stack>
  );
});
