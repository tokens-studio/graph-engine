import { DownloadIcon, FilePlusIcon, UploadIcon } from '@radix-ui/react-icons';
import { Menu, Item, Seperator, SubMenu } from './data';
import React, { MutableRefObject, useCallback } from 'react';
import { MenuItem } from './menuItem';
import { useSelector } from 'react-redux';
import { dockerSelector, graphEditorSelector } from '@/redux/selectors/refs';
import DockLayout, { TabData } from 'rc-dock';
import { Sidesheet } from '../panels/sidesheet';
import { Legend } from '../panels/legend';
import { FlameGraph } from '../panels/flamegraph';
import { ImperativeEditorRef } from '@/editor/editorTypes';

export const defaultMenuDataFactory = () =>
  new Menu({
    items: [
      new SubMenu({
        title: 'File',
        name: 'file',
        items: [
          new Item({
            name: 'newGraph',
            render: () => {
              return (
                <MenuItem key="neww" icon={<FilePlusIcon />}>
                  New Graph
                </MenuItem>
              );
            },
          }),
          new Seperator(),
          new Item({
            name: 'load',
            render: function FileLoad() {
              const graphRef = useSelector(
                graphEditorSelector,
              ) as MutableRefObject<ImperativeEditorRef>;
              const onClick = () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                //@ts-ignore
                input.onchange = (e: HTMLInputElement) => {
                  //@ts-ignore
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const text = (e.target as any).result;
                    const data = JSON.parse(text);
                    graphRef.current.load(data);
                  };
                  reader.readAsText(file);
                };
                input.click();
              };

              return (
                <MenuItem icon={<UploadIcon />}>
                  <u>L</u>oad
                </MenuItem>
              );
            },
          }),
          new Item({
            name: 'save',
            render: function FileSave() {
              const graphRef = useSelector(
                graphEditorSelector,
              ) as MutableRefObject<ImperativeEditorRef>;

              const onSave = () => {
                const saved = graphRef.current.save();
                const blob = new Blob([JSON.stringify(saved)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `graph.json`;
                document.body.appendChild(link);
                link.click();
              };

              return (
                <MenuItem
                  disabled={!graphRef?.current}
                  icon={<DownloadIcon />}
                  onClick={onSave}
                >
                  <u>S</u>ave
                </MenuItem>
              );
            },
          }),
        ],
      }),
      new SubMenu({
        title: 'Edit',
        name: 'edit',
        items: [
          new Item({
            name: 'undo',
            render: () => <MenuItem>Undo</MenuItem>,
          }),
          new Item({
            name: 'redo',
            render: () => <MenuItem>Redo</MenuItem>,
          }),
        ],
      }),
      new SubMenu({
        name: 'window',
        title: 'Window',
        items: [
          new Item({
            name: 'sideSheet',
            render: function SidesheetToggle() {
              const dockerRef = useSelector(
                dockerSelector,
              ) as MutableRefObject<DockLayout>;

              const onToggleSideSheet = () => {
                const existing = dockerRef.current.find('sideSheet') as TabData;
                if (existing) {
                  //Look for the panel
                  if (existing.parent?.tabs.length === 1) {
                    //Close the panel instead
                    dockerRef.current.dockMove(existing.parent, null, 'remove');
                  } else {
                    //Close the tab
                    dockerRef.current.dockMove(existing, null, 'remove');
                  }
                } else {
                  dockerRef.current.dockMove(
                    {
                      cached: true,
                      group: 'popout',
                      id: 'sideSheet',
                      title: 'Side Sheet',
                      content: <Sidesheet />,
                    },
                    dockerRef.current.getLayout().dockbox,
                    'right',
                  );
                }
              };

              return (
                <MenuItem onClick={onToggleSideSheet}>Side sheet</MenuItem>
              );
            },
          }),
          new Item({
            name: 'legend',
            render: function LegendToggle() {
              const dockerRef = useSelector(
                dockerSelector,
              ) as MutableRefObject<DockLayout>;
              const onToggleLegend = () => {
                const existing = dockerRef.current.find('legend') as TabData;
                if (existing) {
                  //Look for the panel
                  if (existing.parent?.tabs.length === 1) {
                    //Close the panel instead
                    dockerRef.current.dockMove(existing.parent, null, 'remove');
                  } else {
                    //Close the tab
                    dockerRef.current.dockMove(existing, null, 'remove');
                  }
                } else {
                  dockerRef.current.dockMove(
                    {
                      group: 'popout',
                      id: 'legend',
                      title: 'Legend',
                      content: <Legend />,
                    },
                    null,
                    'float',
                    {
                      left: 300,
                      top: 300,
                      width: 200,
                      height: 200,
                    },
                  );
                }
              };

              return <MenuItem onClick={onToggleLegend}>Legend</MenuItem>;
            },
          }),
          new Item({
            name: 'flamegraph',
            render: function FlameGraphToggle() {
              const dockerRef = useSelector(
                dockerSelector,
              ) as MutableRefObject<DockLayout>;

              const onToggleFlamegraph = () => {
                const existing = dockerRef.current.find(
                  'flamegraph',
                ) as TabData;
                if (existing) {
                  //Look for the panel
                  if (existing.parent?.tabs.length === 1) {
                    //Close the panel instead
                    dockerRef.current.dockMove(existing.parent, null, 'remove');
                  } else {
                    //Close the tab
                    dockerRef.current.dockMove(existing, null, 'remove');
                  }
                } else {
                  dockerRef.current.dockMove(
                    {
                      group: 'popout',
                      id: 'flamegraph',
                      title: 'FlameGraph',
                      content: <FlameGraph />,
                    },
                    null,
                    'float',
                    {
                      left: 300,
                      top: 300,
                      width: 200,
                      height: 200,
                    },
                  );
                }
              };

              return (
                <MenuItem onClick={onToggleFlamegraph}>FlameGraph</MenuItem>
              );
            },
          }),

          new Seperator(),

          new Item({
            name: 'saveLayout',
            render: function SaveLayout() {
              const dockerRef = useSelector(
                dockerSelector,
              ) as MutableRefObject<DockLayout>;

              const saveLayout = useCallback(() => {
                const saved = dockerRef.current.saveLayout();
                const blob = new Blob([JSON.stringify(saved)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `layout.json`;
                document.body.appendChild(link);
                link.click();
              }, [dockerRef]);

              return <MenuItem onClick={saveLayout}>Save Layout</MenuItem>;
            },
          }),
          new Item({
            name: 'loadLayout',
            render: function LoadLayout() {
              const dockerRef = useSelector(
                dockerSelector,
              ) as MutableRefObject<DockLayout>;

              const loadLayout = useCallback(() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                //@ts-ignore
                input.onchange = (e: HTMLInputElement) => {
                  //@ts-ignore
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const text = (e.target as any).result;
                    const data = JSON.parse(text);
                    dockerRef.current.loadLayout(data);
                  };
                  reader.readAsText(file);
                };
                input.click();
              }, [dockerRef]);

              return <MenuItem onClick={loadLayout}>Load Layout</MenuItem>;
            },
          }),
          //                     <Item onClick={saveLayout} >Save Layout</Item>

          //                     <Item onClick={loadLayout} >Load Layout</Item>
        ],
      }),
    ],
  });
