import { Box } from '@tokens-studio/ui/Box.js';
import { Button } from '@tokens-studio/ui/Button.js';
import { Checkbox } from '@tokens-studio/ui/Checkbox.js';
import { DropdownMenu } from '@tokens-studio/ui/DropdownMenu.js';
import { EdgeType, LayoutType } from '@/redux/models/settings.js';
import { InfoCircleSolid } from 'iconoir-react';
import { Label } from '@tokens-studio/ui/Label.js';
import { Stack } from '@tokens-studio/ui/Stack.js';
import { Text } from '@tokens-studio/ui/Text.js';
import { Tooltip } from '@tokens-studio/ui/Tooltip.js';
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
    <Box
      css={{
        height: '100%',
        width: '100%',
        flex: 1,
        display: 'flex',
        overflow: 'auto',
        padding: '$3',
        flexDirection: 'column',
      }}
    >
      <Stack direction="column" gap={3}>
        <Stack direction="column" gap={2} justify="between">
          <Stack direction="row" gap={2} justify="between">
            <Label>Show inline types</Label>
            <Tooltip
              label={
                'Adds additional labels to help differentiate types for colorblind users'
              }
            >
              <Box>
                <Text>
                  <InfoCircleSolid />
                </Text>
              </Box>
            </Tooltip>
          </Stack>
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setInlineTypes(Boolean(checked))
            }
            checked={inlineTypesValue}
          />
        </Stack>
        <Stack direction="column" gap={2} justify="between">
          <Stack direction="row" gap={2} justify="between">
            <Label>Show inline values</Label>
            <Tooltip
              label={
                'Shows values directly on the node. Useful for debugging but can be cluttered'
              }
            >
              <Box>
                <Text>
                  <InfoCircleSolid />
                </Text>
              </Box>
            </Tooltip>
          </Stack>
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setInlineValues(Boolean(checked))
            }
            checked={inlineValuesValue}
          />
        </Stack>
        <Stack direction="column" gap={2} justify="between">
          <Stack direction="row" gap={2} justify="between">
            <Label>Use delayed interaction</Label>
            <Tooltip label={'Forces a user to click save to update port '}>
              <Box>
                <Text>
                  <InfoCircleSolid />
                </Text>
              </Box>
            </Tooltip>
          </Stack>
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setDelayedUpdate(Boolean(checked))
            }
            checked={delayedUpdateValue}
          />
        </Stack>
        <Stack direction="column" gap={2} justify="between">
          <Stack direction="row" gap={2} justify="between">
            <Label>Click to connect</Label>
            <Tooltip
              label={
                'Allows you to quick connect nodes by clicking on the 2 port'
              }
            >
              <Box>
                <Text>
                  <InfoCircleSolid />
                </Text>
              </Box>
            </Tooltip>
          </Stack>
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setConnectOnClick(Boolean(checked))
            }
            checked={connectOnClick}
          />
        </Stack>
        <Stack direction="column" gap={2} justify="between">
          <Stack direction="row" gap={2} justify="between">
            <Label>Show execution time</Label>
            <Tooltip label={'Shows how long it takes for a node to process'}>
              <Box>
                <Text>
                  <InfoCircleSolid />
                </Text>
              </Box>
            </Tooltip>
          </Stack>
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setShowTimings(Boolean(checked))
            }
            checked={showTimingsValue}
          />
        </Stack>
        <Stack direction="column" gap={2} justify="between">
          <Stack direction="row" gap={2} justify="between">
            <Label>Show Minimap</Label>
            <Tooltip label={'Shows the minimap in the graph editing area'}>
              <Box>
                <Text>
                  <InfoCircleSolid />
                </Text>
              </Box>
            </Tooltip>
          </Stack>
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.settings.setShowMinimap(Boolean(checked))
            }
            checked={showMinimap}
          />
        </Stack>
        <Stack direction="column" gap={2} justify="between">
          <Stack direction="row" gap={2} justify="between">
            <Label>Enable Context Menus</Label>
            <Tooltip label={'Provides right click context menus'}>
              <Box>
                <Text>
                  <InfoCircleSolid />
                </Text>
              </Box>
            </Tooltip>
          </Stack>
          <Checkbox
            onCheckedChange={(checked) =>
              dispatch.ui.setContextMenus(Boolean(checked))
            }
            checked={contextMenus}
          />
        </Stack>
        <Stack direction="column" gap={2} justify="between">
          <Label>Edge Type</Label>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" asDropdown size="small">
                {edgeTypeValue}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="top">
              {EdgeValues.map((value, index) => {
                return (
                  <DropdownMenu.Item
                    key={index}
                    onClick={() => dispatch.settings.setEdgeType(value)}
                  >
                    {value}
                  </DropdownMenu.Item>
                );
              })}
              <DropdownMenu.Item></DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </Stack>
        <Stack direction="column" gap={2} justify="between">
          <Label>Layout type</Label>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" asDropdown size="small">
                {layoutTypeValue}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content side="top">
              {LayoutValues.map((value, index) => {
                return (
                  <DropdownMenu.Item
                    key={index}
                    onClick={() => dispatch.settings.setLayoutType(value)}
                  >
                    {value}
                  </DropdownMenu.Item>
                );
              })}
              <DropdownMenu.Item></DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </Stack>
      </Stack>
    </Box>
  );
};
