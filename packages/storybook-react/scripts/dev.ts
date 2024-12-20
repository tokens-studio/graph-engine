import {
	Graph,
	STRING,
	SchemaObject,
	nodeLookup
} from '@tokens-studio/graph-engine';
import {
	nodes as designNodes,
	flatTokensRestoreToMap
} from '@tokens-studio/graph-engine-nodes-design-tokens';
import { register } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import chokidar from 'chokidar';
import fs from 'fs-extra';
import pathLib from 'node:path';
import type { IResolvedToken } from '@tokens-studio/graph-editor/index.js';

register(StyleDictionary);

type GenerateTokens = {
	component: string;
	themes: string[];
	basepath: string;
};

async function generateTokens(opts: GenerateTokens) {
	const { component, themes, basepath } = opts;

	const configs = themes.map(theme => ({
		source: [
			//TODO this is a bug I found
			pathLib
				.join(basepath, 'generated', 'tokens', `${theme}.json`)
				.replace(/\\/g, '/')
		],
		preprocessors: ['tokens-studio'],
		platforms: {
			css: {
				transformGroup: 'tokens-studio',
				files: [
					{
						destination: pathLib
							.join(basepath, 'generated', 'styles', `${theme}.css`)
							.replace(/\\/g, '/'),
						format: 'css/variables',
						options: {
							selector: `.${component}--${theme}`
						}
					}
					// component tokens, e.g. for design system developer
					// ...generateComponentFiles([component], theme),
				]
			}
		}
	}));

	const buildPlatforms = async cfg => {
		const sd = new StyleDictionary(cfg);
		await sd.cleanAllPlatforms();
		await sd.buildAllPlatforms();
	};
	await Promise.all(configs.map(buildPlatforms));
}

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

function getCombinations<T>(arrays: T[][]): T[][] {
	if (arrays.length === 0) return [[]];
	const combinations: T[][] = [];
	const [first, ...rest] = arrays;
	const subCombinations = getCombinations(rest);
	for (const item of first) {
		for (const sub of subCombinations) {
			combinations.push([item, ...sub]);
		}
	}
	return combinations;
}

async function processGraph(path: string) {
	const data = JSON.parse(await fs.readFile(path, 'utf-8'));
	const graph = await new Graph().deserialize(data, nodeTypes);
	console.log('Graph loaded:', path);

	const input = Object.values(graph.nodes).find(
		x => x.nodeType() == 'studio.tokens.generic.input'
	);

	if (!input) {
		console.error('No input node found');
		//Stop processing
		return;
	}

	//Otherwise look for the ports on the input node and generate a meta file
	const ports = input.inputs;

	const meta = Object.entries(ports).reduce(
		(acc, [name, port]) => {
			const type = port.type;
			//We only care about strings that are enumerable
			if (type.$id == STRING && type.enum) {
				acc[name] = type;
			}
			return acc;
		},
		{} as Record<string, SchemaObject>
	);

	const combinationKeys = Object.keys(meta);
	const inputCombinations = getCombinations(
		Object.values(meta).map(x => x.enum)
	);

	//Dump the meta file

	const tsData = `
export const keyOrder = [${Object.keys(meta)
		.map(x => `'${x}'`)
		.join(',')}];
export const defaultValues = {
${Object.entries(meta)
	.map(([key, value]) => {
		return `    ${key}: '${value.enum[0]}'`;
	})
	.join(',\n')}
};

${Object.entries(meta)
	.map(([key, value]) => {
		return `export type ${key} = ${value.enum.map(x => `'${x}'`).join('|')};`;
	})
	.join('\n')}

export type Context = {
${Object.entries(meta)
	.map(([key]) => {
		return `    ${key}: ${key}`;
	})
	.join('\n')}
};


    `;

	await fs.writeFile(path.replace('.graph.json', '.generated.ts'), tsData);

	console.log(
		`Total combinations ${inputCombinations.length} :`,
		inputCombinations
	);

	type TokenFile = {
		name: string;
		tokens: IResolvedToken[];
	};

	const tokenFiles: TokenFile[] = [];
	//Execute the graph for each combination
	for (const combination of inputCombinations) {
		const inputValues = Object.fromEntries(
			combinationKeys.map((key, i) => [
				key,
				{
					value: combination[i],
					type: input.inputs[key].type
				}
			])
		);

		const combinationKey = combination.join('-');

		const output = await graph.execute({
			inputs: inputValues
		});

		console.log(`Took: ${output.end - output.start}ms`);

		switch (output.output?.type.$id) {
			case 'https://schemas.tokens.studio/tokenArray.json':
				tokenFiles.push({
					name: combinationKey,
					tokens: output.output.value
				});
				break;
			default:
				console.log(
					`Output was not usable, of type "${output.output?.type.$id}"`
				);
		}
	}

	const dirName = pathLib.dirname(path);

	//Now dump the token files
	await Promise.all(
		tokenFiles.map(async file => {
			return fs.outputJson(
				pathLib.join(dirName, 'generated', 'tokens', `${file.name}.json`),
				flatTokensRestoreToMap(file.tokens),
				{ spaces: 2 }
			);
		})
	);
	//Now we can generated the css
	await generateTokens({
		component: 'button',
		basepath: dirName,
		themes: tokenFiles.map(x => x.name)
	});

	//Lastly generate an index.css to load all of the files
	const indexCss = tokenFiles.map(x => `@import './${x.name}.css';`).join('\n');
	await fs.writeFile(
		pathLib.join(dirName, 'generated', 'styles', 'index.css'),
		indexCss
	);
}

async function deleteGraph(path: string) {
	console.log('Graph deleted:', path);
}

console.log('Watching for changes in src/**/*.graph.json');
chokidar.watch('./src/**/*.graph.json').on('all', (event, path) => {
	console.log(event, path);
	switch (event) {
		case 'add':
		case 'change':
			processGraph(path);
			break;
		case 'unlink':
			deleteGraph(path);
			break;
	}
});
