import React from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { styled, keyframes } from '@/lib/stitches/index.ts';
import { Box, Heading, Link, Stack, Text } from '@tokens-studio/ui';

interface INodeHoverCard {
  children: React.ReactNode;
  title?: string;
  description?: string;
  docs?: string;
  icon?: React.ReactNode | string;
  isDragging?: boolean;
}

const StyledLink = styled('a', {
  color: '$accentDefault',
  textDecoration: 'none',
  fontWeight: '$sansMedium',
});

const NodeHoverCard = ({
  children,
  title,
  description,
  docs,
  icon,
  isDragging,
}: INodeHoverCard) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenChange = React.useCallback(
    (open) => {
      if (open === true) {
        if (isDragging) return;
        setIsOpen(open);
      } else {
        setIsOpen(open);
      }
    },
    [isDragging],
  );

  React.useEffect(() => {
    if (isDragging) {
      setIsOpen(false);
    }
  }, [isDragging]);

  return (
    <HoverCard.Root
      onOpenChange={handleOpenChange}
      openDelay={500}
      closeDelay={200}
      open={isOpen}
    >
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCardContent side="right" sideOffset={5}>
          <Stack direction="column" gap={3}>
            <Stack direction="row" gap={2} align="center">
              {icon}
              <Heading
                css={{
                  fontSize: '$small',
                  fontWeight: '$sansMedium',
                  color: '$fgDefault',
                }}
              >
                {title}
              </Heading>
            </Stack>
            <Text size="small" muted css={{ lineHeight: '150%' }}>
              {description}
            </Text>
            {docs ? (
              <Text size="xsmall">
                <StyledLink href={docs} target="_blank">
                  Read more
                </StyledLink>
              </Text>
            ) : null}
          </Stack>
        </HoverCardContent>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-12px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const HoverCardContent = styled(HoverCard.Content, {
  borderRadius: '$medium',
  border: '1px solid $borderSubtle',
  padding: '$5',
  width: 300,
  backgroundColor: '$bgCanvas',
  boxShadow: '$contextMenu',
  animationDuration: '200ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
});

export { NodeHoverCard };
