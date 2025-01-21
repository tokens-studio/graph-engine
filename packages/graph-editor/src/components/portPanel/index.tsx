import {
  DropdownMenu,
  IconButton,
  Label,
  Stack,
  Tooltip,
} from '@tokens-studio/ui';
import { Port as GraphPort } from '@tokens-studio/graph-engine';
import { IField } from '@/components/controls/interface.js';
import { InlineTypeLabel } from '@/components/flow/index.js';
import { Input } from '@tokens-studio/graph-engine';
import { deletable, hidden, resetable } from '@/annotations/index.js';
import { observer } from 'mobx-react-lite';
import { useGraph } from '@/hooks/useGraph.js';
import { useSystem } from '@/system/hook.js';
import Download from '@tokens-studio/icons/Download.js';
import Eye from '@tokens-studio/icons/Eye.js';
import EyeClosed from '@tokens-studio/icons/EyeClosed.js';
import MoreVert from '@tokens-studio/icons/MoreVert.js';
import Puzzle from '@tokens-studio/icons/Puzzle.js';
import React, { useCallback, useMemo } from 'react';
import Undo from '@tokens-studio/icons/Undo.js';
import Xmark from '@tokens-studio/icons/Xmark.js';
import copy from 'copy-to-clipboard';

export interface IPortPanel {
  ports: Record<string, GraphPort>;
  readOnly?: boolean;
}

export interface IPort {
  port: GraphPort;
  readOnly?: boolean;
}

export const PortPanel = observer(({ ports, readOnly }: IPortPanel) => {
  const entries = Object.values(ports).sort();

  return (
    <Stack direction="column" gap={3} width="full">
      {entries
        .filter((x) => !x.annotations[hidden])
        .map((x) => (
          <Port port={x} key={x.name} readOnly={readOnly} />
        ))}
    </Stack>
  );
});

export const Port = observer(({ port, readOnly: isReadOnly }: IPort) => {
  const readOnly = isReadOnly || port.isConnected;
  const sys = useSystem();
  const graph = useGraph();
  const isInput = 'studio.tokens.generic.input' === port.node.factory.type;
  const isDynamicInput = Boolean(port.annotations[deletable]);
  const resettable = Boolean(port.annotations[resetable]);

  const inner = useMemo(() => {
    const field = sys.controls.find((x) => x.matcher(port, { readOnly }));
    const Component = field?.component as React.FC<IField>;

    return (
      <Component port={port} readOnly={readOnly} settings={sys.settings} />
    );
    //We use an explicit dependency on the type
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sys.controls, port, readOnly, port.type]);

  const onClick = useCallback(() => {
    port.setVisible(!port.visible);
  }, [port]);

  const onDelete = useCallback(() => {
    //We need to remove the outgoing edges first
    if (graph) {
      graph
        .outEdges(port.node.id)
        .filter((x) => x.sourceHandle === port.name)
        .map((x) => graph.removeEdge(x.id));
    }

    port.node.removeInput(port.name);

    //TODO remove in real graph
  }, [graph, port.name, port.node]);

  const onReset = useCallback(() => {
    (port as Input).reset();
    delete port.annotations[resetable];
  }, [port]);

  const onCopySchema = useCallback(() => {
    const type = port.type;

    copy(JSON.stringify(type, null, 4), {
      debug: true,
    });
  }, [port]);

  const onCopyValue = useCallback(() => {
    const value = port.value;

    copy(JSON.stringify(value, null, 4), {
      debug: true,
    });
  }, [port]);

  return (
    <Stack direction="column" gap={3}>
      <Stack direction="row" gap={2} align="center" justify="between">
        <Stack direction="row" gap={2} align="center">
          {!isInput && (
            <IconButton
              size="small"
              onClick={onClick}
              emphasis="low"
              icon={port.visible ? <Eye /> : <EyeClosed />}
            />
          )}
          <Tooltip label={port.type.description || ''}>
            <Label bold>{port.name}</Label>
          </Tooltip>
        </Stack>
        <Stack gap={2} align="center">
          <InlineTypeLabel port={port} />
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton
                size="small"
                // onClick={onReset}
                emphasis="low"
                icon={<MoreVert />}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                <DropdownMenu.RadioGroup>
                  {resettable && (
                    <DropdownMenu.Item onClick={onReset}>
                      <DropdownMenu.LeadingVisual>
                        <Undo />
                      </DropdownMenu.LeadingVisual>
                      Reset
                    </DropdownMenu.Item>
                  )}
                  {isDynamicInput && (
                    <DropdownMenu.Item onClick={onDelete}>
                      <DropdownMenu.LeadingVisual>
                        <Xmark />
                      </DropdownMenu.LeadingVisual>
                      Delete
                    </DropdownMenu.Item>
                  )}

                  <DropdownMenu.Item onClick={onCopySchema}>
                    <DropdownMenu.LeadingVisual>
                      <Puzzle />
                    </DropdownMenu.LeadingVisual>
                    Copy Schema
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={onCopyValue}>
                    <DropdownMenu.LeadingVisual>
                      <Download />
                    </DropdownMenu.LeadingVisual>
                    Copy Value
                  </DropdownMenu.Item>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </Stack>
      </Stack>
      {inner}
    </Stack>
  );
});
