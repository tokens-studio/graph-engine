import { Button, DropdownMenu } from '@tokens-studio/ui';
import { getViewports } from '@/components/hotKeys/index.js';
import { savedViewports } from '@/annotations/index.js';
import { useLocalGraph } from '@/hooks/index.js';
import { useReactFlow, useViewport } from 'reactflow';
import { useToast } from '@/hooks/useToast.js';
import NavArrowRight from '@tokens-studio/icons/NavArrowRight.js';
import React, { useCallback } from 'react';

export const ZoomDropdown = () => {
  const reactFlow = useReactFlow();

  const graph = useLocalGraph();
  const viewports = getViewports(graph);
  const trigger = useToast();
  const { zoom } = useViewport();

  const onFitView = useCallback(() => {
    reactFlow.fitView({
      includeHiddenNodes: false,
    });
  }, [reactFlow]);

  const onCenterNode = useCallback(() => {
    reactFlow.fitView({
      includeHiddenNodes: false,
      nodes: reactFlow.getNodes().filter((el) => el.selected === true),
    });
  }, [reactFlow]);

  const onSetZoom = useCallback(
    (e) => {
      const zoom = parseFloat(e.currentTarget.dataset.value);
      // Ensure zoom is within valid range
      const safeZoom = Math.max(0.1, Math.min(zoom, 10));

      reactFlow.zoomTo(safeZoom, {
        duration: 0.1,
      });
    },
    [reactFlow],
  );

  const zoomIn = useCallback(() => {
    const viewport = reactFlow.getViewport();
    const newZoom = Math.min(viewport.zoom + 0.1, 10); // Cap at max zoom
    reactFlow.setViewport({ ...viewport, zoom: newZoom });
  }, [reactFlow]);

  const zoomOut = useCallback(() => {
    const viewport = reactFlow.getViewport();
    const newZoom = Math.max(viewport.zoom - 0.1, 0.1); // Prevent going below min zoom
    reactFlow.setViewport({ ...viewport, zoom: newZoom });
  }, [reactFlow]);

  const onSaveViewPort = useCallback(
    (e) => {
      const viewportIndex = parseInt(e.currentTarget.dataset.value);
      const currentViewport = reactFlow.getViewport();

      if (viewportIndex >= 0 && viewportIndex < 9) {
        const viewports = getViewports(graph);
        viewports[viewportIndex] = currentViewport;
        graph.annotations[savedViewports] = viewports;
        trigger({
          title: 'Viewport saved',
          description: `Viewport ${viewportIndex + 1} saved`,
        });
      }
    },
    [reactFlow, graph, trigger],
  );

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button style={{ fontVariantNumeric: 'tabular-nums' }}>
          {~~(zoom * 100)}%
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content style={{ minWidth: '200px' }}>
          <DropdownMenu.Item data-value={0.1} onClick={onSetZoom}>
            10%
          </DropdownMenu.Item>
          <DropdownMenu.Item data-value={0.25} onClick={onSetZoom}>
            25%
          </DropdownMenu.Item>
          <DropdownMenu.Item data-value={0.5} onClick={onSetZoom}>
            50%
          </DropdownMenu.Item>
          <DropdownMenu.Item data-value={1} onClick={onSetZoom}>
            100%
            <DropdownMenu.TrailingVisual>⇧1</DropdownMenu.TrailingVisual>
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Item onClick={onCenterNode}>
            Center on Node
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={onFitView}>Fit view</DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Item onClick={zoomIn}>
            Zoom In
            <DropdownMenu.TrailingVisual>⌘+</DropdownMenu.TrailingVisual>
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={zoomOut}>
            Zoom Out
            <DropdownMenu.TrailingVisual>⌘-</DropdownMenu.TrailingVisual>
          </DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              Load Viewport
              <DropdownMenu.TrailingVisual>
                <NavArrowRight />
              </DropdownMenu.TrailingVisual>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent sideOffset={2} alignOffset={-5}>
                {viewports.every((viewport) => !viewport) && (
                  <DropdownMenu.Item disabled>
                    No viewports saved
                  </DropdownMenu.Item>
                )}
                {viewports.map((viewport, index) => {
                  if (viewport) {
                    return (
                      <DropdownMenu.Item
                        key={index}
                        data-value={index}
                        onClick={() => {
                          reactFlow.setViewport(viewport);
                        }}
                      >
                        View port {index + 1}
                        <DropdownMenu.TrailingVisual>
                          {index + 1}
                        </DropdownMenu.TrailingVisual>
                      </DropdownMenu.Item>
                    );
                  }
                  return <></>;
                })}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              Save Viewport
              <DropdownMenu.TrailingVisual>
                <NavArrowRight />
              </DropdownMenu.TrailingVisual>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent sideOffset={2} alignOffset={-5}>
                {viewports.map((viewport, index) => {
                  return (
                    <DropdownMenu.Item
                      key={index}
                      data-value={index}
                      onClick={onSaveViewPort}
                    >
                      View port {index + 1}
                      <DropdownMenu.TrailingVisual>
                        ⌘{index + 1}
                      </DropdownMenu.TrailingVisual>
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};
