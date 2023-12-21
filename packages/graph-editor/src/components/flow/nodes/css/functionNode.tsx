import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { Command } from 'cmdk';
import { Box, Stack, Text, Button } from '@tokens-studio/ui'; // Import the Button component
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/css/cssFunction.js';
import React, { useState } from 'react';
import cssFunctionsData from 'mdn-data/css/functions.json' assert { type: 'json' };

const FUNCTION_NAMES = Object.keys(cssFunctionsData);

const CSSFunctionNodeUI = () => {
  const { input, output, setState, state } = useNode();

  const [open, setOpen] = useState(false);

  const handleSelectFunction = (functionName) => {
    setState({ ...state, functionName });
    setOpen(false);
  };

  const handleButtonClick = () => {
    setOpen(!open);
  };

  return (
    <Stack direction="column" gap={4}>
      <Stack direction="row" gap={4}>
        <HandleContainer type="target">
          <Handle id="functionName">
            <Text>Function</Text>
            <PreviewAny value={input.functionName || state.functionName} />
          </Handle>
          <Handle id="value">
            <Text>Value</Text>
            <PreviewAny value={input.value || state.value} />
          </Handle>
        </HandleContainer>
        <HandleContainer type="source">
          <Handle id="output">
            <Text>Output</Text>
            <PreviewAny value={output?.output} />
          </Handle>
        </HandleContainer>
      </Stack>
      <Button onClick={handleButtonClick}>Select Function</Button>{' '}
      {/* Add the button component and attach the onClick event handler */}
      <Command.Dialog
        open={open}
        label="Select a CSS Function"
        onOpenChange={() => setOpen(!open)}
      >
        <Box
          css={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            marginBottom: '$3',
            padding: '0 $4',
          }}
        >
          <Command.Input placeholder="Search CSS functions…" />
        </Box>
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          {FUNCTION_NAMES.map((func) => (
            <Command.Item
              key={func}
              value={func}
              onSelect={() => handleSelectFunction(func)}
            >
              <Text>{func}</Text>
            </Command.Item>
          ))}
        </Command.List>
      </Command.Dialog>
    </Stack>
  );
};

export default WrapNode(CSSFunctionNodeUI, {
  ...node,
  title: 'Apply CSS Function',
});
