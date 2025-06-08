import { NodeFactory } from "@tokens-studio/graph-engine";
import { SourceRequest } from "src/protocol/component";

export type Component = {
    version: string
}


export interface Loader {
    listComponents: () => Promise<Record<string, Component>>;
    registerComponent: (library: string, componentName: string) => void;
    setSource: (library: string, componentName: string, code: string, language: string)=> Promise<void>;
    load: (opts: SourceRequest) => Promise<NodeFactory>;
}