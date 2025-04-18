import { Button, Stack, Text } from '@tokens-studio/ui';
import { ImperativeEditorRef } from '@/editor/editorTypes.js';
import { mainGraphSelector } from '@/redux/selectors/graph.js';
import { title } from '@/annotations/index.js';
import { useSelector } from 'react-redux';
import React from 'react';

export const ErrorBoundaryContent: React.FunctionComponent = () => {
  const mainGraph = useSelector(mainGraphSelector);
  const graphRef = mainGraph?.ref as ImperativeEditorRef | undefined;

  const onSave = () => {
    const saved = graphRef!.save();
    const blob = new Blob([JSON.stringify(saved)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = (saved.annotations[title] || 'graph') + `.json`;
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Stack
      style={{
        width: '100%',
        height: '100%',
        padding: 'var(--component-spacing-lg)',
      }}
      align="center"
      justify="center"
    >
      <Stack direction="column" gap={4} align="center" justify="center">
        <Text style={{ font: 'var(--font-body-xl)', textAlign: 'center' }}>
          Uh-oh, something went wrong!
        </Text>
        {graphRef ? (
          <Text style={{ textAlign: 'center' }}>
            It looks like an error occurred. You can download your current
            progress and contact support.
          </Text>
        ) : (
          <>
            <Text style={{ textAlign: 'center' }}>
              It looks like an error occurred. Try reloading the page.
            </Text>
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload page
            </Button>
          </>
        )}
        {graphRef && <Button onClick={onSave}>Download graph</Button>}
      </Stack>
    </Stack>
  );
};
