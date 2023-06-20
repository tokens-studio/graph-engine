import * as React from 'react';

interface ThemeContextInterface {
  state: {
    theme: string;
  };
  dispatch: React.Dispatch<any>;
}

const ThemeContext = React.createContext<ThemeContextInterface>(
  {} as ThemeContextInterface,
);

function themeReducer(state: { theme: string }, action: { type: any }) {
  switch (action.type) {
    case 'toggle': {
      return { theme: state.theme === 'light' ? 'dark' : 'light' };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const INITIAL_THEME = { theme: 'dark' };

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(
    themeReducer,
    INITIAL_THEME,
    () => {
      try {
        const item = window.localStorage.getItem('tokens_studio_theme');
        return item ? JSON.parse(item) : INITIAL_THEME;
      } catch (error) {
        return INITIAL_THEME;
      }
    },
  );

  React.useEffect(() => {
    try {
      window.localStorage.setItem('tokens_studio_theme', JSON.stringify(state));
    } catch (error) {
      //
    }
  }, [state]);

  const providerValue = React.useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeProvider, useTheme };
