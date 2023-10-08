import React from 'react';
import {
  Box,
  IconButton,
  Stack,
  Heading,
  TextInput,
  Text,
} from '@tokens-studio/ui';
import * as Portal from '@radix-ui/react-portal';
import { CloseIcon, EditIcon, CheckIcon } from '@iconicicons/react';
import { isSideSheetMinimizedSelector } from '#/redux/selectors/ui';
import { useDispatch, useSelector } from 'react-redux';

export function Sidesheet({ title, originalTitle, onChangeTitle, children }) {
  const [isTitleEditing, setIsTitleEditing] = React.useState(false);
  const [tempTitle, setTempTitle] = React.useState(title);
  const isMinimized = useSelector(isSideSheetMinimizedSelector);
  const dispatch = useDispatch();

  const handleChangeTempTitle = React.useCallback((ev) => {
    setTempTitle(ev.target.value);
  }, []);

  const handleTitleChange = React.useCallback(() => {
    setIsTitleEditing(false);
    onChangeTitle(tempTitle);
  }, [tempTitle]);

  const handleToggleMinimized = () =>
    dispatch.ui.setIsSideSheetMinimized(!isMinimized);

  const isUsingCustomTitle = title !== originalTitle;

  if (isMinimized) {
    return (
      <Portal.Root>
        <Box
          as="button"
          onClick={handleToggleMinimized}
          css={{
            position: 'fixed',
            right: '$3',
            bottom: '$3',
            backgroundColor: '$bgCanvas',
            border: '1px solid $borderSubtle',
            borderRightWidth: 0,
            borderBottomWidth: 0,
            borderRadius: '$medium',
            padding: '$3 $4',
            cursor: 'pointer',
            fontSize: '$xsmall',
            fontWeight: '$sansMedium',
          }}
        >
          {title}
        </Box>
      </Portal.Root>
    );
  }
  return (
    <Portal.Root>
      <Box
        css={{
          display: 'flex',
          position: 'fixed',
          right: '$3',
          bottom: '$3',
        }}
      >
        <Box
          css={{
            maxWidth: 'clamp(180px, 40vw, 400px)',
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
              {isUsingCustomTitle && (
                <Text
                  css={{
                    fontSize: '$xxsmall',
                    color: '$fgSubtle',
                    fontWeight: '$sansMedium',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15px',
                  }}
                >
                  {originalTitle}
                </Text>
              )}
              {isTitleEditing ? (
                <Stack
                  as="form"
                  gap={3}
                  align="center"
                  onSubmit={handleTitleChange}
                >
                  <TextInput
                    value={tempTitle}
                    onChange={handleChangeTempTitle}
                  />
                  <IconButton
                    icon={<CheckIcon />}
                    variant="primary"
                    onClick={handleTitleChange}
                    tooltip="Save"
                    css={{ flexShrink: 0 }}
                  />
                </Stack>
              ) : (
                <Stack gap={2} align="start" justify="between">
                  <Stack gap={2}>
                    <Heading size="large">{title}</Heading>
                    <IconButton
                      icon={<EditIcon />}
                      tooltip={isUsingCustomTitle ? 'Edit' : 'Add custom name'}
                      variant="invisible"
                      size="small"
                      onClick={() => setIsTitleEditing(true)}
                    />
                  </Stack>
                  <IconButton
                    icon={<CloseIcon />}
                    variant="invisible"
                    onClick={handleToggleMinimized}
                  />
                </Stack>
              )}
              <Text muted>We could add the description here as well.</Text>
            </Stack>
            {children}
          </Stack>
        </Box>
      </Box>
    </Portal.Root>
  );
}
