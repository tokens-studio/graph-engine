
import { Book } from 'iconoir-react';
import {
    MenuItem,
    MenuItemElement,
    Seperator,
    SubMenu,
    defaultMenuDataFactory,

} from '@tokens-studio/graph-editor';
import Image from 'next/image.js';
import React from 'react';
import SlackIcon from '@/assets/svgs/slack.svg';
import YoutubeIcon from '@/assets/svgs/youtube.svg';

export const menu = defaultMenuDataFactory();


const file = menu.items.find((x) => x.name === 'file');

if (!file) {
    throw new Error('File menu not found');
}

file.items.push(
    new Seperator());


const windows = menu.items.find((x) => x.name === 'window');

if (!windows) {
    throw new Error('Window menu not found');
}



menu.items.push(
    new SubMenu({
        name: 'about',
        title: 'About',
        items: [
            new MenuItem({
                name: 'docs',
                render: ({ key, ...rest }) => (
                    <MenuItemElement key={key} icon={< Book />} {...rest} >
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
                render: ({ key, ...rest }) => (
                    <MenuItemElement key={key} icon={<Image src={YoutubeIcon} />} {...rest} >
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
                render: ({ key, ...rest }) => (
                    <MenuItemElement key={key} icon={<Image src={SlackIcon} />} {...rest} >
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

