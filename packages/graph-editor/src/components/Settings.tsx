import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Dialog,
  DropdownMenu,
  Label,
  Stack,
  TextInput,
  Tooltip,
} from '@tokens-studio/ui';
import { useSelector } from 'react-redux';
import {
  edgeType,
  layoutType,
  obscureDistance,
} from '#/redux/selectors/settings';
import { useDispatch } from '#/hooks/useDispatch.ts';
import { EdgeType, LayoutType } from '#/redux/models/settings.ts';
import { InformationIcon, SettingsIcon } from '@iconicicons/react';

const EdgeValues = Object.values(EdgeType);
const LayoutValues = Object.values(LayoutType);

export const Settings = () => {
  const edgeTypeValue = useSelector(edgeType);
  const layoutTypeValue = useSelector(layoutType);
  const obscureDistanceValue = useSelector(obscureDistance);
  const dispatch = useDispatch();

  const onObscureDistanceChange = (event) => {
    dispatch.settings.setObscureDistance(parseFloat(event.target.value));
  };

  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <IconButton
          css={{ flexShrink: 0 }}
          icon={<SettingsIcon />}
          variant="invisible"
          tooltip="Settings"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>

          <Stack direction="column" gap={2} justify="between">
            <Stack direction="row" gap={2} justify="between">
              <Label>Obscure distance</Label>
              <Tooltip
                label={
                  'How far away the node will be till obscured. Set to 0 to disable hiding nodes'
                }
              >
                <Box>
                  <InformationIcon />
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

          <Dialog.CloseButton />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
