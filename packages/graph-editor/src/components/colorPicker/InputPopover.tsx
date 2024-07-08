import * as Popover from '@radix-ui/react-popover';
import { Xmark } from 'iconoir-react';
import { keyframes, styled } from '@/lib/stitches/index.js';
import React from 'react';

interface IInputPopover {
  children: React.ReactNode;
  trigger: React.ReactNode;
  defaultOpen?: boolean;
}

const InputPopover: React.FC<IInputPopover> = ({
  defaultOpen = false,
  children,
  trigger,
}) => (
  <Popover.Root defaultOpen={defaultOpen}>
    <Popover.Trigger asChild>{trigger}</Popover.Trigger>
    <Popover.Portal>
      <PopoverContent sideOffset={5}>
        {children}
        <PopoverClose aria-label="Close">
          <Xmark />
        </PopoverClose>
        <PopoverArrow />
      </PopoverContent>
    </Popover.Portal>
  </Popover.Root>
);

const slideAnimation = keyframes({
  '0%': { opacity: 0, transform: 'translate(0, 2px)' },
  '100%': { opacity: 1, transform: 'translate(0, 0)' },
});

const PopoverContent = styled(Popover.Content, {
  borderRadius: '$medium',
  border: '1px solid $borderSubtle',
  padding: '$3',
  width: 300,
  backgroundColor: '$bgDefault',
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  animationDuration: '400ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  animationName: slideAnimation,
  willChange: 'transform, opacity',
  '&:focus': {
    boxShadow: `hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px, 0 0 0 2px $colors$borderFocus`,
  },
});

const PopoverArrow = styled(Popover.Arrow, {
  fill: '$bgDefault',
});

const PopoverClose = styled(Popover.Close, {
  all: 'unset',
  cursor: 'pointer',
  fontFamily: 'inherit',
  borderRadius: '100%',
  height: 25,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$fgDefault',
  position: 'absolute',
  top: 5,
  right: 5,
});

export default InputPopover;