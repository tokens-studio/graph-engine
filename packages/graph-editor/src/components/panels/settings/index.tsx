import React from 'react';
import {
  Box,
  Button,
  DropdownMenu,
  Label,
  Stack,
  TextInput,
  Tooltip,
  Checkbox,
} from '@tokens-studio/ui';
import { useSelector } from 'react-redux';
import {
  debugMode,
  edgeType,
  inlineTypes,
  layoutType,
  obscureDistance,
  showTimings,
} from '@/redux/selectors/settings';
import { useDispatch } from '@/hooks/useDispatch.ts';
import { EdgeType, LayoutType } from '@/redux/models/settings.ts';
import { InfoCircledIcon } from '@radix-ui/react-icons';

const EdgeValues = Object.values(EdgeType);
const LayoutValues = Object.values(LayoutType);

export const Settings = () => {
  const edgeTypeValue = useSelector(edgeType);
  const layoutTypeValue = useSelector(layoutType);
  const obscureDistanceValue = useSelector(obscureDistance);
  const showTimingsValue = useSelector(showTimings);
  const inlineTypesValue = useSelector(inlineTypes);
  const dispatch = useDispatch();

  const onObscureDistanceChange = (event) => {
    dispatch.settings.setObscureDistance(parseFloat(event.target.value));
  };

  return (
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
              <InfoCircledIcon />
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
          <Label>Show execution time</Label>
          <Tooltip label={'Shows how long it takes for a node to process'}>
            <Box>
              <InfoCircledIcon />
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
          <Label>Obscure distance</Label>
          <Tooltip
            label={
              'How far away the node will be till obscured. Set to 0 to disable hiding nodes'
            }
          >
            <Box>
              <InfoCircledIcon />
            </Box>
          </Tooltip>
        </Stack>
        <TextInput
          type="number"
          value={'' + obscureDistanceValue}
          onChange={onObscureDistanceChange}
        ></TextInput>
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
  );
};
