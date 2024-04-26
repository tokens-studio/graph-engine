import { showNodesPanelSelector } from '@/redux/selectors/index.ts';
import {PagePlus, JournalPage, BatteryCharging} from 'iconoir-react';
import { Box, Button, EmptyState, Stack } from '@tokens-studio/ui';
import { useCallback } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface IEmptyStateProps {
  onLoadExamples: () => void;
}

export function EmptyStateEditor({ onLoadExamples }: IEmptyStateProps) {
  const dispatch = useDispatch();
  const showNodesPanel = useSelector(showNodesPanelSelector);

  const handleTriggerAddNode = useCallback(
    (e) => {
      dispatch.ui.setShowNodesCmdPalette(true);
    },
    [dispatch.ui],
  );

  const handleTriggerShowExamples = useCallback(
    (e) => {
      onLoadExamples();
    },
    [onLoadExamples],
  );

  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 100,
        paddingLeft: showNodesPanel ? 'var(--globals-drop-panel-width)' : '0',
      }}
    >
      <EmptyState
        icon={<BatteryCharging style={{ width: 48, height: 48 }} />}
        title="Build scalable and flexible design systems."
        description="Add your first node to get started or load an example"
      >
        <Stack direction="row" gap={3} css={{ pointerEvents: 'all' }}>
          <Button onClick={handleTriggerShowExamples} icon={<PagePlus />}>
            Load example
          </Button>
          <Button
            variant="primary"
            onClick={handleTriggerAddNode}
            icon={<JournalPage />}
          >
            Add your first node
          </Button>
        </Stack>
      </EmptyState>
    </Box>
  );
}
