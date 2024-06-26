import { Box, Stack, Text } from '@tokens-studio/ui';
import { Position, Handle as RawHandle } from 'reactflow';
import { styled } from '@/lib/stitches/index.js';
import { useIsValidConnection } from '../../hooks/useIsValidConnection.js';
import React, { createContext, useContext } from 'react';
import { IconoirProvider } from 'iconoir-react';

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
  onConnect?: (params: any) => void;
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
  className
}: HolderProps) => {
  if (shouldHide) return null;
  const position = type === 'source' ? Position.Right : Position.Left;
  return (
    <HandleContext.Provider value={{ type, position }}>
      <Stack
        direction="column"
        gap={2}
        css={{ flexBasis: full ? '100%' : '50%', position: 'relative', textAlign: type === 'source' ? 'right' : 'left', minWidth: isSmall ? 'auto' : '250px' }}
        className={className}
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
      true: {
        background: 'var(--colors-accentEmphasis) !important',
      },
    },
    left: {
      true: {
        marginLeft: '6px',
      },
      false: {
        marginRight: '6px',
      },
    },
    shouldHideHandles: {
      true: {
        pointerEvents: 'none',
        display: 'none',
      },
    },
    variadic: {
      true: {
        'svg': {
          marginTop: 'auto',
        },
        '&::after': {
          content: "",
          marginRight: "-24px",
          marginTop: "-52px",
          height: "8px",
          width: "8px",
          background: "var(--colors-accentOnAccent)",
          borderRadius: "50%",
          opacity: 0.7,
        },
      },
    }
  },
});

export const HandleText = styled(Text, {
  textTransform: 'uppercase',
  fontWeight: 'bold',
  fontSize: '$xxsmall',
  color: '$accentDefault',
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
  children: React.ReactNode;
  visible: boolean;
  shouldHideHandles?: boolean;
  error?: boolean;
  isArray?: boolean;
  full?: boolean;
  color?: string;
  backgroundColor?: string;
  icon: React.ReactNode;
  variadic?: boolean;
};

export const Handle = (props: HandleProps) => {
  const {
    id,
    children,
    visible,
    shouldHideHandles = false,
    error,
    full,
    color,
    isArray,
    backgroundColor,
    icon,
    variadic,
    ...rest
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
        <StyledRawHandle
          style={{ color: color, backgroundColor: backgroundColor }}
          id={id}
          shouldHideHandles={shouldHideHandles}
          error={error}
          left={type === 'target'}
          type={type}
          position={position}
          hide={shouldHide}
          variadic={variadic}
          isValidConnection={isValidConnection}
        >

          <IconoirProvider
            iconProps={{
              strokeWidth: 1.5,
              width: '1.5em',
              height: '1.5em',
            }}
          >{icon}</IconoirProvider>
        </StyledRawHandle>

        <Stack
          direction="row"
          gap={1}
          align="center"
          css={{
            flex: 1,
            justifyContent: type === 'target' ? 'start' : 'end',
            paddingLeft: shouldHideHandles ? 0 : '$2',
            paddingRight: shouldHideHandles ? 0 : '$2',
            fontFamily: '$mono',
            fontSize: '$xxsmall',
          }}
        >
          {children}
        </Stack>
    </HandleHolder>
  );
};
