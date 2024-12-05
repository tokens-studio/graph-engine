import { Button, Heading, Separator, Stack } from '@tokens-studio/ui';

export const JoyrideTooltip = ({
	continuous,
	index,
	step,
	backProps,
	closeProps,
	primaryProps,
	skipProps,
	tooltipProps
}) => (
	<div
		style={{
			backgroundColor: 'var(--color-neutral-canvas-default-bg)',
			borderRadius: 'var(--component-radii-md)',
			padding: 'var(--component-spacing-xl)',
			maxWidth: '25em'
		}}
		{...tooltipProps}
	>
		<Stack direction='column' gap={3}>
			{step.title && (
				<>
					<Heading size='medium'>{step.title}</Heading>
					<Separator orientation='horizontal' />
				</>
			)}
			<Stack direction='column' gap={2}>
				{step.content}
			</Stack>
			<Stack direction='row' gap={2} align='center' justify='between'>
				<Button {...skipProps}>Skip</Button>
				<Stack direction='row' gap={2}>
					{index > 0 && <Button {...backProps}>Back</Button>}
					{continuous && (
						<Button emphasis='high' {...primaryProps}>
							Next
						</Button>
					)}
					{!continuous && <Button {...closeProps}>Close</Button>}
				</Stack>
			</Stack>
		</Stack>
	</div>
);
