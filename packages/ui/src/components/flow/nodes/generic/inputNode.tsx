import {
  Button,
  Checkbox,
  DropdownMenu,
  IconButton,
  Label,
  Stack,
  Text,
  TextInput,
} from '@tokens-studio/ui';
import {
  CheckIcon,
  Cross1Icon,
  DotsVerticalIcon,
  MixerHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Dialog } from '#/components/dialog/index.tsx';
import { Handle, HandleContainer } from '../../handles.tsx';
import { NodeTypes } from '@tokens-studio/graph-engine';
import {
  TypeDefinition,
  node,
} from '@tokens-studio/graph-engine/nodes/generic/input.js';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { useOnEnter } from '#/hooks/onEnter.ts';
import React, { useCallback, useMemo, useState } from 'react';
import icons from '../../icons.tsx';

type OptionProps = {
  def: TypeDefinition;
  name: string;
  value: any;
};

const types = ['string', 'number', 'integer', 'boolean'];

const getDefinitionName = (type: string) => {
  switch (type) {
    case 'boolean':
      return 'Boolean';
    case 'integer':
      return 'Integer';
    case 'string':
      return 'String';
    case 'number':
      return 'Number';
    default:
      return 'Unknown';
  }
};

const getValue = (value, def: TypeDefinition) => {
  switch (def.type) {
    case 'boolean':
      return !!value;
    case 'integer':
      return parseInt(value);
    case 'number':
      return parseFloat(value);
    //String
    default:
      return '' + value;
  }
};

const Option = ({ name, value, def }: OptionProps) => {
  const { setState } = useNode();
  const [open, setOpen] = useState(false);
  const [addEnum, setAddEnum] = useState('');

  const onDelete = useCallback(
    (ev) => {
      const key = ev.currentTarget.dataset.key;
      setState((state) => {
        const { [key]: removing, ...restValues } = state.values;
        const { [key]: removingDef, ...restDefinition } = state.definition;
        return {
          ...state,
          values: restValues,
          definition: restDefinition,
        };
      });
    },
    [setState],
  );

  const onStringChange = useCallback(
    (ev) => {
      const key = ev.currentTarget.dataset.key;
      const value = ev.target.value;
      setState((state) => ({
        ...state,
        values: {
          ...state.values,
          [key]: '' + value,
        },
      }));
    },
    [setState],
  );

  const onEnumChange = useCallback(
    (ev) => {
      const key = ev.currentTarget.dataset.key;
      setState((state) => ({
        ...state,
        values: {
          ...state.values,
          [name]: '' + key,
        },
      }));
    },
    [setState],
  );
  const onCheckedChange = useCallback(
    (checked: CheckedState) => {
      setState((state) => ({
        ...state,
        values: {
          ...state.values,
          [name]: !!checked,
        },
      }));
    },
    [name, setState],
  );

  const onSetEnum = useCallback(
    (checked: CheckedState) => {
      setState((state) => ({
        ...state,
        definition: {
          [name]: {
            ...state.definition[name],
            enum: checked ? [] : undefined,
          },
        },
      }));
    },
    [setState],
  );

  const onSetModifier = useCallback(
    (checked: CheckedState) => {
      setState((state) => ({
        ...state,
        definition: {
          ...state.definition,
          [name]: {
            ...state.definition[name],
            modifier: checked ? true : undefined,
          },
        },
      }));
    },
    [setState],
  );

  const createEnum = useCallback(() => {
    //Do not allow empty value
    if (!addEnum) {
      return;
    }
    //Ignore if existing
    if (def.enum?.includes(addEnum)) {
      return;
    }

    setState((state) => ({
      ...state,
      definition: {
        ...state.definition,
        [name]: {
          ...state.definition[name],
          enum: [...state.definition[name].enum, addEnum],
        },
      },
    }));
    setAddEnum('');
  }, [addEnum, name, setState]);

  const setType = useCallback(
    (ev) => {
      const type = ev.currentTarget.dataset.value;
      setState((state) => ({
        ...state,
        values: {
          ...state.values,
          [name]: getValue(value, def),
        },
        definition: {
          ...state.definition,
          [name]: {
            ...state.definition[name],
            type,
          },
        },
      }));
    },
    [def, name, value],
  );

  const onDeleteEnum = useCallback(
    (ev) => {
      const key = ev.currentTarget.dataset.key;
      setState((state) => ({
        ...state,
        definition: {
          ...state.definition,
          [name]: {
            ...state.definition[name],
            enum: state.definition[name].enum.filter((item) => item != key),
          },
        },
      }));
    },
    [name, setState],
  );

  const openModal = () => {
    setOpen(true);
  };

  const onEnter = useOnEnter(createEnum);

  const input = useMemo(() => {
    switch (def.type) {
      case 'boolean':
        return <Checkbox onCheckedChange={onCheckedChange} checked={value} />;
      case 'number':
        return (
          <TextInput
            data-key={name}
            value={value as string}
            onChange={onStringChange}
          />
        );

      case 'string':
      default:
        if (def.enum) {
          return (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button
                  data-key={name}
                  variant="invisible"
                  size="small"
                  css={{ flex: 1 }}
                >
                  {value}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content>
                  {def.enum.map((item) => {
                    return (
                      <DropdownMenu.Item
                        data-key={item}
                        key={item}
                        onClick={onEnumChange}
                      >
                        <Stack direction="row" align="center" gap={1}>
                          <Text>{item}</Text>
                          {def.type == item && <CheckIcon />}
                        </Stack>
                      </DropdownMenu.Item>
                    );
                  })}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
          );
        }

        return (
          <TextInput
            data-key={name}
            value={value as string}
            onChange={onStringChange}
          />
        );
    }
  }, [def, name, onStringChange, value]);

  return (
    <Handle id={name}>
      <Label css={{ whitespace: 'nowrap' }}>{name}</Label>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.SimplePortal>
          <Dialog.Title>Configure</Dialog.Title>
          <Stack direction="column" gap={2}>
            <Label>Type</Label>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button
                  data-key={name}
                  variant="invisible"
                  size="small"
                  // @ts-ignore
                  css={{ padding: '$1' }}
                >
                  {getDefinitionName(def.type)}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content>
                  {types.map((item) => (
                    <DropdownMenu.Item
                      data-value={item}
                      onClick={setType}
                      key={item}
                    >
                      <Stack
                        direction="row"
                        justify="between"
                        gap={4}
                        align="center"
                      >
                        <Text>{getDefinitionName(item)}</Text>
                        {def.type == item && <CheckIcon />}
                      </Stack>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
            {def.type === 'string' && (
              <>
                <Stack direction="row" justify="between">
                  <Label>Is Enum?</Label>
                  <Checkbox onCheckedChange={onSetEnum} checked={!!def.enum}>
                    Enum
                  </Checkbox>
                </Stack>
                {!!def.enum && (
                  <>
                    <Stack direction="row" justify="between">
                      <Label>Is Modifer?</Label>
                      <Checkbox
                        onCheckedChange={onSetModifier}
                        checked={!!def.modifier}
                      >
                        Is Modifier?
                      </Checkbox>
                    </Stack>
                    <Label>Values</Label>
                    {def.enum.map((item) => {
                      return (
                        <Stack direction="row" justify="between" key={item}>
                          <Text>{item}</Text>
                          <IconButton
                            onClick={onDeleteEnum}
                            data-key={item}
                            icon={<TrashIcon />}
                          />
                        </Stack>
                      );
                    })}

                    <Stack direction="row" gap={2}>
                      <TextInput
                        value={addEnum}
                        onKeyUp={onEnter}
                        onChange={(e) => setAddEnum(e.target.value)}
                        placeholder="Input name"
                      />
                      <Button onClick={createEnum} icon={<PlusIcon />}>
                        Create
                      </Button>
                    </Stack>
                  </>
                )}
              </>
            )}
          </Stack>
          <Dialog.CloseButton />
        </Dialog.SimplePortal>
      </Dialog>
      {/* @ts-ignore */}
      {input}
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button
            data-key={name}
            variant="invisible"
            size="small"
            // @ts-ignore
            css={{ padding: '$1' }}
          >
            <DotsVerticalIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item data-key={name} onClick={onDelete}>
              <Stack direction="row" justify="between" gap={4} align="center">
                Delete
                <Cross1Icon />
              </Stack>
            </DropdownMenu.Item>
            <DropdownMenu.Item data-key={name} onClick={openModal}>
              <Stack direction="row" justify="between" gap={4} align="center">
                Configure
                <MixerHorizontalIcon />
              </Stack>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </Handle>
  );
};

const SourceNode = () => {
  const { output, state, setState } = useNode();
  const [addLabel, setAddLabel] = useState('');

  const onClick = useCallback(() => {
    setState((state) => ({
      ...state,
      values: {
        ...state.values,
        [addLabel]: '',
      },
      definition: {
        ...state.values,
        [addLabel]: {
          type: 'string',
        },
      },
    }));
    setAddLabel('');
  }, [addLabel, setState]);

  const onEnter = useOnEnter(onClick);

  const canAdd = useMemo(() => {
    if (addLabel === '') {
      return false;
    }

    if (state.values[addLabel] !== undefined) {
      return false;
    }

    return true;
  }, [addLabel, state?.values]);

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="column" gap={2}>
        <HandleContainer type="source" full>
          {Object.entries(output || {}).map(([key, value]) => (
            <Option
              name={key}
              key={key}
              value={value}
              def={state.definition[key]}
            />
          ))}
        </HandleContainer>
      </Stack>
      <Stack direction="row" gap={2}>
        <TextInput
          value={addLabel}
          onKeyUp={onEnter}
          onChange={(e) => setAddLabel(e.target.value)}
          placeholder="Input name"
        />
        <Button disabled={!canAdd} onClick={onClick} icon={<PlusIcon />}>
          Create
        </Button>
      </Stack>
    </Stack>
  );
};

export default WrapNode(SourceNode, {
  ...node,
  title: 'Input',
  icon: icons[NodeTypes.INPUT],
});
