import { RemoteStorage } from '../interfaces/remoteStorage.ts';
import { RemoteGraphStorageSingleGraphFile } from '../types/index.ts';
import { ResolverData } from '#/types/resolverData.ts';
import { FILE_TYPE } from '../types/files.ts';

type ReadOptions = {
  file: File;
};

export class LocalStorage extends RemoteStorage<unknown, unknown, ReadOptions> {
  public name: string = 'local';

  constructor() {
    super();
  }

  public async read(
    opts?: ReadOptions,
  ): Promise<RemoteGraphStorageSingleGraphFile[]> {
    if (!opts) {
      return [];
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function () {
        const resolver = JSON.parse(reader.result as string) as ResolverData;

        const { state, code, nodes, edges } = resolver;

        resolve([
          {
            name: opts.file.name,
            type: FILE_TYPE.GRAPH,
            path: '/',
            data: {
              nodes,
              edges,
              state,
              code,
            },
          },
        ]);
      };
      reader.readAsText(opts.file);
    });
  }

  public async write(
    files: RemoteGraphStorageSingleGraphFile[],
    saveOptions?: unknown,
  ): Promise<boolean> {
    const fileContent = JSON.stringify(
      files.map((file) => {
        const { data, ...rest } = file;
        return {
          nodes: data.nodes,
          edges: data.edges,
          state: data.state,
          code: data.code,
        };
      }),
    );

    const blob = new Blob([fileContent], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `graph.json`;
    document.body.appendChild(link);
    link.click();

    // Clean up the URL and link
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    return true;
  }
}
