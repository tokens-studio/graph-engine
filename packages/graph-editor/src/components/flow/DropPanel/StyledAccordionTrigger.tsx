import * as Accordion from "@radix-ui/react-accordion";
import { styled } from "@stitches/react";

export const StyledAccordingTrigger = styled(Accordion.Trigger, {
    display: 'flex',
    flexDirection: 'column',
    border: '4px solid $bgSurface',
    borderRadius: '$medium',
    alignItems: 'flex-start',
    width: '100%',
    fontWeight: '$sansBold',
    fontSize: '$xsmall',
    '&:not(:first-of-type)': {
        marginTop: '$6',
    },
});
