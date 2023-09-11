import { Box, Stack } from '@tokens-studio/ui';
import { Position, Handle as RawHandle } from 'reactflow';
import { styled } from '#/lib/stitches/index.ts';
import { useIsValidConnection } from './nodes/hooks/useIsValidConnection.ts';
import { useNode } from './wrapper/nodeV2.tsx';
import React, { createContext, useContext } from 'react';
import './handles.module.css';

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
  full?: boolean;
};

export const HandleContainerContext = createContext<{
  collapsed: boolean;
  hide?: boolean;
  onConnect?: (params: any) => void;
}>({
  collapsed: false,
  hide: false,
});

export const HandleContainer = ({ type, children, full }: HolderProps) => {
  const position = type === 'source' ? Position.Right : Position.Left;
  return (
    <HandleContext.Provider value={{ type, position }}>
      <Stack
        direction="column"
        gap={1}
        css={{ flexBasis: full ? '100%' : '50%', position: 'relative' }}
      >
        {children}
      </Stack>
    </HandleContext.Provider>
  );
};

const useHandle = () => {
  return useContext(HandleContext);
};

const StyledRawHandle = styled(RawHandle, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1em !important',
  height: '1em !important',
  background: 'transparent !important',
  border: 'none !important',
  '&::after': {
    content: "''",
    width: '3px',
    height: '9px',
    border: '1px solid var(--colors-accentBorder)',
    background: 'var(--colors-accentEmphasis)',
    borderRadius: '2px',
    flexShrink: 0,
    opacity: 1,
  },
  variants: {
    error: {
      true: {
        '&::after': {
          background: 'var(--colors-dangerFg)',
          borderColor: 'var(--colors-dangerBorder)',
        },
      },
    },
    hide: {
      true: {
        opacity: 0,
      },
    },
    isConnected: {
      true: {
        background: 'var(--colors-accentEmphasis) !important',
      },
    },
    left: {
      true: {
        marginLeft: '4px',
      },
      false: {
        marginRight: '4px',
      },
    },
  },
  '&:hover': {
    '&::after': {
      opacity: 1,
      width: '12px',
      height: '12px',
    },
  },
});

const HandleHolder = styled(Box, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',

  variants: {
    collapsed: {
      true: {
        height: 0,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
      },
      false: {
        minHeight: '1em',
      },
    },
  },
});

export const Handle = (props) => {
  const { children, error, ...rest } = props;
  const { position, type } = useHandle();
  const isValidConnection = useIsValidConnection();
  const { collapsed, hide } = useContext(HandleContainerContext);
  const { onConnect } = useNode();

  return (
    <HandleHolder collapsed={collapsed}>
      <StyledRawHandle
        error={error}
        left={type === 'target'}
        isConnected={isValidConnection}
        type={type}
        position={position}
        data={{ eg: '1' }}
        hide={hide}
        isValidConnection={isValidConnection}
        {...rest}
        onConnect={onConnect}
      />
      <Stack
        direction="row"
        gap={4}
        justify="between"
        align="center"
        css={{ flex: 1 }}
      >
        {children}
      </Stack>
    </HandleHolder>
  );
};
