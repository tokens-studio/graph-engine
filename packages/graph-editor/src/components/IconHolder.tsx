import { styled } from "#/lib/stitches";

export const IconHolder = styled('div', {
    display: 'flex',
    width: '32px',
    height: '32px',
    fontSize: '$xxsmall',
    padding: '$3',
    borderRadius: '$medium',
    border: '1px solid $borderSubtle',
    userSelect: 'none',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
});