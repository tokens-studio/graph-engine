import { styled } from "#/lib/stitches";


export const StyledPanel = styled('div', {
    borderRight: '1px solid',
    backgroundColor: '$bgSurface',
    borderColor: '$borderMuted',
    marginBottom: '-5px',
    overflow: 'auto',
    padding: '0',
    display: 'flex',
    position: 'relative',
    height: '100%',
    flexShrink: '0',
    width: '250px',
});
