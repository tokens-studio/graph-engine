import { Graph } from "@tokens-studio/graph-engine";
import { graphID } from "./annotations";

export const parseName = (name: string) => {
    if (name.indexOf('/') === -1) {
        return {
            library: null,
            name,
        };
    }
    const nameParts = name.split('/');
    return {
        library: nameParts[0],
        name: nameParts[1],
    };
};

export const withNamespace = (name: string, namespace?: string) => {
    if (!namespace || name.indexOf('/') !== -1) {
        return name;
    }
    return `${namespace}/${name}`;
};

export const withoutNamespace = (name) => {
    if (name.indexOf('/') === -1) {
        return name;
    }
    return name.split('/')[1];
};

export const getGraphID = (graph: Graph):string => {
    return graph.annotations[graphID] as string;
}

export const findInput = (graph: Graph) => {
    return Object.values(graph.nodes).find((x) => x.factory.type === 'studio.tokens.generic.input');
}
export const findOutput = (graph: Graph) => {
    return Object.values(graph.nodes).find((x) => x.factory.type === 'studio.tokens.generic.output');
}
