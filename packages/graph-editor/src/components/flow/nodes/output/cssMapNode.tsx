import { Box, Button, Label, Stack, Text } from '@tokens-studio/ui';
import { Handle, HandleContainer } from '../../handles.tsx';
import { Command, useCommandState } from 'cmdk';
import { sentenceCase } from 'sentence-case';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { WrapNode, useNode } from '../../wrapper/nodeV2.tsx';
import { node } from '@tokens-studio/graph-engine/nodes/css/map.js';
import cssPropertiesData from 'mdn-data/css/properties.json';

const CssMapNode = (props) => {
  const { input, state, setState } = useNode();
  const [open, setOpen] = useState(false);
  const handles = useMemo(() => {
    return Object.entries(cssPropertiesData)
      .map(([key, value]) => {
        if (input[key] === undefined && state[key] === undefined) return null;

        return (
          <Handle id={key} key={key}>
            <Label>{key}</Label>
            <Text
              css={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '300px',
                whiteSpace: 'nowrap',
              }}
            >
              {input[key] || state[key]}
            </Text>
          </Handle>
        );
      })
      .filter((x) => x !== null);
  }, [state, input]);

  const handleSelectProperty = (e, property) => {
    setState({ ...state, [property]: null });
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleButtonClick = () => {
    setOpen(!open);
  };

  const [cssProperties, setCssProperties] = useState([]);

  useEffect(() => {
    // Transform the MDN data to include property name and syntax
    const properties = Object.entries(cssPropertiesData).map(([key, value]) => {
      return { name: key, syntax: value.syntax };
    });
    setCssProperties(properties);
  }, []);

  return (
    <Stack direction="column" gap={2}>
      <Button onClick={handleButtonClick}>Add CSS properties</Button>

      <Stack direction="row" gap={4} justify="between">
        <HandleContainer type="target" full>
          {handles}
        </HandleContainer>

        <HandleContainer type="source">
          <Handle id="output">
            <Text>Output</Text>
          </Handle>
        </HandleContainer>
      </Stack>

      <Command.Dialog
        filter={(value, search) => {
          console.log(value, search);
          if (value.startsWith(search)) return 1;
          return 0;
        }}
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
          <Command.Input placeholder="Search CSS properties" />
        </Box>
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          {cssProperties
            .sort((a, b) => {
              if (a.name.startsWith('-') && !b.name.startsWith('-')) {
                return 1;
              } else if (!a.name.startsWith('-') && b.name.startsWith('-')) {
                return -1;
              } else {
                return 0;
              }
            })
            .map(({ name, syntax }) => (
              <Command.Item
                key={name}
                value={name}
                onSelect={(e) => handleSelectProperty(e, name)}
              >
                <Stack
                  direction="row"
                  gap={6}
                  align="start"
                  justify="between"
                  css={{ alignItems: 'baseline' }}
                >
                  <Text css={{ flexShrink: 0 }}>{name}:</Text>
                  <Text
                    muted
                    css={{
                      fontFamily: 'monospace',
                      fontSize: '$xsmall',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textWrap: 'nowrap',
                      maxWidth: '260px',
                    }}
                  >
                    {syntax}
                  </Text>
                </Stack>
              </Command.Item>
            ))}
        </Command.List>
      </Command.Dialog>
    </Stack>
  );
};

export default WrapNode(CssMapNode, {
  ...node,
  title: 'Css Map',
});
