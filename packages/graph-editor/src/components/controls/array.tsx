import {
  ANY,
  AllSchemas,
  COLOR,
  Color,
  Input,
  NUMBER,
  STRING,
  hexToColor,
  toColor,
  toHex,
} from '@tokens-studio/graph-engine';
import {
  Button,
  IconButton,
  Select,
  Stack,
  Text,
  TextInput,
} from '@tokens-studio/ui';
import { ColorPickerPopover } from '../colorPicker/index.js';
import { FloppyDisk, Minus, Plus } from 'iconoir-react';
import { IField } from './interface.js';
import { JSONTree } from 'react-json-tree';
import { delayedUpdateSelector } from '@/redux/selectors/index.js';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';

const inputItemTypes = [STRING, NUMBER, COLOR];
const NEW_ITEM_DEFAULTS = {
  [STRING]: '',
  [NUMBER]: 0,
  [COLOR]: {
    space: 'srgb',
    channels: [1, 1, 1],
  },
};

export const ArrayField = observer(({ port, readOnly }: IField) => {
  const [value, setValue] = React.useState(port.value);
  const [selectItemsType, setSelectItemsType] = React.useState(
    port.type.items.$id,
  );

  const [autofocusIndex, setAutofocusIndex] = React.useState<number | null>(
    null,
  );
  const useDelayed = useSelector(delayedUpdateSelector);

  React.useEffect(() => {
    setValue(port.value);
  }, [port.value]);

  React.useEffect(() => {
    if (autofocusIndex !== null) {
      setAutofocusIndex(null);
    }
  }, [autofocusIndex]);

  const itemsType = port.type.items.$id;

  const getJSONTree = useCallback(() => {
    return (
      <JSONTree
        data={{ items: toJS(value) }}
        hideRoot
        shouldExpandNodeInitially={() => true}
      />
    );
  }, [value]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newValue: any, index: number) => {
      const newValueArray = [...value];
      newValueArray[index] = newValue;

      setValue(newValueArray);

      if (useDelayed) {
        return;
      }

      (port as Input).setValue(newValueArray);
    },
    [port, useDelayed, value],
  );

  const onColorChange = useCallback(
    (newColor: string, index: number) => {
      //We need to convert hex to our format
      onChange(hexToColor(newColor), index);
    },
    [onChange],
  );

  const addItem = useCallback(() => {
    const newValueArray = [...value, NEW_ITEM_DEFAULTS[itemsType]];

    setValue(newValueArray);

    setAutofocusIndex(newValueArray.length - 1);

    if (useDelayed) {
      return;
    }

    (port as Input).setValue(newValueArray);
  }, [itemsType, port, useDelayed, value]);

  const removeItem = useCallback(
    (index: number) => {
      const newValueArray = [...value];
      newValueArray.splice(index, 1);

      setValue(newValueArray);
      setAutofocusIndex(null);

      if (useDelayed) {
        return;
      }

      (port as Input).setValue(newValueArray);
    },
    [port, useDelayed, value],
  );

  const itemList = React.useMemo(() => {
    if (!value) {
      return <Text>{'<Error, no items detected>'}</Text>;
    }

    return value.map((val: unknown, index: number) => {
      let value;
      switch (itemsType) {
        case STRING:
        case NUMBER:
          return (
            <TextInput
              autoFocus={autofocusIndex === index}
              width={'100%'}
              value={val as string}
              onChange={({ target: { value } }) => {
                onChange(itemsType === NUMBER ? +value : value, index);
              }}
              trailingAction={
                <IconButton
                  title="Remove item"
                  size="small"
                  emphasis="low"
                  icon={<Minus />}
                  onClick={() => removeItem(index)}
                />
              }
            />
          );
        case COLOR:
          value = '';
          try {
            value = toHex(toColor(val as Color));
          } catch {
            //Ignore
          }

          return (
            <ColorPickerPopover
              defaultOpen={autofocusIndex === index}
              value={value}
              onChange={(e) => {
                onColorChange(e, index);
              }}
              showRemoveButton
              onRemove={() => removeItem(index)}
            />
          );
        default:
          return getJSONTree();
      }
    });
  }, [
    value,
    itemsType,
    autofocusIndex,
    getJSONTree,
    onChange,
    removeItem,
    onColorChange,
  ]);

  const setType = () => {
    const schema = AllSchemas.find((x) => x.$id === selectItemsType);
    if (!schema) {
      return;
    }

    (port as Input).setValue(value, {
      type: {
        type: 'array',
        items: schema,
      },
    });
  };

  if (itemsType === ANY) {
    return (
      <Stack direction="column" gap={3}>
        <Select value={selectItemsType} onValueChange={setSelectItemsType}>
          <Select.Trigger label="Type" value={selectItemsType} />
          <Select.Content>
            {AllSchemas.map((x, i) => (
              <Select.Item value={x.$id!} key={i}>
                {x.title || x.$id}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
        <Stack direction="row" justify="end">
          <Button emphasis="high" onClick={setType}>
            Set type
          </Button>
        </Stack>
      </Stack>
    );
  }

  if (readOnly || !inputItemTypes.includes(itemsType)) {
    return getJSONTree();
  }

  const flexDirection = itemsType === COLOR ? 'row' : 'column';

  return (
    <>
      <Stack
        direction={flexDirection}
        gap={3}
        align="center"
        wrap
        style={{
          background: 'var(--color-neutral-canvas-minimal-bg)',
          padding: 'var(--component-spacing-md)',
          borderRadius: 'var(--component-radii-md)',
        }}
      >
        {itemList}
        <IconButton
          title="Add item"
          icon={<Plus />}
          size="small"
          onClick={addItem}
        />
      </Stack>
      {useDelayed && (
        <Stack justify="end">
          <IconButton
            icon={<FloppyDisk />}
            onClick={() => (port as Input).setValue(value)}
          />
        </Stack>
      )}
    </>
  );
});
