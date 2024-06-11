import React, { useCallback, useMemo } from 'react';
import {
  IconButton,
  Stack,
  Label,
  Tooltip,
  DropdownMenu,
} from '@tokens-studio/ui';
import { useSelector } from 'react-redux';
import { observer } from 'mobx-react-lite';
import { Input, NodeTypes } from '@tokens-studio/graph-engine';
import { Port as GraphPort } from '@tokens-studio/graph-engine';

import { Xmark, MoreVert, EyeClosed, Settings, Puzzle, Undo, EyeSolid, Download } from 'iconoir-react';
import { InlineTypeLabel } from '@/components/flow';
import { useGraph } from '@/hooks/useGraph';
import { controls } from '@/redux/selectors/registry';
import { IField } from '@/components/controls/interface';
import copy from 'copy-to-clipboard';
import { deletable, resetable, hidden } from '@/annotations';

export interface IPortPanel {
  ports: Record<string, GraphPort>;
  readOnly?: boolean;
}

export const PortPanel = observer(({ ports, readOnly }: IPortPanel) => {
  const entries = Object.values(ports).sort();

  return (
    <Stack direction="column" gap={3} width="full">
      {entries.filter(x=>!x.annotations[hidden]).map((x) => (
        <Port port={x} key={x.name} readOnly={readOnly} />
      ))}
    </Stack>
  );
});

export const Port = observer(({ port, readOnly: isReadOnly }: IField) => {

  const readOnly = isReadOnly || port.isConnected;
  const controlSelector = useSelector(controls);
  const graph = useGraph();
  const isInput = NodeTypes.INPUT === port.node.factory.type;
  const isDynamicInput = Boolean(port.annotations[deletable]);
  const resettable = Boolean(port.annotations[resetable]);

  const inner = useMemo(() => {
    const field = controlSelector.find((x) => x.matcher(port, { readOnly }));
    const Component = field?.component!;

    return <Component port={port} readOnly={readOnly} />;
    //We use an explicit dependency on the type
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlSelector, port, readOnly, port.type]);

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
              variant={'invisible'}
              icon={port.visible ? <EyeSolid /> : <EyeClosed />}
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
                tooltip="Settings"
                // onClick={onReset}
                variant={'invisible'}
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
