import {
  Button,
  DropdownMenu,
  IconButton,
  Label,
  Stack,
  TextInput,
} from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import React, { useCallback, useMemo, useState } from 'react';

import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/input/enumeratedConstant.js';
import { useOnEnter } from '#/hooks/onEnter.ts';

const EnumeratedConstantNode = () => {
  const { output, state, setState } = useNode();
  const [addLabel, setAddLabel] = useState('');

  const onClick = useCallback(() => {
    setState((state) => ({
      ...state,
      keys: [...state.keys, addLabel],
    }));
    setAddLabel('');
  }, [addLabel, setState]);

  const setLabel = useCallback((ev) => {
    setAddLabel(ev.target.value);
  }, []);

  const onDelete = useCallback(
    (ev) => {
      const key = ev.currentTarget.dataset.key;
      setState((state) => ({
        ...state,
        keys: state.keys.filter((x) => x !== key),
      }));
    },
    [setState],
  );

  const onEnter = useOnEnter(onClick);

  const canAdd = useMemo(() => {
    if (addLabel === '') {
      return false;
    }
    if (state.keys.indexOf(addLabel) !== -1) {
      return false;
    }
    return true;
  }, [addLabel, state.keys]);

  const onSelect = useCallback((ev) => {
    const current = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      current,
    }));
  }, []);

  const keyStacks = useMemo(() => {
    return state.keys.map((x) => (
      <Stack direction="row" gap={2} key={x} justify="between">
        <Label>{x}</Label>
        <IconButton
          variant="invisible"
          size="small"
          icon={<Cross1Icon />}
          data-key={x}
          onClick={onDelete}
        />
      </Stack>
    ));
  }, [onDelete, state.keys]);

  return (
    <Stack direction="row" gap={2}>
      <HandleContainer type="target">
        {keyStacks}

        <Stack direction="row" gap={2}>
          <TextInput
            value={addLabel}
            onKeyUp={onEnter}
            onChange={setLabel}
            placeholder="Input name"
          />
          <Button disabled={!canAdd} onClick={onClick} icon={<PlusIcon />}>
            Create
          </Button>
        </Stack>
      </HandleContainer>

      <HandleContainer type="source">
        <Handle id={'output'}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" asDropdown size="small">
                {state.current}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                {state.keys.map((value, i) => (
                  <DropdownMenu.Item
                    onClick={onSelect}
                    data-key={value}
                    key={value}
                  >
                    {value}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(EnumeratedConstantNode, {
  ...node,
  title: 'Enumerated Constant',
});
