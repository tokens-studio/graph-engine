import { Handle, HandleContainer, PreviewColor, PreviewBoolean, PreviewAny, PreviewNumber, PreviewArray, WrapNode, useNode } from '@tokens-studio/graph-editor'
import { Button, Checkbox, DropdownMenu, Label, Stack, Text, TextInput } from '@tokens-studio/ui';

import { node } from './polineNode.ts';
import React, { useCallback, useMemo } from 'react';
import { positionFunctions } from 'poline';

const PolineNode = () => {
  const { input, state, output, setState } = useNode();
  const outputHandles = useMemo(() => {
    const values = output || {};

    const { array, ...rest } = values;

    const handles = Object.entries(rest)
      .sort(([a], [b]) => {
        //Force numeric sorting
        return ~~a < ~~b ? -1 : 1;
      })
      .map(([key, value]) => {
        return (
          <Handle id={key} key={key}>
            <Text>{key}</Text>
            <PreviewColor value={value} />
          </Handle>
        );
      });

    return (
      <>
        <Handle id="array">
          <Text>As set</Text>
          <PreviewArray value={array} />
        </Handle>
        {handles}
      </>
    );
  }, [output]);

  const setNumPoints = useCallback((ev) => {
    const numPoints = ev.target.value;
    setState((state) => ({
      ...state,
      numPoints: numPoints ? parseInt(numPoints, 10) : "",
    }));
  }, []);

  const setHueShift = useCallback((ev) => {
    const hueShift = ev.target.value;
    setState((state) => ({
      ...state,
      hueShift: hueShift ? parseFloat(hueShift) : "",
    }));
  }, []);

  const setPositionFn = useCallback(axis => ev => {
    const positionFn = ev.currentTarget.dataset.key;
    setState((state) => ({
      ...state,
      ["positionFn" + axis]: positionFn,
    }));
  }, []);

  const setInvertedLightness = useCallback((checked) => {
    setState((state) => ({
      ...state,
      invertedLightness: checked,
    }));
  }, []);

  const setNewAnchorColor = useCallback((ev) => {
    setState(state => ({
      ...state,
      anchorColors: [...state.anchorColors, "#000000"]
    }));
  }, [])

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="anchorColors">
          <Label>Colors</Label>
        </Handle>
        {input.anchorColors ?
          <Stack direction="column" gap={1}>
            {input.anchorColors.map((hexColor, i) => {
              return <Stack direction="row" gap={3}>
                <PreviewColor value={hexColor} />
                <Label>{hexColor}</Label>
              </Stack>
            })}
          </Stack>
          : null
        }
        <Handle id="numPoints">
          <Stack direction="row" justify="between" gap={3} align="center">
            <Label>Number Of Points</Label>
            {input.numPoints !== undefined ? (
              <PreviewNumber value={input.numPoints} />
            ) : (
              <TextInput onChange={setNumPoints} value={state.numPoints ?? ""} />
            )}
          </Stack>
        </Handle>
        <Handle id="hueShift">
          <Stack direction="row" justify="between" gap={3} align="center">
            <Label>Hue Shift</Label>
            {input.hueShift !== undefined ? (
              <PreviewNumber value={input.hueShift} />
            ) : (
              <TextInput onChange={setHueShift} value={state.hueShift ?? ""} />
            )}
          </Stack>
        </Handle>
        <Handle id="invertedLightness">
          <Stack direction="row" justify="between" gap={3} align="center">
            <Label>Inverted Lightness</Label>
            {input.invertedLightness !== undefined ? (
              <PreviewBoolean value={input.invertedLightness} />
            ) : (
              <Checkbox
                id="invertedLightness"
                checked={state.invertedLightness}
                onCheckedChange={setInvertedLightness}
              />
            )
            }
          </Stack>
        </Handle>
        <PositionFunctionInputs {...{ state, input, setPositionFn }} />
      </HandleContainer>
      <HandleContainer type="source">{outputHandles}</HandleContainer>
    </Stack>
  );
};

const PositionFunctionInputs = ({ state, input, setPositionFn }) => {
  return ["X", "Y", "Z"].map(axis => {
    return <Handle id={"positionFn" + axis}>
      <Stack direction="row" justify="between" align="center" gap={3}>
        <Label>Position Function {axis}</Label>

        {input["positionFn" + axis] !== undefined ? (
          <PreviewAny value={input["positionFn" + axis]} />
        ) : (
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" asDropdown size="small">
                {state["positionFn" + axis] ? state["positionFn" + axis] : "sinusoidalPosition"}
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                {Object.keys(positionFunctions).map((key, i) => {
                  return (
                    <DropdownMenu.Item
                      key={key}
                      onClick={setPositionFn(axis)}
                      data-key={key}
                    >
                      {key}
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        )}
      </Stack>
    </Handle>
  })
}

export default WrapNode(PolineNode, {
  ...node,
  title: 'Generate Color Palette (Poline)',
});