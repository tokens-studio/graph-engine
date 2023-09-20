/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  Box,
  Button,
  DropdownMenu,
  IconButton,
  Label,
  Stack,
  TextInput,
} from '@tokens-studio/ui';
import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import { Handle, HandleContainer, HandleText } from '../../handles.tsx';

import { TokenTypes } from '@tokens-studio/types';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/set/remap.js';
import { sortEntriesNumerically } from '@tokens-studio/graph-engine';

const SET_ID = 'as Set';

const sortedTypes = Object.entries(TokenTypes).sort((a, b) => {
  if (a[0] > b[0]) {
    return 1;
  }
  return -1;
});

const RemapNode = () => {
  const { input, state, setState, disconnectInput } = useNode();

  const ref = useRef(input?.input?.length || 0);
  useEffect(() => {
    ref.current += 1;
    //We don't care about the values, just the length
  }, [input.input?.length || 0]);

  const handles = useMemo(() => {
    const onChangeType = (ev) => {
      const key = ev.target.dataset.key;
      const value = ev.target.dataset.value;

      setState((state) => {
        return {
          ...state,
          lookup: {
            ...state.lookup,
            [key]: {
              ...state.lookup[key],
              type: value,
            },
          },
        };
      });
    };

    const onNameChange = (ev) => {
      const key = ev.target.dataset.key;
      const value = ev.target.value;

      setState((state) => {
        return {
          ...state,
          lookup: {
            ...state.lookup,
            [key]: {
              ...state.lookup[key],
              name: value,
            },
          },
        };
      });
    };

    const onDelete = (ev) => {
      const key = ev.currentTarget.dataset.key;
      disconnectInput(key);
      setState((state) => {
        const { [key]: val, ...rest } = state.lookup;
        return {
          ...state,
          lookup: {
            ...rest,
          },
        };
      });
    };

    return sortEntriesNumerically(Object.entries(state.lookup)).map(
      ([key, value]) => {
        return (
          <Stack direction="row" css={{ width: '100%' }} key={key}>
            <HandleContainer type="target">
              <Stack direction="row">
                <Handle id={key} />
                <Box
                  css={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    alignItems: 'center',
                    gap: '$2',
                    overflow: 'hidden',
                    width: '100%',
                  }}
                >
                  <TextInput
                    data-key={key}
                    onChange={onNameChange}
                    value={value.name}
                  />
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <Button variant="secondary" asDropdown size="small">
                        {value.type}
                      </Button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      {/* @ts-ignore */}
                      <DropdownMenu.Content css={{ maxHeight: '$10' }}>
                        {sortedTypes.map(([_, type]) => {
                          return (
                            <DropdownMenu.Item
                              key={key}
                              data-key={key}
                              data-value={type}
                              onClick={onChangeType}
                            >
                              {type}
                            </DropdownMenu.Item>
                          );
                        })}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu>
                  <IconButton
                    data-key={key}
                    onClick={onDelete}
                    icon={<Cross1Icon />}
                    variant="invisible"
                    size="small"
                  />
                </Box>
              </Stack>
            </HandleContainer>
            <HandleContainer type="source">
              <Handle id={key}></Handle>
            </HandleContainer>
          </Stack>
        );
      },
    );
  }, [disconnectInput, setState, state.lookup]);

  const onClick = useCallback(() => {
    const key = ref.current;
    setState((state) => {
      return {
        ...state,
        lookup: {
          ...state.lookup,
          [key]: {},
        },
      };
    });
    ref.current += 1;
  }, []);

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" gap={2} align="center">
        <HandleContainer type="target">
          <Stack direction="row" justify="between" align="center" gap={3}>
            <Button icon={<PlusIcon />} onClick={onClick}>
              New
            </Button>
          </Stack>
        </HandleContainer>
        <HandleContainer type="source">
          <Handle id={SET_ID}>
            <HandleText>Set</HandleText>
          </Handle>
        </HandleContainer>
      </Stack>
      {handles}
    </Stack>
  );
};

export default WrapNode(RemapNode, {
  ...node,
  title: 'Remap',
});
