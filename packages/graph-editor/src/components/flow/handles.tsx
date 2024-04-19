import { Box, Stack, Text } from '@tokens-studio/ui';
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
}: HolderProps) => {
  if (shouldHide) return null;
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
  width: '12px !important',
  height: '12px !important',
  background: 'transparent !important',
  border: 'none !important',
  '&::after': {
    // content: "''",
    // border: '1px solid var(--colors-accentBorder)',
    // background: 'var(--colors-accentEmphasis)',
    // borderRadius: '2px',
    // flexShrink: 0,
    // opacity: 1,
    // width: '12px',
    // height: '12px',
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

export const DynamicValueText = styled(Text, {
  padding: '$1 $2',
  fontFamily: 'monospace',
  fontSize: '$xxsmall',
  borderRadius: '$small',
  backgroundColor: '$accentBg',
  color: '$accentDefault',
  lineHeight: 1,
  whiteSpace: 'nowrap',
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
  const {
    children,
    visible,
    shouldHideHandles = false,
    error,
    array,
    full,
    color,
    icon,
    ...rest
  } = props;
  const { position, type } = useHandle();
  const isValidConnection = useIsValidConnection();
  const { collapsed } = useContext(HandleContainerContext);

  const shouldHide = !visible;

  return (
    <HandleHolder collapsed={collapsed || shouldHide}>
      <StyledRawHandle
        css={{
          background: `${color} !important`,
          color: `${color} !important`,
          borderRadius: !array ? '100%' : '0px !important',
        }}
        shouldHideHandles={shouldHideHandles}
        error={error}
        left={type === 'target'}
        isConnected={isValidConnection}
        type={type}
        position={position}
        hide={shouldHide}
        isValidConnection={isValidConnection}
        {...rest}
      >
        {icon && (
          <Stack
            justify="center"
            align="center"
            css={{
              color: 'white',
              pointerEvents: 'none',
              background: '$bgDefault',
              borderRadius: !array ? '100%' : '0px !important',
              border: '1px solid $borderDefault',
              width: '24px',
              height: '24px',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            {icon}
          </Stack>
        )}
      </StyledRawHandle>

      <Stack
        direction="row"
        gap={2}
        justify={full ? 'between' : type === 'target' ? 'start' : 'end'}
        align="center"
        css={{
          flex: 1,
          paddingLeft: shouldHideHandles ? 0 : '$3',
          paddingRight: shouldHideHandles ? 0 : '$3',
        }}
      >
        {children}
      </Stack>
    </HandleHolder>
  );
};
