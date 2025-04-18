// .storybook/preview.tsx
import React from 'react';
import { Decorator } from '@storybook/react';
import { ReduxProvider } from '../src/redux/index.js';
import {
  Title,
  DocsContainer,
  Subtitle,
  Description,
  Primary,
  Controls,
  Stories,
} from '@storybook/blocks';
import clsx from 'clsx';

import '../src/index.scss';
import styles from './preview.module.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    container: ({ children, context }) => (
      <DocsContainer context={context}>{children}</DocsContainer>
    ),
    page: () => (
      <>
        <Title />
        <Subtitle />
        <Description />
        <Primary />
        <Controls />
        <Stories />
      </>
    ),
  },
};

const ThemeBlock = ({ children, fill, left, ...props }) => {
  return (
    <div
      className={clsx(styles.themeBlock, {
        [styles.fill]: fill,
        [styles.left]: left,
      })}
      {...props}
    >
      <div className={styles.inner}>{children}</div>
    </div>
  );
};

const withTheme: Decorator = (StoryFn, context) => {
  const theme = context.parameters.theme || context.globals.theme;

  if (context.viewMode === 'docs') {
    return (
      <ReduxProvider>
        <StoryFn />
      </ReduxProvider>
    );
  }

  switch (theme) {
    case 'side-by-side': {
      return (
        <ReduxProvider>
          <div className={styles.left}>
            <StoryFn />
          </div>
          <div className={styles.right}>
            <StoryFn />
          </div>
        </ReduxProvider>
      );
    }
    default: {
      return (
        <ReduxProvider>
          <div className={styles.fill}>
            <StoryFn />
          </div>
        </ReduxProvider>
      );
    }
  }
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      // The icon for the toolbar item
      icon: 'contrast',
      // Array of options
      items: [
        { value: 'light', icon: 'circlehollow', title: 'light' },
        { value: 'dark', icon: 'circle', title: 'dark' },
        { value: 'side-by-side', icon: 'sidebar', title: 'side by side' },
      ],
      // Property that specifies if the name of the item will be displayed
    },
  },
};

// export all decorators that should be globally applied in an array
export const decorators = [withTheme];
