import { styled } from "#/lib/stitches";


export const StyledPanel = styled('div', {
    position: 'absolute',
    top: '$8',
    left: '$3',
    maxHeight: '80vh',
    height: 'auto',
    backgroundColor: '$bgSubtle',
    borderRadius: '$medium',
    border: '1px solid',
    borderColor: '$borderSubtle',
    overflow: 'auto',
    padding: '$1',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '250px',
    zIndex: 50,
});
