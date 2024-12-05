import * as HoverCard from '@radix-ui/react-hover-card';
import { Heading, Stack, Text } from '@tokens-studio/ui';
import React from 'react';
import styles from './NodeHoverCard.module.css';

interface INodeHoverCard {
  children: React.ReactNode;
  title?: string;
  description?: string;
  docs?: string;
  icon?: React.ReactNode | string;
  isDragging?: boolean;
}

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
        <HoverCard.Content
          className={styles.hoverCardContent}
          side="right"
          sideOffset={5}
        >
          <Stack direction="column" gap={3}>
            <Stack direction="row" gap={2} align="center">
              {icon}
              <Heading className={styles.heading}>{title}</Heading>
            </Stack>
            <Text size="small" muted className={styles.description}>
              {description}
            </Text>
            {docs ? (
              <Text size="xsmall">
                <a href={docs} target="_blank" className={styles.styledLink}>
                  Read more
                </a>
              </Text>
            ) : null}
          </Stack>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export { NodeHoverCard };
