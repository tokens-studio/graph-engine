import { StorageProviderType } from '#/types/storageType.ts';
import { FILE_TYPE } from '../types/files.ts';
import {
  RemoteGraphStorageData,
  RemoteGraphStorageErrorMessage,
  RemoteGraphStorageFile,
  RemoteResponseData,
} from '../types/index.ts';

export abstract class RemoteStorage<
  Metadata = unknown,
  SaveOptions = unknown,
  ReadOptions = unknown,
> {
  public name: string = 'abstract';
  public type: StorageProviderType = StorageProviderType.LOCAL;

  public abstract write(
    files: RemoteGraphStorageFile<Metadata>[],
    saveOptions?: SaveOptions,
  ): Promise<boolean>;
  public abstract read(
    readOptions?: ReadOptions,
  ): Promise<
    RemoteGraphStorageFile<Metadata>[] | RemoteGraphStorageErrorMessage
  >;

  public async save(
    data: RemoteGraphStorageData<Metadata>,
    saveOptions?: SaveOptions,
  ): Promise<boolean> {
    const files: RemoteGraphStorageFile<Metadata>[] = [];
    data.graphs.map((graph) => {
      files.push({
        type: FILE_TYPE.GRAPH,
        name: graph.name,
        path: `${graph.name}.json`,
        data: graph.data,
      });
    });
    return this.write(files, saveOptions);
  }

  public async retrieve(): Promise<RemoteResponseData<Metadata> | null> {
    const data: RemoteGraphStorageData<Metadata> = {
      graphs: [],
    };

    // start by reading the files from the remote source
    // it is up to the remote storage implementation to split it up into "File" objects
    const files = await this.read();

    // successfully fetch data
    if (Array.isArray(files)) {
      if (files.length === 0) {
        return null;
      }
      files.forEach((file) => {
        switch (file.type) {
          case FILE_TYPE.GRAPH:
            data.graphs.push({
              name: file.name,
              data: file.data,
            });
            break;
        }
      });
      return {
        status: 'success',
        graph: data,
      };
    }
    return {
      status: 'failure',
      ...files,
    };
  }
}
