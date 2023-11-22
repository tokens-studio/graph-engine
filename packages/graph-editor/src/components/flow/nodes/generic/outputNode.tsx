import { Button, DropdownMenu, Stack, TextInput } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import React, { useCallback, useMemo, useState } from 'react';

import { Cross1Icon, DotsVerticalIcon, PlusIcon } from '@radix-ui/react-icons';
import { PreviewAny } from '../../preview/any.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/generic/output.js';
import { useOnEnter } from '@/hooks/onEnter.ts';
import { v4 as uuidv4 } from 'uuid';

const OutputNode = () => {
  const { output, state, setState } = useNode();
  const [addLabel, setAddLabel] = useState('');

  const onDelete = useCallback((ev) => {
    const key = ev.target.dataset.key;
    setState((state) => ({
      ...state,
      mappings: state.mappings.filter(({ key: k }) => k !== key),
    }));
  }, []);

  const onChange = useCallback((ev) => {
    const key = ev.target.dataset.key;
    setState((state) => ({
      ...state,
      mappings: state.mappings.map((mapping) => {
        if (mapping.key === key) {
          return {
            ...mapping,
            name: ev.target.value,
          };
        }
        return mapping;
      }),
    }));
  }, []);

  const values = useMemo(() => {
    return state.mappings.map(({ key, name }) => {
      return (
        <Handle id={key} key={key}>
          <TextInput data-key={key} value={name} onChange={onChange} />
          <PreviewAny value={output && output[name]} />
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button
                data-key={key}
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
                <DropdownMenu.Item data-key={key} onClick={onDelete}>
                  <Cross1Icon /> Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </Handle>
      );
    });
  }, [state.mappings, onChange, output, onDelete]);

  const onClick = useCallback(() => {
    setState((state) => ({
      ...state,
      mappings: [
        ...state.mappings,
        {
          key: uuidv4(),
          name: addLabel,
        },
      ],
    }));
    setAddLabel('');
  }, [addLabel, setState]);

  const onEnter = useOnEnter(onClick);

  const canAdd = useMemo(() => {
    if (addLabel === '') {
      return false;
    }
    if (state.mappings.some((x) => x.name == addLabel)) {
      return false;
    }
    return true;
  }, [addLabel, state.mappings]);

  const setLabel = useCallback((ev) => {
    setAddLabel(ev.target.value);
  }, []);

  return (
    <HandleContainer type="target" full>
      {values}
      <Stack direction="row" gap={2} align="center" justify="between">
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
  );
};

export default WrapNode(OutputNode, {
  ...node,
  title: 'Output',
});
