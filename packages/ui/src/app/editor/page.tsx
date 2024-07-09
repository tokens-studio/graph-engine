'use client';
import { Box } from '@tokens-studio/ui';
import { JoyrideTooltip } from '@/components/joyride/tooltip.tsx';
import { observer } from 'mobx-react-lite';
import { useJourney } from '@/components/journeys/basic.tsx';
import Editor from '@/components/editor/index.tsx';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import React, { useCallback, useEffect, useState } from 'react';
import globalState from '@/mobx/index.tsx';

const Page = observer(({ showJourney }: { showJourney: boolean }) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const ref = useCallback(editor => {
		globalState.refs.editor.set(editor);
	}, []);

	const [{ steps }] = useJourney();
	const handleJoyrideCallback = (data: CallBackProps) => {
		const { status } = data;
		const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

		if (finishedStatuses.includes(status)) {
			globalState.journey.showJourney = false;
		}
	};

	//Joyride causes a hydration mismatch
	if (!isClient) {
		return <></>;
	}

	return (
		<>
			{/* @ts-ignore */}
			<Joyride
				callback={handleJoyrideCallback}
				continuous
				hideCloseButton
				run={showJourney}
				tooltipComponent={JoyrideTooltip}
				scrollToFirstStep
				showProgress
				showSkipButton
				steps={steps}
				styles={{
					options: {
						zIndex: 10000
					}
				}}
			/>
			<Box
				css={{
					position: 'relative',
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					height: '100%',
					overflow: 'hidden',
					background: '$bgCanvas',
					isolation: 'isolate'
				}}
			>
				<Editor ref={ref} />
			</Box>
		</>
	);
});

const Wrapper = () => <Page showJourney={globalState.journey.showJourney} />;
export default Wrapper;
