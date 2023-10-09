import { BatteryChargingIcon, FilePlusIcon, TabletIcon } from "@iconicicons/react";
import { Box, Button, EmptyState, Stack } from "@tokens-studio/ui";
import { useCallback } from "react";
import React from "react";
import { useDispatch } from "react-redux";

interface IEmptyStateProps {
  onLoadExamples: () => void;
}

export function EmptyStateEditor({onLoadExamples}: IEmptyStateProps) {
  const dispatch = useDispatch();
  

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
      }}
    >
      <EmptyState
        icon={
          <BatteryChargingIcon
            style={{ width: 48, height: 48 }}
          />
        }
        title="Build scalable and flexible design systems."
        description="Add your first node to get started or load an example"
      >
        <Stack direction="row" gap={3} css={{ pointerEvents: 'all' }}>
          <Button onClick={handleTriggerShowExamples} icon={<FilePlusIcon />}>Load example</Button>
          <Button variant="primary" onClick={handleTriggerAddNode} icon={<TabletIcon />}>Add your first node</Button>
        </Stack>
      </EmptyState>
    </Box>
  )
}

