import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewArray } from '../../preview/array.tsx';
import {
  Button,
  DropdownMenu,
  Stack,
  Text,
  TextInput,
} from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import {
  node,
  OrderMap,
} from '@tokens-studio/graph-engine/nodes/array/sort.js';
import React, { useCallback } from 'react';
import { LabelNoWrap } from '#/components/label.tsx';
import { sentenceCase } from 'sentence-case';

const keys: string[] = Object.values(OrderMap);

const SortArrayNode = () => {
  const { input, state, output, setState } = useNode();
  const setValue = useCallback((ev) => {
    const value = ev.target.value;
    const key = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      [key]: value,
    }));
  }, []);

  const setDropdownValue = useCallback((ev) => {
    const value = ev.currentTarget.dataset.value;
    const key = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      [key]: value,
    }));
  }, []);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="array">
          <LabelNoWrap>Array</LabelNoWrap>
          <PreviewAny value={input.array} />
        </Handle>
        <Handle id="sortBy">
          <LabelNoWrap>Sort By</LabelNoWrap>

          {input.sortBy !== undefined ? (
            <PreviewAny value={input.sortBy} />
          ) : (
            <TextInput
              onChange={setValue}
              value={state.sortBy}
              data-key="sortBy"
            />
          )}
        </Handle>
        <Stack direction="row" justify="between" align="center" gap={3}>
          <LabelNoWrap>Order</LabelNoWrap>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" asDropdown size="small">
                {sentenceCase(state.order || '')}
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                {keys.map((key, i) => {
                  if (!key) {
                    return <DropdownMenu.Separator key={i} />;
                  }

                  return (
                    <DropdownMenu.Item
                      key={key}
                      onClick={setDropdownValue}
                      data-key="order"
                      data-value={key}
                    >
                      {sentenceCase(key || '')}
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </Stack>
      </HandleContainer>
      <HandleContainer type="source">
        <Handle id="output">
          <LabelNoWrap>Output</LabelNoWrap>
          <PreviewArray value={output?.output} />
        </Handle>
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(SortArrayNode, {
  ...node,
  title: 'Sort array',
});
