import { useTheme } from '../hooks/useTheme.tsx';
import React, { useEffect } from 'react';

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  useEffect(() => {
    if (theme) document.body.className = theme + '-theme';
  }, [theme]);
  return <>{children}</>;
}
