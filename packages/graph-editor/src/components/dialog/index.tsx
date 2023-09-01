import * as DialogPrimitive from '@radix-ui/react-dialog';
import { CloseIcon } from '@iconicicons/react';
import { IconButton } from '@tokens-studio/ui';
import { keyframes, styled } from '#/lib/stitches/index.ts';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';

const overlayShow = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const contentShow = keyframes({
  from: {
    opacity: 0,
    transform: 'translate(-50%, -48%) scale(0.96)',
  },
  to: {
    opacity: 1,
    transform: 'translate(-50%, -50%) scale(1)',
  },
});

export const Overlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: 'rgba(0, 0, 0, 0.44)',
  position: 'fixed',
  inset: 0,
  animation: `${overlayShow} 150ms cubic- bezier(0.16, 1, 0.3, 1)`,
});

export const Content = styled(DialogPrimitive.Content, {
  backgroundColor: '$bgDefault',
  borderRadius: '$medium',
  boxShadow: '$focus',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  display: 'flex',
  gap: '$5',
  flexDirection: 'column',
  padding: '$7',
  animation: `${contentShow} 150ms cubic- bezier(0.16, 1, 0.3, 1)`,
});

const Title = styled(DialogPrimitive.Title, {
  margin: 0,
  fontWeight: 500,
  color: '$fgDefault',
  fontSize: '$large',
});

const CloseButton = () => {
  const setOpenDialog = useOpenDialog();
  return (
    <IconButton
      css={{
        position: 'absolute',
        top: '10px',
        right: '10px',
      }}
      aria-label="Close"
      onClick={() => setOpenDialog(false)}
      variant="invisible"
      icon={<CloseIcon />}
    />
  );
};

export interface IToastProviderContext {
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<IToastProviderContext>({
  setOpen: () => {
    //Noop
  },
});

type RootProps = {
  open?: boolean;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

const Root = ({ children, open, onOpenChange }: RootProps) => {
  const [isOpen, setOpen] = React.useState(open);

  useEffect(() => {
    if (open === undefined) return;
    setOpen(open || false);
  }, [open]);

  const onOpenChangeHandler = useCallback(
    (open) => {
      if (onOpenChange) {
        onOpenChange(open);
      } else {
        setOpen(open);
      }
    },
    [onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ setOpen: onOpenChangeHandler }}>
      <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChangeHandler}>
        {children}
      </DialogPrimitive.Root>
    </DialogContext.Provider>
  );
};

export const useOpenDialog = () => useContext(DialogContext).setOpen;

export const SimplePortal = ({ children }) => {
  return (
    <DialogPrimitive.Portal style={{ border: '2px solid red' }}>
      <Overlay />
      <Content>
        {children}
        <Dialog.CloseButton />
      </Content>
    </DialogPrimitive.Portal>
  );
};

export const Dialog = Object.assign(Root, {
  Trigger: DialogPrimitive.Trigger,
  Portal: DialogPrimitive.Portal,
  Close: DialogPrimitive.Close,
  CloseButton,
  SimplePortal,
  Content,
  Overlay,
  Title,
});
