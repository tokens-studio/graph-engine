import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import {
  DynamicValueText,
  Handle,
  HandleContainer,
  HandleText,
} from '../../handles.tsx';
import { IconButton, Stack, Text, TextInput } from '@tokens-studio/ui';
import { PreviewAny } from '../../preview/any.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/logic/switch.js';
import { useOnEnter } from '#/hooks/onEnter.ts';
import React, { useCallback, useState } from 'react';
import { styled } from '#/lib/stitches/stitches.config.ts';

const StyledRemoveButton = styled(IconButton, {
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  '&:hover': {
    opacity: 1,
  },
});

const StyledHandle = styled(Handle, {
  '&:hover': {
    [`${StyledRemoveButton}`]: {
      opacity: 1,
    },
  },
});

const SwitchNode = () => {
  const { input, state, setState, output, disconnectInput } = useNode();
  const [newValue, setNewValue] = useState('');

  const onAddKey = useCallback(() => {
    setState((state) => ({ ...state, order: [...state.order, newValue] }));
    setNewValue('');
  }, [newValue]);

  const onDelete = useCallback((ev) => {
    const key = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      order: state.order.filter((x) => x !== key),
    }));
    disconnectInput(key);
  }, []);

  const onEnter = useOnEnter(onAddKey);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="condition">
          <HandleText>Condition</HandleText>
          <DynamicValueText>{input?.condition}</DynamicValueText>
        </Handle>
        {state?.order.map((key) => {
          return (
            <StyledHandle id={key} key={key}>
              <HandleText secondary caseSensitive>
                {key}
              </HandleText>

              <PreviewAny value={input[key]} />

              <StyledRemoveButton
                size="small"
                data-key={key}
                onClick={onDelete}
                variant="invisible"
                icon={<Cross1Icon />}
              />
            </StyledHandle>
          );
        })}
        <Stack direction="row" gap={2}>
          <TextInput
            onKeyUp={onEnter}
            placeholder="Some key name"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <IconButton
            onClick={onAddKey}
            disabled={!newValue}
            variant="invisible"
            icon={<PlusIcon />}
          />
        </Stack>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <HandleText>Output</HandleText>
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(SwitchNode, {
  ...node,
  title: 'Switch',
});
