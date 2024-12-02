// .storybook/preview.tsx
import React from 'react';
import { Decorator } from '@storybook/react';
import { createTheme, styled } from '../src/lib/stitches/index';
import { darkTheme } from '@tokens-studio/tokens';
import { Tooltip } from '@tokens-studio/ui';
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

import '../src/index.scss';

const darkThemeMode = createTheme('dark-theme', {
  colors: darkTheme.colors,
  shadows: darkTheme.shadows,
});

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

const StyledThemeBlock = styled('div', {
  position: 'absolute',
  top: 0,
  right: 0,
  height: '100%',
  width: '50%',
  bottom: 0,
  overflow: 'auto',
  background: 'var(--color-neutral-canvas-minimal-bg)',
  display: 'flex',
  variants: {
    fill: {
      true: {
        left: 0,
        width: '100%',
      },
      false: {
        left: '50%',
      },
    },
    left: {
      true: {
        borderRight: '1px solid #202020',
        right: '50%',
        left: 0,
      },
    },
  },
});

const StyledInner = styled('div', {
  padding: '1rem',
  display: 'flex',
  alignItems: 'flex-start',
  width: '100%',
});

const ThemeBlock = ({ children, ...props }) => {
  return (
    <StyledThemeBlock {...props}>
      <StyledInner>{children}</StyledInner>
    </StyledThemeBlock>
  );
};

const Wrapper = ({ children }) => (
  <ReduxProvider>
    <Tooltip.Provider>{children}</Tooltip.Provider>
  </ReduxProvider>
);

const withTheme: Decorator = (StoryFn, context) => {
  const theme = context.parameters.theme || context.globals.theme;

  if (context.viewMode === 'docs') {
    return (
      <Wrapper>
        <StoryFn />
      </Wrapper>
    );
  }

  switch (theme) {
    case 'side-by-side': {
      return (
        <Wrapper>
          <ThemeBlock left>
            <StoryFn />
          </ThemeBlock>
          <ThemeBlock className={darkThemeMode}>
            <StoryFn />
          </ThemeBlock>
        </Wrapper>
      );
    }
    default: {
      return (
        <Wrapper>
          <ThemeBlock fill className={theme === 'dark' ? darkThemeMode : ''}>
            <StoryFn />
          </ThemeBlock>
        </Wrapper>
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
