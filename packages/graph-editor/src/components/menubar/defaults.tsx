import { DownloadIcon, FilePlusIcon, GearIcon, InputIcon, PlayIcon, UploadIcon } from '@radix-ui/react-icons';
import { Menu, MenuItem, Seperator, SubMenu } from './data';
import React, { MutableRefObject, useCallback } from 'react';
import { MenuItemElement } from './menuItem';
import { useSelector } from 'react-redux';
import { dockerSelector, graphEditorSelector } from '@/redux/selectors/refs';
import DockLayout, { TabData } from 'rc-dock';
import { OutputSheet } from '../panels/output';
import { Legend } from '../panels/legend';
import { FlameGraph } from '../panels/flamegraph';
import { ImperativeEditorRef } from '@/editor/editorTypes';
import { Settings } from '../panels/settings';
import { Inputsheet } from '../panels/inputs';
import { NodeSettingsPanel } from '../panels/nodeSettings';
import { FindDialog } from '../dialogs/findDialog';
import { PlayPanel } from '../panels/play';
import { LogsPanel } from '../panels/logs';
import { AnnotationDotsIcon, CpuIcon, RedoIcon, UndoIcon } from '@iconicicons/react';
import { GraphPanel } from '../panels/graph';



export interface IWindowButton {
  //Id of the tab
  id: string;
  title: string;
  //name ofthe menu item
  name: string;
  icon?: JSX.Element;
  content: JSX.Element;
}
/**
 * A simple button that toggles a window panel
 * @param param0 
 * @returns 
 */
export const windowButton = ({
  name,
  id,
  title,
  icon,
  content,
}: IWindowButton) =>
  new MenuItem({
    name: name,
    render: function Toggle() {
      const dockerRef = useSelector(
        dockerSelector,
      ) as MutableRefObject<DockLayout>;

      const onToggle = () => {
        const existing = dockerRef.current.find(id) as TabData;
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
              id,
              title,
              content,
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

      return <MenuItemElement onClick={onToggle} key={title} icon={icon}>{title}</MenuItemElement >;
    },
  });

export const defaultMenuDataFactory = (): Menu =>
  new Menu({
    items: [
      new SubMenu({
        title: 'File',
        name: 'file',
        items: [
          new MenuItem({
            name: 'newGraph',
            render: (rest) => {
              return (
                <MenuItemElement key="neww" icon={<FilePlusIcon />} {...rest}>
                  New Graph
                </MenuItemElement>
              );
            },
          }),
          new Seperator(),
          new MenuItem({
            name: 'load',
            render: function FileLoad(rest) {
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

                    //TODO open a new tab
                    graphRef.current.load(data);
                  };
                  reader.readAsText(file);
                };
                input.click();
              };

              return (
                <MenuItemElement onClick={onClick} icon={<UploadIcon />} {...rest}>
                  <u>L</u>oad
                </MenuItemElement>
              );
            },
          }),
          new MenuItem({
            name: 'save',
            render: function FileSave(rest) {
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
                <MenuItemElement
                  disabled={!graphRef?.current}
                  icon={<DownloadIcon />}
                  onClick={onSave}
                  {...rest}
                >
                  <u>S</u>ave
                </MenuItemElement>
              );
            },
          }),
        ],
      }),
      new SubMenu({
        title: 'Edit',
        name: 'edit',
        items: [
          new MenuItem({
            name: 'undo',
            render: (rest) => <MenuItemElement icon={<UndoIcon />} {...rest} >Undo</MenuItemElement>,
          }),
          new MenuItem({
            name: 'redo',
            render: (rest) => <MenuItemElement icon={<RedoIcon />} {...rest}>Redo</MenuItemElement>,
          }),

          new Seperator(),
          new MenuItem({
            name: 'find',
            render: (rest) => (
              <MenuItemElement {...rest} inner={(children) => (
                <FindDialog>
                  {children}
                </FindDialog>
              )}>
                Find
              </MenuItemElement>
            ),
          }),
        ],
      }),
      new SubMenu({
        name: 'window',
        title: 'Window',
        items: [
          windowButton({
            name: 'inputs',
            id: 'inputs',
            title: 'Inputs',
            content: <Inputsheet />,
          }),
          windowButton({
            name: 'outputs',
            id: 'outputs',
            title: 'Outputs',
            content: <OutputSheet />,
          }),
          windowButton({
            name: 'nodeSettings',
            id: 'nodeSettings',
            title: 'Node Settings',
            icon: <CpuIcon />,
            content: <NodeSettingsPanel />,
          }),
          windowButton({
            name: 'graphSettings',
            id: 'graphSettings',
            title: 'Graph Settings',
            content: <GraphPanel />,
          }),
          windowButton({
            name: 'logs',
            id: 'logs',
            title: 'Logs',
            icon: <AnnotationDotsIcon />,
            content: <LogsPanel />,
          }),
          windowButton({
            name: 'playControls',
            id: 'playControls',
            title: 'Play Controls',
            icon: <PlayIcon />,
            content: <PlayPanel />,
          }),
          windowButton({
            name: 'legend',
            id: 'legend',
            title: 'Legend',
            content: <Legend />,
          }),
          windowButton({
            name: 'flamegraph',
            id: 'flamegraph',
            title: 'FlameGraph',
            content: <FlameGraph />,
          }),
          windowButton({
            name: 'settings',
            id: 'settings',
            title: 'Settings',
            icon: <GearIcon />,
            content: <Settings />,
          }),

          new Seperator(),

          new MenuItem({
            name: 'saveLayout',
            render: function SaveLayout(rest) {
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
              return (
                <MenuItemElement icon={<DownloadIcon />} onClick={saveLayout} {...rest}>
                  Save Layout
                </MenuItemElement>
              );
            },
          }),
          new MenuItem({
            name: 'loadLayout',
            render: function LoadLayout(rest) {
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

              return (
                <MenuItemElement icon={<UploadIcon />} onClick={loadLayout} {...rest}>
                  Load Layout
                </MenuItemElement>
              );
            },
          }),
        ],
      }),
    ],
  });
