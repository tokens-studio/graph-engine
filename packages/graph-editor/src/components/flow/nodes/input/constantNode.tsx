import {
  Button,
  DropdownMenu,
  Stack,
  Text,
  TextInput,
} from '@tokens-studio/ui';
import { CheckIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { Handle, HandleContainer } from '../../handles.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/input/constant.js';
import React, { useCallback } from 'react';

const getValue = (type, value) => {
  switch (type) {
    case 'number':
      return parseFloat(value);
    //String
    default:
      return '' + value;
  }
};

const ConstantNode = () => {
  const { setState, state } = useNode();

  const onChange = useCallback(
    (e: any) => {
      setState((state) => {
        const val = getValue(state.type, e.target.value);
        return { ...state, input: val };
      });
    },
    [setState],
  );

  const onChangeType = useCallback(
    (ev: any) => {
      const key = ev.currentTarget.dataset.key;
      setState((state) => {
        const input = getValue(key, state.input);
        return { ...state, input, type: key };
      });
    },
    [setState],
  );

  return (
    <HandleContainer type="source">
      <Handle id="output">
        <TextInput value={state.input} onChange={onChange} />
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button
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
              <DropdownMenu.Item data-key={'string'} onClick={onChangeType}>
                <Stack direction="row" align="center" gap={1}>
                  <Text>String</Text>
                  {state.type == 'string' && <CheckIcon />}
                </Stack>
              </DropdownMenu.Item>
              <DropdownMenu.Item data-key={'number'} onClick={onChangeType}>
                <Stack direction="row" align="center" gap={1}>
                  <Text>Number</Text>
                  {state.type == 'number' && <CheckIcon />}
                </Stack>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>
      </Handle>
    </HandleContainer>
  );
};

export default WrapNode(ConstantNode, node);
