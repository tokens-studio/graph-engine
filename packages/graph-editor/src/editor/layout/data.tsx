import { DropPanel } from '@/components/panels/dropPanel/dropPanel.js';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorBoundaryContent } from '@/components/ErrorBoundaryContent.js';
import { GraphEditor } from '../graphEditor.js';
import { Inputsheet } from '@/components/panels/inputs/index.js';
import { LayoutData, TabBase, TabData } from 'rc-dock';
import { MAIN_GRAPH_ID } from '@/constants.js';
import { OutputSheet } from '@/components/panels/output/index.js';
import React from 'react';

export const layoutDataFactory = (): LayoutData => {
  return {
    dockbox: {
      mode: 'vertical',
      children: [
        {
          mode: 'horizontal',
          children: [
            {
              size: 2,
              mode: 'vertical',
              children: [
                {
                  mode: 'horizontal',
                  children: [
                    {
                      size: 3,
                      mode: 'vertical',
                      children: [
                        {
                          tabs: [
                            {
                              id: 'dropPanel',
                              title: '',
                              content: <></>,
                            },
                            {
                              id: 'previewNodesPanel',
                              title: '',
                              content: <></>,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      size: 17,
                      mode: 'vertical',
                      children: [
                        {
                          id: 'graphs',
                          size: 700,
                          group: 'graph',
                          panelLock: { panelStyle: 'graph' },
                          tabs: [
                            {
                              closable: true,
                              cached: true,
                              id: MAIN_GRAPH_ID,
                              group: 'graph',
                              title: 'Graph',
                              content: <></>,
                            },
                          ],
                        },
                      ],
                    },

                    {
                      size: 4,
                      mode: 'vertical',
                      children: [
                        {
                          size: 12,
                          tabs: [
                            {
                              id: 'input',
                              title: '',
                              content: <></>,
                            },
                          ],
                        },
                        {
                          size: 12,
                          tabs: [
                            {
                              id: 'outputs',
                              title: '',
                              content: <></>,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
};

export const layoutLoader =
  (props, ref) =>
  (tab: TabBase): TabData => {
    const { id } = tab;
    switch (id) {
      case MAIN_GRAPH_ID:
        return {
          closable: true,
          cached: true,
          id: MAIN_GRAPH_ID,
          group: 'graph',
          title: 'Graph',
          content: (
            <ErrorBoundary fallback={<ErrorBoundaryContent />}>
              <GraphEditor {...props} id={MAIN_GRAPH_ID} ref={ref} />
            </ErrorBoundary>
          ),
        };
      case 'input':
        return {
          closable: true,
          cached: true,
          group: 'popout',
          id: 'input',
          title: 'Inputs',
          content: (
            <ErrorBoundary fallback={<ErrorBoundaryContent />}>
              <Inputsheet />
            </ErrorBoundary>
          ),
        };
      case 'outputs':
        return {
          closable: true,
          cached: true,
          group: 'popout',
          id: 'outputs',
          title: 'Outputs',
          content: (
            <ErrorBoundary fallback={<ErrorBoundaryContent />}>
              <OutputSheet />
            </ErrorBoundary>
          ),
        };

      case 'dropPanel':
        return {
          group: 'popout',
          id: 'dropPanel',
          title: 'Nodes',
          content: (
            <ErrorBoundary fallback={<ErrorBoundaryContent />}>
              <DropPanel />
            </ErrorBoundary>
          ),
          closable: true,
        };
      default:
        return tab as TabData;
    }
  };
