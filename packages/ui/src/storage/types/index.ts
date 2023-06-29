import { GeneratorGraph } from '#/types/index.ts';
import { FILE_TYPE } from './files.ts';

export type RemoteTokenStorageMetadata = {};

export interface RemoteGraphStorageErrorMessage {
  errorMessage: string;
}

export type GraphStorage = {
  name: string;
  data: GeneratorGraph;
};

export type RemoteGraphStorageData<Metadata> = {
  graphs: GraphStorage[];
  metadata?: (RemoteTokenStorageMetadata & Metadata) | null;
};

export type RemoteResponseFailure = {
  status: 'failure';
  errorMessage: string;
};

export type RemoteResponseStatus = {
  status: 'success' | 'failure';
  errorMessage?: string;
};

export type RemoteResponseSuccess<Metadata = unknown> = {
  status: 'success';
  graph: RemoteGraphStorageData<Metadata>;
  metadata?: (RemoteTokenStorageMetadata & Metadata) | null;
};

export type RemoteResponseData<Metadata = unknown> =
  | RemoteResponseSuccess<Metadata>
  | RemoteResponseFailure;

export interface RemoteGraphStorageSingleGraphFile {
  type: FILE_TYPE.GRAPH;
  path: string;
  name: string;
  data: GeneratorGraph;
}

/**
 * Possible stored files
 */
export type RemoteGraphStorageFile<Metadata = unknown> =
  RemoteGraphStorageSingleGraphFile;
