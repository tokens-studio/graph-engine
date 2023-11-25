import { Handle, HandleContainer } from '../../handles.tsx';
import { PreviewAny } from '../../preview/any.tsx';
import { Command } from 'cmdk';
import { Box, Stack, Text, Button } from '@tokens-studio/ui'; // Import the Button component
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/css/cssFunction.js';
import React, { useState, useEffect } from 'react';
import cssFunctionsData from 'mdn-data/css/functions.json';

const CSSFunctionNodeUI = () => {
  const { input, output, setState, state } = useNode();
  const [selectedFunction, setSelectedFunction] = useState(
    input.functionName || '',
  );
  const [open, setOpen] = useState(false);

  const handleSelectFunction = (functionName) => {
    setSelectedFunction(functionName);
    setState({ ...state, functionName });
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleButtonClick = () => {
    setOpen(!open);
  };

  const [cssFunctions, setCssFunctions] = useState([]);

  useEffect(() => {
    // Transform the MDN data into a list of function names
    const functionNames = Object.keys(cssFunctionsData);
    setCssFunctions(functionNames);
  }, []);

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
          {cssFunctions.map((func) => (
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
