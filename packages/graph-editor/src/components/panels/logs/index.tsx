import { IconButton, Stack, Text, TextInput } from '@tokens-studio/ui';
import React, { useCallback, useEffect, useRef } from 'react';

import { JSONTree } from 'react-json-tree';
import { Trash } from 'iconoir-react';
import { logSelector } from '@/redux/selectors/graph.js';
import { useDispatch } from '@/hooks/index.js';
import { useSelector } from 'react-redux';

export function LogsPanel() {
  const logs = useSelector(logSelector);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = React.useState('');

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const clearLogs = useCallback(() => {
    //dispatch(clearLogs())
    dispatch.graph.clearLogs();
  }, [dispatch.graph]);

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [],
  );

  return (
    <Stack
      direction="column"
      gap={2}
      style={{ height: '100%', flex: 1, padding: 'var(--component-spacing-md)' }}
    >
      <Stack direction="row" gap={2} justify="end">
        <TextInput
          value={searchText}
          placeholder="Search logs. <TODO>"
          onChange={onSearchChange}
        />
        <IconButton onClick={clearLogs} icon={<Trash />} tooltip="Clear logs" />
      </Stack>

      <div style={{ padding: 'var(--component-spacing-xs)', overflow: 'auto', fontSize: 'smaller' }}>
        <Stack direction="column" gap={2}>
          {logs.map((log, index) => (
            <div
              key={index}
              style={{ border: '1px solid var(--color-neutral-stroke-subtle)', padding: 'var(--component-spacing-sm)' }}
            >
              <Stack direction="column" gap={2}>
                <Stack direction="row" gap={2}>
                  <Text style={{ font: 'var(--typography-body-sm)' }}>{log.type}</Text>
                  <Text style={{ font: 'var(--typography-body-md)', color: 'var(--color-neutral-1500)' }}>
                    {log.time.toUTCString()}
                  </Text>
                </Stack>

                <JSONTree data={log.data} />
              </Stack>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
      </div>
    </Stack>
  );
}
