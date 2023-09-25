import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  Separator,
} from '@tokens-studio/ui';

export const JoyrideTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
}) => (
  <Box
    css={{
      backgroundColor: '$bgDefault',
      borderRadius: '$medium',
      padding: '$5',
      maxWidth: '25em',
    }}
    {...tooltipProps}
  >
    <Stack direction="column" gap={3}>
      {step.title && (
        <>
          <Heading size="medium">{step.title}</Heading>
          <Separator orientation="horizontal" />
        </>
      )}
      <Stack direction="column" gap={2}>
        {step.content}
      </Stack>
      <Stack direction="row" gap={2} align="center" justify="between">
        <Button variant="secondary" {...skipProps}>
          Skip
        </Button>
        <Stack direction="row" gap={2}>
          {index > 0 && <Button {...backProps}>Back</Button>}
          {continuous && (
            <Button variant="primary" {...primaryProps}>
              Next
            </Button>
          )}
          {!continuous && <Button {...closeProps}>Close</Button>}
        </Stack>
      </Stack>
    </Stack>
  </Box>
);
