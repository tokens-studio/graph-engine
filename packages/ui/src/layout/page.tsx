import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { GlobalState } from '@/mobx/index.tsx';

const PageLayout = observer(
  ({
    theme,
    children,
  }: {
    children: React.ReactNode;
    theme: GlobalState['ui']['theme'];
  }) => {
    const theTheme = theme.get();
    useEffect(() => {
      if (theTheme) {
        document.body.className = theTheme + '-theme';
      }
    }, [theTheme]);
    return <>{children}</>;
  },
);

export default PageLayout;
