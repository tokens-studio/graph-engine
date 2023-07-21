import {
  Box,
  Button,
  DropdownMenu,
  Label,
  Stack,
  Text,
} from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import PreviewColor from '../../preview/color.tsx';
import React, { useCallback, useEffect, useRef } from 'react';
//@ts-ignore
import {
  BlendTypes,
  node,
} from '@tokens-studio/graph-engine/nodes/color/advancedBlend.js';
import { LabelNoWrap } from '#/components/label.tsx';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import PreviewNumber from '../../preview/number.tsx';

const BlendNode = () => {
  const { output, state, input, setState } = useNode();

  const ref = useRef(input?.inputs?.length || 0 + 1);
  useEffect(() => {
    ref.current += 1;
    //We don't care about the values, just the length
  }, [input.inputs]);

  const setblendType = useCallback((ev) => {
    const blendType = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      blendType,
    }));
  }, []);

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" gap={4}>
        <HandleContainer type="target">
          {input.inputs.map(({ key, value }, i) => {
            return (
              <Handle id={key} key={key}>
                <Text>Col {i + 1}</Text>
                <PreviewColor value={value} />
              </Handle>
            );
          })}
          <Handle id={'i.' + ref.current}>
            <Stack direction="row" justify="between">
              <Text>
                <i>New</i>
              </Text>
            </Stack>
          </Handle>
          <Stack
            direction="row"
            align="center"
            justify="between"
            gap={3}
            css={{ minWidth: '9em' }}
          >
            <LabelNoWrap size="small">Blend Type</LabelNoWrap>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button
                  variant="secondary"
                  asDropdown
                  size="small"
                  //@ts-ignore
                  css={{ whiteSpace: 'no-wrap' }}
                >
                  {state.blendType}
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content>
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.NORMAL}
                  >
                    Normal
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.DARKEN}
                  >
                    Darken
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.MULTIPLY}
                  >
                    Multiply
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.COLOR_BURN}
                  >
                    Color Burn
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.LIGHTEN}
                  >
                    Lighten
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.SCREEN}
                  >
                    Screen
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.COLOR_DODGE}
                  >
                    Color Dodge
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.OVERLAY}
                  >
                    Overlay
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.SOFT_LIGHT}
                  >
                    Soft Light
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.HARD_LIGHT}
                  >
                    Hard Light
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.DIFFERENCE}
                  >
                    Difference
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={setblendType}
                    data-key={BlendTypes.EXCLUSION}
                  >
                    Exclusion
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
          </Stack>
        </HandleContainer>
        <HandleContainer type="source">
          <Handle id="color">
            <Label>Color</Label>
            <PreviewColor value={output?.color} />
          </Handle>
          <Handle id="r">
            <Label>r</Label>
            <PreviewNumber value={output?.r} />
          </Handle>
          <Handle id="color">
            <Label>g</Label>
            <PreviewNumber value={output?.g} />
          </Handle>
          <Handle id="color">
            <Label>b</Label>
            <PreviewNumber value={output?.b} />
          </Handle>
        </HandleContainer>
      </Stack>
      <Box
        css={{
          height: '8em',
          border: '0.5px solid $borderMuted',
          borderRadius: '$small',
          background: output?.color,
        }}
      ></Box>
    </Stack>
  );
};

export default WrapNode(BlendNode, {
  ...node,
  title: 'Advanced Blend',
});
