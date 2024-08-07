import type { CapabilityFactory, Graph } from '@tokens-studio/graph-engine';

export interface FSEntity {
	type: 'file' | 'dir';
	path: string;
}

export interface FSCapability {
	readFile: (path: string) => Promise<Uint8Array>;
	writeFile: (path: string, data: Uint8Array) => Promise<void>;
	rm: (path: string) => Promise<void>;
	mkdir: (path: string, opts: { recursive: boolean }) => Promise<void>;
	rmdir: (path: string) => Promise<void>;
	cp: (src: string, dest: string) => Promise<void>;
	readdir: (path: string) => Promise<FSEntity[]>;
}

export type Reifier = (graph: Graph) => FSCapability;

export const FSCapabilityFactory = (reifier: Reifier): CapabilityFactory => {
	return {
		name: 'fs',
		register: (graph: Graph) => {
			return reifier(graph);
		}
	};
};
