import { Position, Handle as RawHandle } from 'reactflow';
import { Stack, Tooltip } from '@tokens-studio/ui';
import { useIsValidConnection } from '../../hooks/useIsValidConnection.js';
import React, { createContext, useContext } from 'react';
import clsx from 'clsx';
import styles from './handles.module.css';

type HandleProps = {
  id: string;
  children?: React.ReactNode;
  visible?: boolean;
  shouldHideHandles?: boolean;
  error?: boolean;
  color?: string;
  isArray?: boolean;
  type?: string;
  isConnected?: boolean;
  backgroundColor?: string;
  variadic?: boolean;
  isAnchor?: boolean;
};

export const HandleContext = createContext<{
  position: Position;
  type: 'source' | 'target';
}>({
  type: 'source',
  position: Position.Right,
});

type HolderProps = {
  type: 'source' | 'target';
  children: React.ReactNode;
  shouldHide?: boolean;
  full?: boolean;
  className?: string;
  isSmall?: boolean;
};

export const HandleContainerContext = createContext<{
  collapsed: boolean;
  hide?: boolean;
  onConnect?: (params: unknown) => void;
}>({
  collapsed: false,
  hide: false,
});

export const HandleContainer = ({
  type,
  children,
  shouldHide = false,
  full,
  className,
}: HolderProps) => {
  if (shouldHide) return null;
  const position = type === 'source' ? Position.Right : Position.Left;
  return (
    <HandleContext.Provider value={{ type, position }}>
      <Stack
        direction="column"
        style={{
          flexBasis: full ? '100%' : '50%',
          position: 'relative',
          textAlign: type === 'source' ? 'right' : 'left',
        }}
        className={className}
      >
        {children}
      </Stack>
    </HandleContext.Provider>
  );
};

export const useHandle = () => {
  return useContext(HandleContext);
};

export const Handle = (props: HandleProps) => {
  const {
    id,
    children,
    visible,
    shouldHideHandles = false,
    error,
    color,
    isArray,
    type: dataType,
    backgroundColor,
    variadic,
    isAnchor,
  } = props;
  const { position, type } = useHandle();
  const isValidConnection = useIsValidConnection();
  const { collapsed } = useContext(HandleContainerContext);

  const shouldHide = !visible;

  const handleClasses = clsx(styles.rawHandle, {
    [styles.error]: error,
    [styles.hide]: shouldHide,
    [styles.isArray]: isArray,
    [styles.shouldHideHandles]: shouldHideHandles,
    [styles.variadic]: variadic,
  });

  const holderClasses = clsx(styles.handleHolder, {
    [styles.collapsed]: collapsed || shouldHide,
    [styles.isAnchor]: isAnchor,
  });

  return (
    <div
      className={holderClasses}
      style={{
        flexDirection: type === 'target' ? 'row' : 'row-reverse',
      }}
    >
      <Tooltip label={dataType} side="top">
        <RawHandle
          className={handleClasses}
          style={{
            color: color,
            backgroundColor: backgroundColor,
            outlineColor: backgroundColor,
          }}
          id={id}
          type={type}
          position={position}
          isValidConnection={isValidConnection}
        />
      </Tooltip>
      <Stack
        gap={1}
        align="center"
        style={{
          flex: 1,
          justifyContent: type === 'target' ? 'start' : 'end',
          paddingLeft: shouldHideHandles ? 0 : 'var(--component-spacing-2xs)',
          paddingRight: shouldHideHandles ? 0 : 'var(--component-spacing-2xs)',
          fontFamily: 'var(--fonts-mono)',
          fontSize: 'var(--fontSizes-xxsmall)',
          flexDirection: type === 'target' ? 'row' : 'row-reverse',
        }}
      >
        {children}
      </Stack>
    </div>
  );
};
