import { ChatBubbleQuestion } from 'iconoir-react';
import { DropdownMenu, IconButton, Tooltip } from '@tokens-studio/ui';
import React from 'react';

export const HelpDropdown = () => (
  <DropdownMenu>
    <Tooltip label="Help" side="bottom">
      <DropdownMenu.Trigger asChild>
        <IconButton emphasis="low" icon={<ChatBubbleQuestion />} />
      </DropdownMenu.Trigger>
    </Tooltip>
    <DropdownMenu.Portal>
      <DropdownMenu.Content css={{ minWidth: '200px' }}>
        <a
          href="https://tokensstudio.featurebase.app/?b=664d1020ebad3462b914aecb"
          target="_blank"
          rel="noreferrer"
        >
          <DropdownMenu.Item>Give Feedback / Report a Bug</DropdownMenu.Item>
        </a>
        <a
          href="https://graph.docs.tokens.studio/"
          target="_blank"
          rel="noreferrer"
        >
          <DropdownMenu.Item>Documentation</DropdownMenu.Item>
        </a>
        <a
          href="https://www.youtube.com/@TokensStudio"
          target="_blank"
          rel="noreferrer"
        >
          <DropdownMenu.Item>Youtube</DropdownMenu.Item>
        </a>
        <a href="https://tokens.studio/slack" target="_blank" rel="noreferrer">
          <DropdownMenu.Item>Slack</DropdownMenu.Item>
        </a>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu>
);
