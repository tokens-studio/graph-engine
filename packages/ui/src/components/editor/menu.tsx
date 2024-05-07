
import { Book, FloppyDiskArrowIn } from 'iconoir-react';
import {
    MenuItemElement,
    defaultMenuDataFactory,
    MenuItem,
    SubMenu,
    windowButton,
    Seperator,
    graphEditorSelector,
    ImperativeEditorRef,
} from '@tokens-studio/graph-editor';
import React from 'react';
import YoutubeIcon from '@/assets/svgs/youtube.svg';
import SlackIcon from '@/assets/svgs/slack.svg';
import { FsPanel } from '../panels/fs.tsx';
import { CodePanel } from '../panels/codeEditor.tsx';
import { RemoteStoragePanel } from '../panels/remoteStorage.tsx';
import { PermutatorPanel } from '../panels/permutator.tsx';
import { GraphService } from '@/api/index.ts';
import { WebsocketPanel } from '../panels/websocket.tsx';
import { useSelector } from 'react-redux';

export const menu = defaultMenuDataFactory();


const file = menu.items.find((x) => x.name === 'file');

if (!file) {
    throw new Error('File menu not found');
}

file.items.push(
    new Seperator());

file.items.push(
    new MenuItem({
        name: 'save',
        render: function FileLoad(rest) {

            const graphRef = useSelector(
                graphEditorSelector,
            ) as (ImperativeEditorRef | undefined);


            const onSave = () => {
                const saved = graphRef!.save();

                const id = saved.annotations['engine.id'];
                GraphService.updateGraph({
                    graphId: id,
                    requestBody: saved
                });
            };

            return (
                <MenuItemElement onClick={onSave} icon={<FloppyDiskArrowIn />} {...rest}>
                    <u>S</u>ave
                </MenuItemElement>
            );
        },
    }),
);


const windows = menu.items.find((x) => x.name === 'window');

if (!windows) {
    throw new Error('Window menu not found');
}
windows.items.push(
    windowButton({
        name: 'files',
        id: 'files',
        title: 'Files',
        content: <FsPanel />,
    })
);
windows.items.push(
    windowButton({
        name: 'code',
        id: 'code',
        title: 'Code Editor',
        content: <CodePanel />,
    })
);
windows.items.push(
    windowButton({
        name: 'remoteStorage',
        id: 'remoteStorage',
        title: 'Remote Storage',
        content: <RemoteStoragePanel />,
    })
);

windows.items.push(
    windowButton({
        name: 'permutator',
        id: 'permutator',
        title: 'Permutations',
        content: <PermutatorPanel />,
    })
);

windows.items.push(
    windowButton({
        name: 'websocket',
        id: 'websocket',
        title: 'Websocket',
        content: <WebsocketPanel />,
    })
);





menu.items.push(
    new SubMenu({
        name: 'about',
        title: 'About',
        items: [
            new MenuItem({
                name: 'docs',
                render: (rest) => (
                    <MenuItemElement icon={< Book />} {...rest} >
                        <a
                            href="https://docs.graph.tokens.studio/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Documentation
                        </a>
                    </MenuItemElement>
                ),
            }),
            new Seperator(),
            new MenuItem({
                name: 'youtube',
                render: (rest) => (
                    <MenuItemElement icon={< YoutubeIcon />} {...rest} >
                        <a
                            href="https://www.youtube.com/@TokensStudio"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Youtube
                        </a>
                    </MenuItemElement>
                ),
            }),
            new MenuItem({
                name: 'slack',
                render: (rest) => (
                    <MenuItemElement icon={< SlackIcon />} {...rest} >
                        <a
                            href="https://tokens.studio//slack"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Slack
                        </a>
                    </MenuItemElement>
                ),
            }),
        ],
    }),
);

