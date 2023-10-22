import { Handle, HandleContainer, HandleText } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { PreviewBoolean } from '../../preview/boolean.tsx';
import { Stack, Text, TextInput, DropdownMenu, Label, Button } from '@tokens-studio/ui';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node, WcagVersion } from '@tokens-studio/graph-engine/nodes/color/contrastingFromSet.js';
import React, { useMemo,useCallback } from 'react';

const ContrastingFromSetNode = () => {
  const { input, output, state, setState } = useNode();

  const setWcag = useCallback(
    (ev) => {
      const version =
        WcagVersion[ev.currentTarget.dataset.key as keyof typeof WcagVersion];
      setState((state) => ({
        ...state,
        wcag: version,
      }));
    },
    [setState],
  );

  const setThreshold = useCallback(
    (ev) => {
      const threshold = ev.target.value;
      setState((state) => ({
        ...state,
        threshold,
      }));
    },
    [setState],
  );

  const entries = useMemo(() => {
    if (!output || typeof output !== 'object' || !output.token) {
      return null;
    }

    return Object.entries(output.token).map(([key, value]) => (
      <Handle id={key} key={key}>
        <HandleText>{key}</HandleText>
        <PreviewAny value={value} />
      </Handle>
    ));
  }, [output]);

  return (
    <Stack direction="row" gap={4}>
      <HandleContainer type="target">
        <Handle id="tokens">
          <HandleText>Tokens</HandleText>
          <PreviewAny value={input.tokens} />
        </Handle>
        <Handle id="background">
          <HandleText>Background</HandleText>
          <Text>{input.background}</Text>
        </Handle>
        <Handle id="threshold">
          <Stack direction="row" justify="between" gap={3} align="center">
            <Label>Threshold</Label>
            {input.threshold !== undefined ? (
              <PreviewAny value={input.threshold} />
            ) : (
              <TextInput onChange={setThreshold} value={state.threshold} />
            )}
          </Stack>
        </Handle>
        <Handle id="wcag">
          <Label>WCAG Version</Label> 

          {input.wcag !== undefined ? (
            <Text>{input.wcag}</Text>
          ) : (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" asDropdown size="small">
                  {state.wcag}
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content>
                  {Object.entries(WcagVersion).map(([key, value]) => (
                    <DropdownMenu.Item
                      key={key}
                      onClick={setWcag}
                      data-key={key}
                    >
                      {value}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu>
          )}
        </Handle>
      </HandleContainer>
      <HandleContainer type="source">
        {entries}
        <Handle id="index">
          <HandleText>Index</HandleText>
          <Text>{output.index}</Text>
        </Handle>
        <Handle id="sufficient">
          <Text>Sufficient</Text>
          <PreviewBoolean value={output.sufficient} />
        </Handle> 
      </HandleContainer>
    </Stack>
  );
};

export default WrapNode(ContrastingFromSetNode, {
  ...node,
  title: 'Contrasting from Set',
});
