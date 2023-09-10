import * as MenubarPrimitive from '@radix-ui/react-menubar';
import {
  ChevronRightIcon,
  FloppyDiscIcon,
  FolderIcon,
  GridMasonryIcon,
  MoonIcon,
  SunIcon,
} from '@iconicicons/react';
import SlackIcon from '#/assets/svgs/slack.svg';
import YoutubeIcon from '#/assets/svgs/youtube.svg';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { currentTab as currentTabSelector } from '#/redux/selectors/index.ts';
import { useDispatch } from '#/hooks/useDispatch.ts';
import { CodeEditorRef } from '#/service/refs.ts';
import { ResolverData } from '#/types/file.ts';
import Logo from '#/assets/svgs/tokensstudio-logo.svg';
import { IconButton, Stack, Text } from '@tokens-studio/ui';
import { toPng } from 'html-to-image';
import { getRectOfNodes, getTransformForBounds } from 'reactflow';
import {
  Content,
  Item,
  RightSlot,
  Root,
  Seperator,
  SubContent,
  SubTrigger,
  Trigger,
} from './components.tsx';
import { useTheme } from '#/hooks/useTheme.tsx';
import { serviceRef } from '#/redux/selectors/refs.ts';
import { DockLayout, PanelData } from 'rc-dock';
import { v4 as uuidv4 } from 'uuid';
import { EditorDockTab, EditorTab } from '../editor/index.tsx';
import Link from 'next/link';
import { store } from '#/redux/store.tsx';

const imageWidth = 1024;
const imageHeight = 768;

export const Menubar = () => {
  const dispatch = useDispatch();
  const currentTab = useSelector(currentTabSelector);
  const theme = useTheme();
  const dockRef: DockLayout | undefined = useSelector(serviceRef('dock'));

  const findCurrentEditor = useCallback(() => {
    // if (!dockRef) {
    //   return;
    // }

    // const graphs = dockRef.find('graphs') as PanelData;
    // if (!graphs) {
    //   return;
    // }

    // //Get the current activeID
    // const id = graphs.activeId;

    // if (!id) {
    //   return;
    // }
    const activeEditor = store.getState().refs['1']
    console.log("Store is", activeEditor)

    return activeEditor;
  }, []);

  const onSave = useCallback(() => {
    const editor = findCurrentEditor();
    if (!editor) {
      return;
    }
    const { nodes, nodeState, ...rest } = editor.current.save();

    const finalState = nodes.reduce((acc, node) => {
      acc[node.id] = nodeState[node.id];
      return acc;
    }, {});

    const fileContent = JSON.stringify({
      nodes,
      ...rest,
      state: finalState,
      code: CodeEditorRef.current?.textContent,
    });

    const blob = new Blob([fileContent], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${editor.meta.name}.json`;
    document.body.appendChild(link);
    link.click();

    // Clean up the URL and link
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, [findCurrentEditor]);

  const onLoad = useCallback(() => {
    const editor = findCurrentEditor();
    if (!editor) {
      return;
    }
    // create an input element
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', function (event) {
      //@ts-ignore
      const files = event?.target?.files;
      const file = files[0];

      // do something with the file, like reading its contents
      const reader = new FileReader();
      reader.onload = function () {
        const resolver = JSON.parse(reader.result as string) as ResolverData;

        const { state, code, nodes, edges } = resolver;
        //TODO , this needs a refactor. We need to wait for the clear to finish
        // as the nodes still get one final update by the dispatch before they are removed which
        // causes nulls to occur everywhere. They need to be unmounted
        setTimeout(() => {
          // if (code !== undefined) {
          //     setTheCode(code);
          // }

          editor.current.load({
            nodes,
            edges,
            nodeState: state,
          });
        }, 0);
      };
      reader.readAsText(file);
    });

    // simulate a click on the input element to trigger the file picker dialog
    input.click();
  }, [findCurrentEditor]);

  const onPrint = useCallback(async () => {
    function downloadImage(dataUrl) {
      const a = document.createElement('a');
      a.setAttribute('download', 'reactflow.png');
      a.setAttribute('href', dataUrl);
      a.click();
    }

    const editor = findCurrentEditor();
    if (!editor) {
      return;
    }

    const reactFlow = editor.current.getFlow();

    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(reactFlow.getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0,
      Infinity,
    );

    toPng(
      document.querySelector(
        `#${currentTab.id} .react-flow__viewport`,
      ) as HTMLElement,
      {
        backgroundColor: '#1a365d',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: '' + imageWidth,
          height: '' + imageHeight,
          transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
        },
      },
    ).then(downloadImage);
  }, [currentTab.id, findCurrentEditor]);

  const toggleTheme = useCallback(() => dispatch.ui.toggleTheme(null), []);
  const onNewGraph = useCallback(() => {
    if (!dockRef) {
      return;
    }

    const id: string = uuidv4();
    const title = 'New Tab';

    dispatch.graph.setGraphState({
      id,
      title,
    });

    dockRef.dockMove(
      {
        cached: true,
        closable: true,
        id: id,
        title: <EditorDockTab id={id} />,
        content: <EditorTab id={id} name={title} />,
      },
      'graphs',
      'middle',
    );
  }, [dispatch.graph, dockRef]);

  // on mount call onNewGraph
  useEffect(() => {
    onNewGraph();
  }, [onNewGraph]);

  return (
    <Stack direction="column" gap={2} css={{ position: 'fixed', bottom: '$3', left: '$3', backgroundColor: '$bgDefault', padding: '$1', border: '1px solid $borderSubtle', borderRadius: '$medium', boxShadow: '$small', zIndex: 100 }}>
      <IconButton tooltip="Load .json" variant="invisible" size="medium" icon={<FolderIcon />} onClick={onLoad} disabled={!currentTab} />
      <IconButton tooltip="Save as .json" variant="invisible" size="medium" icon={<FloppyDiscIcon />} onClick={onSave} disabled={!currentTab} />
      <IconButton
        variant="invisible"
        tooltip={theme === 'light' ? 'Dark mode' : 'Light mode'}
        size="medium"
        icon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleTheme}
      />
    </Stack>
  );
};
