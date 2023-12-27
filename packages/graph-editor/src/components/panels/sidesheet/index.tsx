import React, { useCallback, useMemo } from 'react';
import {
  Box,
  IconButton,
  Stack,
  Heading,
  Text,
  Tabs,
  Label,
  TextInput,
  Select,
  Tooltip,
  Checkbox,
  Button,
  Textarea,
} from '@tokens-studio/ui';
import { JSONTree } from 'react-json-tree';

import { EyeIcon, HelpCircleIcon } from '@iconicicons/react';
import { currentNode } from '@/redux/selectors/graph';
import { useDispatch, useSelector } from 'react-redux';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { COLOR_ARRAY, Graph, Input, Node } from '@tokens-studio/graph-engine';
import {
  STRING,
  NUMBER,
  COLOR,
  CURVE,
  BOOLEAN,
  Port as GraphPort,
  NodeTypes,
  ANY,
} from '@tokens-studio/graph-engine';
import { ColorPickerPopover } from '@/components/colorPicker';
import { EyeClosedIcon } from '@radix-ui/react-icons';
import { InlineTypeLabel } from '../../flow';
import { CurveEditor } from '@/components/curveEditor';
import { useGraph } from '@/hooks/useGraph';

export interface ISideSheet {
  graph: Graph;
}

const InputNodeSpecifics = observer(({ node }: { node: Node }) => {
  return (
    <Box>
      <Button variant="primary">Add Input</Button>
    </Box>
  );
});

const specifics = {
  [NodeTypes.INPUT]: InputNodeSpecifics,
};

export function Sidesheet() {
  const graph = useGraph();
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
    <Stack
      direction="column"
      gap={4}
      css={{ height: '100%', flex: 1, padding: '$3' }}
    >
      <Stack direction="column" gap={3}>
        <Stack gap={2} align="start" justify="between">
          <Heading size="large"> {selectedNode.factory.title}</Heading>
          <IconButton
            tooltip={selectedNode.factory.description}
            icon={<HelpCircleIcon />}
          />
        </Stack>
      </Stack>

      <Tabs defaultValue="inputs" style={{ flex: 1, overflow: 'hidden' }}>
        <Tabs.List>
          <Tabs.Trigger value="inputs">Inputs</Tabs.Trigger>
          <Tabs.Trigger value="outputs">Outputs</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="inputs" css={{ height: '100%', overflow: 'auto' }}>
          <Box css={{ padding: '$3' }}>
            {Specific ? <Specific node={selectedNode} /> : null}
            <Stack width="full" css={{ paddingTop: '$3', paddingBottom: '$3' }}>
              <PortPanel ports={selectedNode?.inputs} />
            </Stack>
          </Box>
        </Tabs.Content>
        <Tabs.Content
          value="outputs"
          css={{ height: '100%', overflow: 'auto' }}
        >
          <Box css={{ padding: '$3' }}>
            {Specific ? <Specific node={selectedNode} /> : null}
            <Box css={{ paddingTop: '$3', paddingBottom: '$3' }}>
              <PortPanel ports={selectedNode?.outputs} readOnly />
            </Box>
          </Box>
        </Tabs.Content>
        <Tabs.Content
          value="settings"
          css={{ height: '100%', overflow: 'auto' }}
        >
          <Box css={{ padding: '$3' }}>
            <Stack direction="column" gap={2}>
              <Label>Node ID</Label>
              <Text size="xsmall" muted>
                {selectedNode?.id}
              </Text>
              <Label>Node Type</Label>
              <Text size="xsmall" muted>
                {selectedNode?.factory.type}
              </Text>
              <Label>Title</Label>
              <TextInput value={selectedNode?.factory.title || ''} />
              <Label>Description</Label>
              <Textarea value={selectedNode?.factory.description} />
            </Stack>
          </Box>
        </Tabs.Content>
      </Tabs>
    </Stack>
  );
}

interface IPortPanel {
  ports: Record<string, GraphPort>;
  readOnly?: boolean;
}

const PortPanel = observer(({ ports, readOnly }: IPortPanel) => {
  const entries = Object.values(ports).sort();

  return (
    <Stack direction="column" gap={3} width="full">
      {entries.map((x) => (
        <Port port={x} key={x.name} readOnly={readOnly} />
      ))}
    </Stack>
  );
});

const Port = observer(({ port, readOnly: isReadOnly }: IField) => {
  const type = port.type;
  const readOnly = isReadOnly || port.isConnected;
  const inner = useMemo(() => {
    switch (type.$id) {
      case CURVE:
        return <CurveField port={port} readOnly={readOnly} />;
      case BOOLEAN:
        return <BooleanField port={port} readOnly={readOnly} />;
      case ANY:
        return <AnyField port={port} readOnly={readOnly} />;
      case COLOR:
        return <ColorField port={port} readOnly={readOnly} />;
      case COLOR_ARRAY:
        return port.value.map((x) => (
          <ColorField port={port} readOnly={readOnly} />
        ));
      case NUMBER:
        return <NumericField port={port} readOnly={readOnly} />;
      case STRING:
        if (type.enum) {
          return <EnumeratedTextfield port={port} readOnly={readOnly} />;
        }
        return <Textfield port={port} readOnly={readOnly} />;

      default:
        return <DefaultShown readOnly={readOnly} port={port} />;
    }
  }, [port, type.$id, type.enum, readOnly]);

  const onClick = useCallback(() => {
    port.setVisible(!port.visible);
  }, [port]);

  return (
    <Stack direction="column" gap={3}>
      <Stack direction="row" gap={2} align="center" justify="between">
        <Stack direction="row" gap={2} align="center">
          <IconButton
            size="small"
            onClick={onClick}
            variant={'invisible'}
            icon={port.visible ? <EyeIcon /> : <EyeClosedIcon />}
          />
          <Tooltip label={port.type.description || ''}>
            <Label bold>{port.name}</Label>
          </Tooltip>
        </Stack>
        <InlineTypeLabel port={port} />
      </Stack>
      {inner}
    </Stack>
  );
});

const DefaultShown = observer(({ port }: IField) => {
  let value = toJS(port.value);
  if (Array.isArray(value)) {
    value = { items: value };
  }

  return <JSONTree data={value} />;
});

const Textfield = observer(({ port, readOnly }: IField) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    (port as Input).setValue(e.target.value);
  };

  if (readOnly) {
    return <Text>{port.value}</Text>;
  }

  return <TextInput width={'100%'} value={port.value} onChange={onChange} />;
});

const AnyField = observer(({ port, readOnly }: IField) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    (port as Input).setValue(e.target.value);
  };

  if (readOnly) {
    return <Text>{port.value}</Text>;
  }

  return <TextInput width={'100%'} value={port.value} onChange={onChange} />;
});

const CurveField = observer(({ port, readOnly }: IField) => {
  return <CurveEditor />;
});

const NumericField = observer(({ port, readOnly }: IField) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!readOnly) {
        const number = Number.parseFloat(e.target.value);
        (port as Input).setValue(number);
      }
    },
    [port, readOnly],
  );

  return (
    <TextInput
      type="number"
      width={'100%'}
      value={port.value}
      onChange={onChange}
      disabled={readOnly}
    />
  );
});

const ColorField = observer(({ port, readOnly }: IField) => {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      (port as Input).setValue(e);
    },
    [port],
  );

  if (readOnly) {
    return (
      <Stack direction="row" justify="between" align="center">
        <Box
          as="button"
          css={{
            all: 'unset',
            cursor: 'pointer',
            borderRadius: '$small',
            backgroundColor: port.value,
            width: 16,
            height: 16,
            outline: '1px solid $borderMuted',
            flexShrink: 0,
            '&:hover': {
              outline: '1px solid $borderDefault',
            },
          }}
          type="button"
        />
        <Text>{port.value}</Text>
      </Stack>
    );
  }

  return (
    <Stack direction="row" justify="between" align="center" gap={2}>
      <ColorPickerPopover value={port.value} onChange={onChange} />
      <Text muted>{port.value}</Text>
    </Stack>
  );
});

export interface IField {
  port: GraphPort;
  readOnly?: boolean;
}

const BooleanField = observer(({ port, readOnly }: IField) => {
  const onChange = useCallback(
    (checked) => {
      if (!readOnly) {
        (port as Input).setValue(checked);
      }
    },
    [port, readOnly],
  );

  return <Checkbox checked={port.value} onCheckedChange={onChange} />;
});

const EnumeratedTextfield = observer(({ port, readOnly }: IField) => {
  const onChange = useCallback(
    (value) => {
      if (!readOnly) {
        (port as Input).setValue(value);
      }
    },
    [port],
  );

  return (
    <Select value={port.value} onValueChange={onChange}>
      <Select.Trigger label="Value" value={port.value} />
      <Select.Content>
        {port.type.enum.map((x, i) => (
          <Select.Item value={x} key={i}>
            {x}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
});
