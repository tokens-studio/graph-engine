import { Box, Stack, Text, Tooltip } from '@tokens-studio/ui';
import { Position, Handle as RawHandle } from 'reactflow';
import { styled } from '@/lib/stitches/index.js';
import { useIsValidConnection } from '../../hooks/useIsValidConnection.js';
import React, { createContext, useContext } from 'react';

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
  isSmall,
  className,
}: HolderProps) => {
  if (shouldHide) return null;
  const position = type === 'source' ? Position.Right : Position.Left;
  return (
    <HandleContext.Provider value={{ type, position }}>
      <Stack
        direction="column"
        css={{
          flexBasis: full ? '100%' : '50%',
          position: 'relative',
          textAlign: type === 'source' ? 'right' : 'left',
          minWidth: isSmall ? 'auto' : '150px',
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

const StyledRawHandle = styled(RawHandle, {
  variants: {
    error: {
      true: {
        '&': {
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
      false: {
        background: 'var(--colors-graphBg) !important',
      },
    },

    variant: {
      array:{
        borderRadius: '0 !important',
        width: 'calc($4 - 2px) !important',
        height: 'calc($4 - 2px) !important',
      },
      message:{
        borderRadius: '0 !important',
        width: 'calc($4 - 2px) !important',
        height: 'calc($4 - 2px) !important',
        transform : 'rotate(45deg)',
        '&:after':{
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '2px',
          height: '2px',
          borderRadius: '50%',
        }
      }
    },
    shouldHideHandles: {
      true: {
        pointerEvents: 'none',
        display: 'none',
      },
    },
    variadic: {
      true: {
        svg: {
          marginTop: 'auto',
        },
        '&::after': {
          position: 'absolute',
          content: '',
          marginRight: '0',
          marginTop: '0',
          height: '8px',
          width: '8px',
          background: 'var(--colors-accentOnAccent)',
          borderRadius: '50%',
          opacity: 0.7,
        },
      },
    },
  },
});

export const HandleText = styled(Text, {
  fontSize: '$xxsmall',
  color: '$fgDefault',
  whiteSpace: 'nowrap',
  variants: {
    secondary: {
      true: {
        color: '$fgDefault',
      },
    },
    caseSensitive: {
      true: {
        textTransform: 'none',
      },
    },
  },
});

const HandleHolder = styled(Box, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: '$2 $4',
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

export interface HandleProps {
  id: string;
  children?: React.ReactNode;
  visible: boolean;
  shouldHideHandles?: boolean;
  error?: boolean;
  variant?: 'array' | 'message';
  isConnected?: boolean;
  color?: string;
  backgroundColor?: string;
  //Inline typing info
  type?: string;
  variadic?: boolean;
}

export const Handle = (props: HandleProps) => {
  const {
    id,
    children,
    visible,
    shouldHideHandles = false,
    error,
    color,
    variant,
    type: dataType,
    isConnected,
    backgroundColor,
    variadic,
  } = props;
  const { position, type } = useHandle();
  const isValidConnection = useIsValidConnection();
  const { collapsed } = useContext(HandleContainerContext);

  const shouldHide = !visible;

  return (
    <HandleHolder
      collapsed={collapsed || shouldHide}
      css={{
        flexDirection: type === 'target' ? 'row' : 'row-reverse',
      }}
    >
      <Tooltip label={dataType} side="top">
        <StyledRawHandle
          style={{
            color: color,
            backgroundColor: backgroundColor,
            outlineColor: backgroundColor,
          }}
          id={id}
          shouldHideHandles={shouldHideHandles}
          error={error}
          type={type}
          position={position}
          hide={shouldHide}
          variadic={variadic}
          isValidConnection={isValidConnection}
          isConnected={isConnected}
          variant={variant}
        ></StyledRawHandle>
      </Tooltip>
      <Stack
        gap={1}
        align="center"
        css={{
          flex: 1,
          justifyContent: type === 'target' ? 'start' : 'end',
          paddingLeft: shouldHideHandles ? 0 : '$2',
          paddingRight: shouldHideHandles ? 0 : '$2',
          fontFamily: '$mono',
          fontSize: '$xxsmall',
          flexDirection: type === 'target' ? 'row' : 'row-reverse',
        }}
      >
        {children}
      </Stack>
    </HandleHolder>
  );
};
