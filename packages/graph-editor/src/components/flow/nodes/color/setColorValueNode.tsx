import {
    Box,
    Button,
    DropdownMenu,
    Label,
    Stack,
    TextInput,
  } from '@tokens-studio/ui';
  import { Handle, HandleContainer, HandleText } from '../../handles.tsx';
  import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
  import {
    node,
  } from '@tokens-studio/graph-engine/nodes/color/set-color-value.js';
  import PreviewColor from '../../preview/color.tsx';
  import PreviewNumber from '../../preview/number.tsx';
  import React, { useCallback } from 'react';
  import { ColorPickerPopover } from '#/components/ColorPicker.tsx';
  
  const SetColorValueNode = () => {
    const { input, state, setState, output } = useNode();
  
    const handleColorChange = useCallback((color) => {
      setState((state) => ({
        ...state,
        color,
      }));
    }, [setState]);
  
    const setValue = useCallback((ev) => {
      const value = ev.target.value;
      setState((state) => ({
        ...state,
        l: value,
      }));
    }, []);
  
    return (
      <Stack direction="column" gap={2}>
        <Stack direction="row" gap={4}>
          <HandleContainer type="target">
            <Handle id="color">
              <Stack direction="row" justify="between" gap={3} align="center">
                {input.color ? <PreviewColor value={input.color} /> :  <ColorPickerPopover value={state.color} onChange={handleColorChange} />}
                <HandleText>Color</HandleText>
                <Box css={{fontWeight: '$sansRegular', color: '$fgMuted', fontSize: '$xxsmall', fontFamily: '$mono'}}>{state.color}</Box>
              </Stack>
            </Handle>
            <Handle id="l">
              <Stack direction="row" justify="between" align="center" gap={3}>
                <Label>L</Label>
                {input.l !== undefined ? (
                  <PreviewNumber value={input.l} />
                ) : (
                  <TextInput onChange={setValue} value={state.l} data-key="l" />
                )}
              </Stack>
            </Handle>
          </HandleContainer>
          <HandleContainer type="source">
            <Handle id="output">
              <Stack direction="row" justify="between" align="center" gap={3}>
                <Label>Output</Label>
                <PreviewColor value={output?.output} />
              </Stack>
            </Handle>
          </HandleContainer>
        </Stack>
      </Stack>
    );
  };
  
  export default WrapNode(SetColorValueNode, {
    ...node,
    title: 'Set Color Value',
  });