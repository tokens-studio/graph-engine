import type { Graph } from "@tokens-studio/graph-engine";
/**
 * A factory to return the AudioContext
 * @returns 
 */
export const WebAudioCapability = (graph: Graph) => {

    const ctx = new AudioContext();

    graph.on("pause", () => ctx.suspend());
    graph.on("resume", () => ctx.resume());

    return ctx;
}
