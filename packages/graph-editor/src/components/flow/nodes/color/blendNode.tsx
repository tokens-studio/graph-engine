import {
  Box,
  Button,
  DropdownMenu,
  Label,
  Stack,
  Text,
  TextInput,
} from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import PreviewColor from '../../preview/color.tsx';
import React, { useCallback, useState } from 'react';
//@ts-ignore
import { ColorModifierTypes } from '@tokens-studio/types';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/color/blend.js';
import PreviewNumber from '../../preview/number.tsx';

const BlendNode = () => {
  const { output, state, input, setState } = useNode();

  const [valueText, setValueText] = useState(state.value);

  const setModifierType = useCallback((ev) => {
    const modifierType = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      modifierType,
    }));
  }, []);

  const setValue = useCallback((ev) => {
    const raw = ev.currentTarget.value;
    const value = parseFloat(raw);

    if (!isNaN(value)) {
      setState((state) => ({
        ...state,
        value,
      }));
    }
    setValueText(raw);
  }, []);

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" gap={4}>
        <HandleContainer type="target">
          <Handle id="color">
            <Stack direction="row" align="center" justify="between" gap={3}>
              <Label>Color</Label>
              {input.color && <PreviewColor value={input.color} />}
            </Stack>
          </Handle>
          <Handle id="value">
            <Stack direction="row" align="center" justify="between" gap={3}>
              <Label>Value</Label>
              <Text>
                {input.value !== undefined ? (
                  <PreviewNumber value={input.value} />
                ) : (
                  <TextInput
                    pattern="[0-9]*.?[0-9]*"
                    onChange={setValue}
                    value={valueText}
                    placeholder="0.5"
                  />
                )}
              </Text>
            </Stack>
          </Handle>
          <Stack direction="row" align="center" justify="between" gap={3}>
            <Label>Modifier</Label>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" asDropdown size="small">
                  {state.modifierType}
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content>
                  <DropdownMenu.Item
                    onClick={setModifierType}
                    data-key={ColorModifierTypes.LIGHTEN}
                  >
                    Lighten
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={setModifierType}
                    data-key={ColorModifierTypes.DARKEN}
                  >
                    Darken
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={setModifierType}
                    data-key={ColorModifierTypes.ALPHA}
                  >
                    Alpha
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={setModifierType}
                    data-key={ColorModifierTypes.MIX}
                  >
                    Mix
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
          </Stack>
          {state.modifierType === ColorModifierTypes.MIX && (
            <Handle id="mixColor">
              <Stack direction="row" align="center" justify="between" gap={3}>
                <Label>Mix color</Label>
                {input.color && <PreviewColor value={input.mixColor} />}
              </Stack>
            </Handle>
          )}
        </HandleContainer>
        <HandleContainer type="source">
          <Handle id="output">
            <Label>Output</Label>
            <PreviewColor value={output?.output} />
          </Handle>
        </HandleContainer>
      </Stack>
      <Box
        css={{
          height: '8em',
          border: '0.5px solid $borderMuted',
          borderRadius: '$small',
          background: output?.output,
        }}
      ></Box>
    </Stack>
  );
};

export default WrapNode(BlendNode, {
  ...node,
  title: 'Blends',
});
