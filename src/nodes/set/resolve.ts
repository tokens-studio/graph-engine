import { IResolvedToken, flatTokensRestoreToMap, flatten } from '../../utils/index.js';
import { NodeDefinition, NodeTypes } from '../../types.js';
import { transformTokens } from 'token-transformer'


export const type = NodeTypes.ALIAS;
const resolveValues = (tokens: IResolvedToken[], context: IResolvedToken[]) => {

    const setsToUse = ['root', 'excludes'];

    const rawTokens = {
        root: flatTokensRestoreToMap(tokens),
        excludes: flatTokensRestoreToMap(context)
    };

    //We don't want the modifiers to contribute to the final values
    const excludes = ['excludes'];

    const resolved = transformTokens(rawTokens, setsToUse, excludes, {
        expandTypography: true,
        expandShadow: true,
        expandComposition: true,
        preserveRawValue: false,
        throwErrorWhenNotResolved: false,
        resolveReferences: true
    });

    return flatten(resolved);
}

type KeyValuePair = {
    key: string,
    value: any
}

/**
 * Pure function
 * @param input 
 * @param state 
 */
export const mapInput = (input) => {

    const { inputs, context } = Object.entries(input).sort((a, b) => {
        return a[0].localeCompare(b[0])
    }).reduce((acc, [key, value]) => {
        if (key.startsWith('context')) {
            acc.context.push({
                key,
                value
            })
        } else if (key.startsWith('inputs')) {
            acc.inputs.push({
                key,
                value
            })
        }
        return acc;
    }, { context: [] as KeyValuePair[], inputs: [] as KeyValuePair[] });

    //Returns the expected array of inputs
    return {
        inputs,
        context
    }
}


//Passthrough
export const process = (input) => {
    return resolveValues(input.tokens || [], input.context || []);
}

export const mapOutput = (input, state, processed) => {

    const mapping = {};

    //We use this to expose the resolved set as a node output
    mapping['as Set'] = processed;
    processed.forEach(x => {
        mapping[x.name] = x;
    });
    return mapping;
}

export const node: NodeDefinition = {
    type,
    mapInput,
    process,
    mapOutput
}