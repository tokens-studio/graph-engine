import { Checkbox, Label, Select, Stack, Text } from '@tokens-studio/ui';
import { EdgeType, LayoutType } from '@/redux/models/settings.js';
import {
  connectOnClickSelector,
  delayedUpdateSelector,
  edgeType,
  inlineTypes,
  inlineValues,
  layoutType,
  showMinimapSelector,
  showTimings,
} from '@/redux/selectors/settings.js';
import { contextMenuSelector } from '@/redux/selectors/ui.js';
import { useDispatch } from '@/hooks/useDispatch.js';
import { useSelector } from 'react-redux';
import React from 'react';

const EdgeValues = Object.values(EdgeType);
const LayoutValues = Object.values(LayoutType);

export const Settings = () => {
  const edgeTypeValue = useSelector(edgeType);
  const layoutTypeValue = useSelector(layoutType);
  const showTimingsValue = useSelector(showTimings);
  const inlineTypesValue = useSelector(inlineTypes);
  const inlineValuesValue = useSelector(inlineValues);
  const delayedUpdateValue = useSelector(delayedUpdateSelector);
  const connectOnClick = useSelector(connectOnClickSelector);
  const contextMenus = useSelector(contextMenuSelector);
  const showMinimap = useSelector(showMinimapSelector);
  const dispatch = useDispatch();

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        flex: 1,
        display: 'flex',
        overflow: 'auto',
        padding: 'var(--ui-spacing-md)',
        flexDirection: 'column',
      }}
    >
      <Stack direction="column" gap={5}>
        <Stack direction="row" gap={2} justify="start">
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setInlineTypes(Boolean(checked))
            }
            checked={inlineTypesValue}
          />
          <Stack direction="column" gap={1} justify="start">
            <Label>Show inline types</Label>
            <Text size="xsmall" muted>
              Adds additional labels to help differentiate types for colorblind
              users.
            </Text>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} justify="start">
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setInlineValues(Boolean(checked))
            }
            checked={inlineValuesValue}
          />
          <Stack direction="column" gap={1} justify="start">
            <Label>Show inline values</Label>
            <Text size="xsmall" muted>
              Shows values directly on the node. Useful for debugging but can be
              cluttered.
            </Text>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} justify="start">
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setDelayedUpdate(Boolean(checked))
            }
            checked={delayedUpdateValue}
          />
          <Stack direction="column" gap={1} justify="start">
            <Label>Use delayed interaction</Label>
            <Text size="xsmall" muted>
              Forces a user to click save to update port.
            </Text>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} justify="start">
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setConnectOnClick(Boolean(checked))
            }
            checked={connectOnClick}
          />
          <Stack direction="column" gap={1} justify="start">
            <Label>Click to connect</Label>
            <Text size="xsmall" muted>
              Allows you to quick connect nodes by clicking on the 2 port.
            </Text>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} justify="start">
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setShowTimings(Boolean(checked))
            }
            checked={showTimingsValue}
          />
          <Stack direction="column" gap={1} justify="start">
            <Label>Show execution time</Label>
            <Text size="xsmall" muted>
              Shows how long it takes for a node to process.
            </Text>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} justify="start">
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setShowMinimap(Boolean(checked))
            }
            checked={showMinimap}
          />
          <Stack direction="column" gap={1} justify="start">
            <Label>Show Minimap</Label>
            <Text size="xsmall" muted>
              Shows the minimap in the graph editing area
            </Text>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} justify="start">
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.ui.setContextMenus(Boolean(checked))
            }
            checked={contextMenus}
          />
          <Stack direction="column" gap={1} justify="start">
            <Label>Enable Context Menus</Label>
            <Text size="xsmall" muted>
              Provides right click context menus.
            </Text>
          </Stack>
        </Stack>
        <Stack direction="column" gap={6}>
          <Stack direction="row" gap={2} justify="start">
            <div style={{ width: 'var(--component-spacing-md)' }}></div>
            <Select
              value={edgeTypeValue}
              onValueChange={(value) => dispatch.settings.setEdgeType(value)}
            >
              <Select.Trigger label="Edge Type" value={edgeTypeValue} />
              <Select.Content>
                {EdgeValues.map((value, index) => {
                  return (
                    <Select.Item value={value!} key={index}>
                      {value}
                    </Select.Item>
                  );
                })}
              </Select.Content>
            </Select>
          </Stack>
          <Stack direction="row" gap={2} justify="start">
            <div style={{ width: 'var(--component-spacing-md)' }}></div>
            <Select
              value={layoutTypeValue}
              onValueChange={(value) => dispatch.settings.setLayoutType(value)}
            >
              <Select.Trigger label="Layout Type" value={layoutTypeValue} />
              <Select.Content>
                {LayoutValues.map((value, index) => {
                  return (
                    <Select.Item value={value!} key={index}>
                      {value}
                    </Select.Item>
                  );
                })}
              </Select.Content>
            </Select>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};
