import * as Accordion from "@radix-ui/react-accordion";
import { styled } from "@stitches/react";

export const StyledAccordingTrigger = styled(Accordion.Trigger, {
    display: 'flex',
    gap: '$2',
    width: '100%',
    flexDirection: 'row',
    padding: '$3',
    borderRadius: '$medium',
    border: 'none',
    alignItems: 'flex-start',
    fontWeight: '$sansBold',
    fontSize: '$small',
    '&:not(:first-of-type)': {
        marginTop: '$6',
    },
    '&:hover': {
        backgroundColor: '$bgDefault',
    },
});
