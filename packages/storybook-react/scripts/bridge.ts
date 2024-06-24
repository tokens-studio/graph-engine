import { Graph, nodeLookup } from '@tokens-studio/graph-engine';
import { WebSocketServer } from 'ws';
import { nodes as designNodes } from '@tokens-studio/graph-engine-nodes-design-tokens';

//These are all the nodes that are available in the editor
export const nodeTypes = {
	//Default
	...nodeLookup,
	//Design tokens
	...designNodes.reduce((acc, node) => {
		acc[node.type] = node;
		return acc;
	}, {})
};

const PORT = process.env.BRIDGE_PORT || '7878';

const wss = new WebSocketServer({
	port: Number.parseInt(PORT),
	perMessageDeflate: {
		zlibDeflateOptions: {
			// See zlib defaults.
			chunkSize: 1024,
			memLevel: 7,
			level: 3
		},
		zlibInflateOptions: {
			chunkSize: 10 * 1024
		},
		// Other options settable:
		clientNoContextTakeover: true, // Defaults to negotiated value.
		serverNoContextTakeover: true, // Defaults to negotiated value.
		serverMaxWindowBits: 10, // Defaults to negotiated value.
		// Below options specified as default values.
		concurrencyLimit: 10, // Limits zlib concurrency for perf.
		threshold: 1024 // Size (in bytes) below which messages
		// should not be compressed if context takeover is disabled.
	}
});

wss.on('connection', function connection(ws) {
	console.log('New connection');

	ws.on('error', console.error);

	ws.on('message', function message(data) {
		//We assume that this is a stringified graph
		console.log('Received a graph');

		const graph = new Graph().deserialize(
			JSON.parse(data.toString()),
			nodeTypes
		);

		const input = Object.values(graph.nodes).find(
			x => x.nodeType() == 'studio.tokens.generic.input'
		);

		if (!input) {
			console.error('No input node found');
			return;
		}

		Object.entries(input.inputs).forEach(([key, value]) => {
			console.log(key, value);
		});

		//Dump the meta data about the input element
	});
});
console.log('Bridge started on port', PORT, '...');
