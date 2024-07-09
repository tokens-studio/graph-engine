export default function Loading() {
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: 1000,
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'rgb(25,25,25)'
			}}
		>
			Loading Data...
		</div>
	);
}
