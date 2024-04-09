import React, { useCallback, useMemo } from 'react';
import {
  IconButton,
  Stack,
  Label,
  Tooltip,
  DropdownMenu,
} from '@tokens-studio/ui';

import { EyeIcon, UndoIcon } from '@iconicicons/react';
import { useSelector } from 'react-redux';
import { observer } from 'mobx-react-lite';
import { Input, NodeTypes } from '@tokens-studio/graph-engine';
import { Port as GraphPort } from '@tokens-studio/graph-engine';
import {
  Cross1Icon,
  DotsVerticalIcon,
  EyeClosedIcon,
  GearIcon,
  IdCardIcon,
} from '@radix-ui/react-icons';
import { InlineTypeLabel } from '@/components/flow';
import { useGraph } from '@/hooks/useGraph';
import { controls } from '@/redux/selectors/registry';
import { IField } from '@/components/controls/interface';
import copy from 'copy-to-clipboard';
import { deletable, resetable } from '@/annotations';

export interface IPortPanel {
  ports: Record<string, GraphPort>;
  readOnly?: boolean;
}

export const PortPanel = observer(({ ports, readOnly }: IPortPanel) => {
  const entries = Object.values(ports).sort();

  return (
    <Stack direction="column" gap={3} width="full">
      {entries.map((x) => (
        <Port port={x} key={x.name} readOnly={readOnly} />
      ))}
    </Stack>
  );
});

export const Port = observer(({ port, readOnly: isReadOnly }: IField) => {
  const type = port.type;
  const readOnly = isReadOnly || port.isConnected;
  const controlSelector = useSelector(controls);
  const graph = useGraph();
  const isInput = NodeTypes.INPUT === port.node.factory.type;
  const isDynamicInput = Boolean(port.annotations[deletable]);
  const resettable = Boolean(port.annotations[resetable]);
  const inner = useMemo(() => {
    const field = controlSelector.find((x) => x.matcher(type, readOnly));
    const Component = field?.component!;

    return <Component port={port} readOnly={readOnly} />;
  }, [controlSelector, port, readOnly, type]);

  const onClick = useCallback(() => {
    port.setVisible(!port.visible);
  }, [port]);

  const onDelete = useCallback(() => {
    //We need to remove the outgoing edges first

    graph
      .outEdges(port.node.id)
      .filter((x) => x.sourceHandle === port.name)
      .map((x) => graph.removeEdge(x.id));

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

  return (
    <Stack direction="column" gap={3}>
      <Stack direction="row" gap={2} align="center" justify="between">
        <Stack direction="row" gap={2} align="center">
          {!isInput && (
            <IconButton
              size="small"
              onClick={onClick}
              variant={'invisible'}
              icon={port.visible ? <EyeIcon /> : <EyeClosedIcon />}
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
                icon={<DotsVerticalIcon />}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                <DropdownMenu.RadioGroup>
                  {resettable && (
                    <DropdownMenu.Item onClick={onReset}>
                      <DropdownMenu.LeadingVisual>
                        <UndoIcon />
                      </DropdownMenu.LeadingVisual>
                      Reset
                    </DropdownMenu.Item>
                  )}
                  {isDynamicInput && (
                    <DropdownMenu.Item onClick={onDelete}>
                      <DropdownMenu.LeadingVisual>
                        <Cross1Icon />
                      </DropdownMenu.LeadingVisual>
                      Delete
                    </DropdownMenu.Item>
                  )}

                  <DropdownMenu.Item onClick={onCopySchema}>
                    <DropdownMenu.LeadingVisual>
                      <IdCardIcon />
                    </DropdownMenu.LeadingVisual>
                    Copy Schema
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
