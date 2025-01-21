'use client';
import { JoyrideTooltip } from '@/components/joyride/tooltip.tsx';
import { createToolbarButtons } from '@/components/editor/toolbar/index.tsx';
import { observer } from 'mobx-react-lite';
import { useJourney } from '@/components/journeys/basic.tsx';
import Editor from '@/components/editor/index.tsx';
import Joyride, { type CallBackProps, STATUS } from 'react-joyride';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import globalState, { RefState } from '@/mobx/index.tsx';

const Page = observer(
	({ showJourney, refs }: { showJourney: boolean; refs: RefState }) => {
		const [isClient, setIsClient] = useState(false);

		useEffect(() => {
			setIsClient(true);
		}, []);

		const ref = useCallback(editor => {
			refs.setEditor(editor);
		}, []);

		const toolbarButtons = useMemo(() => {
			return createToolbarButtons();
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
				<div
					style={{
						position: 'relative',
						display: 'flex',
						flexDirection: 'row',
						width: '100%',
						height: '100%',
						overflow: 'hidden',
						background: 'var(--color-neutral-canvas-minimal-bg)',
						isolation: 'isolate'
					}}
				>
					<Editor ref={ref} toolbarButtons={toolbarButtons} />
				</div>
			</>
		);
	}
);

const Wrapper = () => (
	<Page showJourney={globalState.journey.showJourney} refs={globalState.refs} />
);
export default Wrapper;
