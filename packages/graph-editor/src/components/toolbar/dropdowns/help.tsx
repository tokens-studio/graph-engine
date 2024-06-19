import React from 'react';
import {
  Button,
  DropdownMenu,
  Text
} from '@tokens-studio/ui';
import { LayoutLeft, Plus, NavArrowRight, ChatBubbleQuestion } from 'iconoir-react';

export const HelpDropdown = () => (
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <Button variant='invisible' style={{ paddingLeft: '0', paddingRight: '0' }}>
        <ChatBubbleQuestion />
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content css={{ minWidth: '200px' }}>
        <DropdownMenu.Item>
          <a
            href="https://tokensstudio.featurebase.app/?b=664d1020ebad3462b914aecb"
            target="_blank"
            rel="noreferrer"
          >
            Give Feedback / Report a Bug
          </a>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <a
            href="https://docs.graph.tokens.studio/"
            target="_blank"
            rel="noreferrer"
          >
            Documentation
          </a>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <a
            href="https://www.youtube.com/@TokensStudio"
            target="_blank"
            rel="noreferrer"
          >
            Youtube
          </a>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <a
            href="https://tokens.studio//slack"
            target="_blank"
            rel="noreferrer"
          >
            Slack
          </a>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu>
);
