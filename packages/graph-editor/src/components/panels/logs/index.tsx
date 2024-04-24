import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Text,
  Stack,
  IconButton,
  TextInput,
} from '@tokens-studio/ui';

import { currentNode, logSelector } from '@/redux/selectors/graph';
import { useSelector } from 'react-redux';
import { JSONTree } from 'react-json-tree';
import { TrashIcon } from '@radix-ui/react-icons';
import { useDispatch } from '@/hooks';

export function LogsPanel() {
  const logs = useSelector(logSelector);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = React.useState('');

  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [logs]);

  const clearLogs = useCallback(() => {
    //dispatch(clearLogs())
    dispatch.graph.clearLogs();
  }, [dispatch.graph]);


  const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);


  return (
    <Stack
      direction="column"
      gap={2}
      css={{ height: '100%', flex: 1, padding: '$3' }}
    >
      <Stack direction="row" gap={2} justify="end">
        <TextInput value={searchText} placeholder="Search logs. <TODO>" onChange={onSearchChange} />
        <IconButton onClick={clearLogs} icon={<TrashIcon />} tooltip='Clear logs' />
      </Stack>

      <Box css={{ padding: '$1', overflow: 'auto', fontSize: 'smaller' }}>
        <Stack direction="column" gap={2}>
          {logs.map((log, index) => (
            <Box key={index} css={{ border: '1px solid $borderSubtle', padding: '$2' }}>
              <Stack direction="column" gap={2}>
                <Stack direction='row' gap={2}>
                  <Text css={{ fontSize: 'xx-small' }}>
                    {log.type}
                  </Text>
                  <Text css={{ fontSize: '$1', color: '$textSecondary' }}>
                    {log.time.toUTCString()}
                  </Text>
                </Stack>

                <JSONTree data={log.data} />
              </Stack>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </Box>
    </Stack>
  );
}
