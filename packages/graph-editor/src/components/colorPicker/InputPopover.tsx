import * as Popover from '@radix-ui/react-popover';
import { Xmark } from 'iconoir-react';
import React from 'react';
import styles from './InputPopover.module.css';

interface IInputPopover {
  children: React.ReactNode;
  trigger: React.ReactNode;
  defaultOpen?: boolean;
}

const InputPopover = ({
  defaultOpen = false,
  children,
  trigger,
}: IInputPopover) => (
  <Popover.Root defaultOpen={defaultOpen}>
    <Popover.Trigger asChild>{trigger}</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content className={styles.popoverContent} sideOffset={5}>
        {children}
        <Popover.Close className={styles.popoverClose} aria-label="Close">
          <Xmark />
        </Popover.Close>
        <Popover.Arrow className={styles.popoverArrow} />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

export default InputPopover;
