import type { CapabilityFactory, Graph } from "@tokens-studio/graph-engine";
/**
 * A factory to return the AudioContext
 * @returns 
 */
export const WebAudioCapability: CapabilityFactory = {
    name: "web-audio",
    register: (graph: Graph) => {

        const ctx = new AudioContext();

        graph.on("stop", () => ctx.suspend());
        graph.on("pause", () => ctx.suspend());
        graph.on("start", () => ctx.resume());
        graph.on("resume", () => ctx.resume());

        return ctx;
    }
}