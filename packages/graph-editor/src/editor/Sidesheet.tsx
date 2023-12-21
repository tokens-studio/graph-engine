import React, { useCallback, useMemo } from 'react';
import {
  Box,
  IconButton,
  Stack,
  Heading,
  Text,
  Tabs,
  Accordion,
  Label,
  TextInput,
  Select,
} from '@tokens-studio/ui';
import * as Portal from '@radix-ui/react-portal';
import { CloseIcon, EyeIcon, HelpCircleIcon } from '@iconicicons/react';
import { currentNode } from '@/redux/selectors/graph';
import { useDispatch, useSelector } from 'react-redux';
import { observer } from 'mobx-react-lite';
import type { Graph, Input, Node } from '@tokens-studio/graph-engine';
import {
  STRING,
  NUMBER,
  COLOR,
  NodeTypes,
  ANY,
} from '@tokens-studio/graph-engine';
import { ColorPicker, ColorPickerPopover } from '@/components/ColorPicker';
import { EyeClosedIcon } from '@radix-ui/react-icons';

export interface ISideSheet {
  graph: Graph;
}

const InputNodeSpecifics = observer(({ node }: { node: Node }) => {
  return <Box>Add inputs</Box>;
});

const specifics = {
  [NodeTypes.INPUT]: InputNodeSpecifics,
};

export function Sidesheet({ graph }: ISideSheet) {
  const nodeID = useSelector(currentNode);
  const selectedNode = useMemo(() => graph.getNode(nodeID), [graph, nodeID]);
  const Specific = useMemo(() => {
    if (!selectedNode) {
      return null;
    }
    return specifics[selectedNode?.factory?.type];
  }, [selectedNode]);

  const dispatch = useDispatch();

  if (!selectedNode) {
    return <></>;
  }

  return (
    <Portal.Root>
      <Box
        css={{
          display: 'flex',
          position: 'absolute',
          right: '$3',
          top: '$3',
          bottom: '$3',
        }}
      >
        <Box
          css={{
            width: '400px',
            backgroundColor: '$bgDefault',
            padding: '$6',
            paddingTop: '$5',
            borderRadius: '$medium',
            boxShadow: '$contextMenu',
            border: '1px solid $borderSubtle',
          }}
        >
          <Stack direction="column" gap={4}>
            <Stack direction="column" gap={3}>
              <Stack gap={2} align="start" justify="between">
                <Heading size="large"> {selectedNode.factory.title}</Heading>
                <IconButton
                  tooltip={selectedNode.factory.description}
                  icon={<HelpCircleIcon />}
                />
              </Stack>
            </Stack>
            <Text size="small" muted>
              {selectedNode?.id}
            </Text>
            <Tabs defaultValue="properties">
              <Tabs.List>
                <Tabs.Trigger value="properties">Properties</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="properties">
                <Box css={{ padding: '$3' }}>
                  {Specific ? <Specific node={selectedNode} /> : null}
                  <Stack direction="column" gap={2}>
                    <InputPanel ports={selectedNode?.inputs} />
                  </Stack>
                </Box>
              </Tabs.Content>
              <Tabs.Content value="settings">
                <Box css={{ padding: '$3' }}>
                  <Stack direction="column" gap={2}>
                    <Text> Tab 2 content</Text>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
                    </Text>
                  </Stack>
                </Box>
              </Tabs.Content>
            </Tabs>
          </Stack>
        </Box>
      </Box>
    </Portal.Root>
  );
}

interface IInputPanel {
  ports: Record<string, Input>;
}

const InputPanel = observer(({ ports }: IInputPanel) => {
  const entries = Object.values(ports).sort();

  return (
    <Stack direction="column" gap={3}>
      {entries.map((x) => (
        <Port port={x} />
      ))}
    </Stack>
  );
});

const Port = observer(({ port }: { port: Input }) => {
  const type = port.type();
  const inner = useMemo(() => {
    switch (type.$id) {
      case ANY:
        return <AnyField port={port} />;
      case COLOR:
        return <ColorField port={port} />;
      case NUMBER:
        return <NumericField port={port} />;
      case STRING:
        if (type.enum) {
          return <EnumeratedTextfield port={port} />;
        }
        return <Textfield port={port} />;

      default:
        return <DefaultShown port={port} />;
    }
  }, [port, type.$id, type.enum]);

  const onClick = useCallback(() => {
    port.setVisible(!port.visible);
  }, [port]);

  return (
    <Box>
      <Stack direction="row" justify="between" align="center" gap={2}>
        <Label>{port.name}</Label>
        <IconButton
          onClick={onClick}
          variant={'invisible'}
          icon={port.visible ? <EyeIcon /> : <EyeClosedIcon />}
        />
      </Stack>
      {inner}
    </Box>
  );
});

const DefaultShown = observer(({ port }: { port: Input }) => {
  return <Box>{port.value}</Box>;
});

const Textfield = observer(({ port }: { port: Input }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    port.setValue(e.target.value);
  };

  return <TextInput value={port.value} onChange={onChange} />;
});

const AnyField = observer(({ port }: { port: Input }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    port.setValue(e.target.value);
  };

  return <TextInput value={port.value} onChange={onChange} />;
});

const NumericField = observer(({ port }: { port: Input }) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const number = Number.parseFloat(e.target.value);
      port.setValue(number);
    },
    [port],
  );

  return <TextInput type="number" value={port.value} onChange={onChange} />;
});

const ColorField = observer(({ port }: { port: Input }) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      port.setValue(e);
    },
    [port],
  );

  return (
    <Stack direction="row" justify="between" align="center" gap={2}>
      <ColorPickerPopover value={port.value} onChange={onChange} />
      <Text muted>{port.value}</Text>
    </Stack>
  );
});

const EnumeratedTextfield = observer(({ port }: { port: Input }) => {
  const onChange = useCallback(
    (value) => {
      port.setValue(value);
    },
    [port],
  );

  return (
    <Select value={port.value} onValueChange={onChange}>
      <Select.Trigger label="Value" value={port.value} />
      <Select.Content>
        {port.type().enum.map((x) => (
          <Select.Item value={x}>{x}</Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
});
