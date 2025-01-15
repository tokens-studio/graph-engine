import type { LayoutBase } from 'rc-dock';

export const defaultLayout: LayoutBase = {
	dockbox: {
		mode: 'vertical',
		children: [
			{
				mode: 'horizontal',
				children: [
					{
						size: 2,
						mode: 'vertical',
						children: [
							{
								mode: 'horizontal',
								children: [
									{
										size: 3,
										mode: 'vertical',
										children: [
											{
												tabs: [
													{
														id: 'dropPanel'
													},
													{
														id: 'previewNodesPanel'
													}
												]
											}
										]
									},
									{
										size: 17,
										mode: 'vertical',
										children: [
											{
												id: 'graphs',
												size: 700,
												group: 'graph',
												tabs: [
													{
														id: 'graph1'
													}
												]
											}
										]
									},

									{
										size: 4,
										mode: 'vertical',
										children: [
											{
												size: 12,
												tabs: [
													{
														id: 'input'
													}
												]
											},
											{
												size: 12,
												tabs: [
													{
														id: 'outputs'
													}
												]
											}
										]
									}
								]
							}
						]
					}
				]
			}
		]
	}
};
