import { Download, PagePlusIn, Settings as SettingsIcon, Play, Upload, Undo, Redo, Cpu, Archive } from 'iconoir-react';
import { Menu, MenuItem, Seperator, SubMenu } from './data';
import React, { MutableRefObject, useCallback } from 'react';
import { MenuItemElement } from './menuItem';
import { useSelector } from 'react-redux';
import { dockerSelector } from '@/redux/selectors/refs';
import DockLayout, { TabData } from 'rc-dock';
import { OutputSheet } from '../panels/output';
import { Legend } from '../panels/legend';
import { DebugPanel } from '../panels/debugger';
import { ImperativeEditorRef } from '@/editor/editorTypes';
import { Settings } from '../panels/settings';
import { Inputsheet } from '../panels/inputs';
import { NodeSettingsPanel } from '../panels/nodeSettings';
import { AlignmentPanel } from '../panels/alignment';
import { PlayPanel } from '../panels/play';
import { LogsPanel } from '../panels/logs';
import { GraphPanel } from '../panels/graph';
import { DropPanel } from '../panels/dropPanel';
import { graphEditorSelector, mainGraphSelector } from '@/redux/selectors/graph';
import { title } from '@/annotations';
import { useDispatch } from '@/hooks';

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
                <MenuItemElement key="new" icon={<PagePlusIn />} {...rest}>
                  New Graph
                </MenuItemElement>
              );
            },
          }),
          new Seperator(),
          new MenuItem({
            name: 'upload',
            render: function FileLoad(rest) {

              const graphRef = useSelector(
                graphEditorSelector,
              );

              const onClick = () => {
                if (!graphRef) return;

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
                    graphRef.loadRaw(data);
                  };
                  reader.readAsText(file);
                };
                input.click();
              };

              return (
                <MenuItemElement onClick={onClick} icon={<Upload />} {...rest}>
                  <u>U</u>pload
                </MenuItemElement>
              );
            },
          }),
          new MenuItem({
            name: 'download',
            render: function FileSave(rest) {
              const mainGraph = useSelector(mainGraphSelector);
              const graphRef = mainGraph?.ref as (ImperativeEditorRef | undefined);

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
                <MenuItemElement
                  disabled={!graphRef}
                  icon={<Download />}
                  onClick={onSave}
                  {...rest}
                >
                  <u>D</u>ownload
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
          // new MenuItem({
          //   name: 'undo',
          //   render: ({key,...rest}) => <MenuItemElement key={key} icon={<Undo />} {...rest} >Undo</MenuItemElement>,
          // }),
          // new MenuItem({
          //   name: 'redo',
          //   render: ({ key, ...rest }) => <MenuItemElement key={key} icon={<Redo />} {...rest}>Redo</MenuItemElement>,
          // }),
          new Seperator(),
          new MenuItem({
            name: 'find',
            render: ({ key, ...rest }) => {
              const dispatch = useDispatch();
              return <MenuItemElement key={key} {...rest} onClick={() => dispatch.settings.setShowSearch(true)}>
                Find
              </MenuItemElement>
            },
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
            icon: <Cpu />,
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
            icon: <Archive />,
            content: <LogsPanel />,
          }),
          windowButton({
            name: 'playControls',
            id: 'playControls',
            title: 'Play Controls',
            icon: <Play />,
            content: <PlayPanel />,
          }),
          windowButton({
            name: 'legend',
            id: 'legend',
            title: 'Legend',
            content: <Legend />,
          }),
          windowButton({
            name: 'alignment',
            id: 'alignment',
            title: 'Alignment + Distribution',
            content: <AlignmentPanel />,
          }),
          windowButton({
            name: 'debugger',
            id: 'debugger',
            title: 'Debugger',
            content: <DebugPanel />,
          }),
          windowButton({
            name: 'settings',
            id: 'settings',
            title: 'Settings',
            icon: <SettingsIcon />,
            content: <Settings />,
          }),
          windowButton({
            name: 'dropPanel',
            id: 'dropPanel',
            title: 'Nodes',
            content: <DropPanel />,
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
                <MenuItemElement icon={<Download />} onClick={saveLayout} {...rest}>
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
                <MenuItemElement icon={<Upload />} onClick={loadLayout} {...rest}>
                  Load Layout
                </MenuItemElement>
              );
            },
          }),
        ],
      }),
    ],
  });
