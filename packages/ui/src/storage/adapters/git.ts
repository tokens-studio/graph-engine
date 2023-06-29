import { joinPath } from '#/utils/joinPath.ts';
import { RemoteStorage } from '../interfaces/remoteStorage.ts';
import { ErrorMessages } from '#/constants/error.ts';
import { FILE_TYPE } from '../types/files.ts';
import { RemoteGraphStorageFile } from '../types/index.ts';
import { GeneratorGraph } from '#/types/index.ts';

type StorageFlags = {
  multiFileEnabled: boolean;
};

export type GitStorageSaveOptions = {
  commitMessage?: string;
};

export type GitSingleFileObject = Record<string, GeneratorGraph>;

export abstract class GitTokenStorage extends RemoteStorage<GitStorageSaveOptions> {
  protected secret: string;

  protected owner: string;

  protected repository: string;

  protected branch: string = 'master';

  protected path: string = '';

  protected baseUrl: string | undefined = undefined;

  protected flags: StorageFlags = {
    multiFileEnabled: true,
  };

  constructor(
    secret: string,
    owner: string,
    repository: string,
    baseUrl?: string,
  ) {
    super();
    this.secret = secret;
    this.owner = owner;
    this.repository = repository;
    this.baseUrl = baseUrl;
  }

  public selectBranch(branch: string) {
    this.branch = branch;
    return this;
  }

  public changePath(path: string) {
    this.path = joinPath(path);
    return this;
  }

  public enableMultiFile() {
    this.flags.multiFileEnabled = true;
    return this;
  }

  public disableMultiFile() {
    this.flags.multiFileEnabled = false;
    return this;
  }

  public abstract fetchBranches(): Promise<string[]>;
  public abstract createBranch(
    branch: string,
    source?: string,
  ): Promise<boolean>;
  public abstract canWrite(): Promise<boolean>;
  public abstract writeChangeset(
    changeset: Record<string, string>,
    message: string,
    branch: string,
    shouldCreateBranch?: boolean,
  ): Promise<boolean>;

  public async write(
    files: RemoteGraphStorageFile[],
    saveOptions: GitStorageSaveOptions,
  ): Promise<boolean> {
    const branches = await this.fetchBranches();
    if (!branches.length) return false;

    const filesChangeset: Record<string, string> = {};
    if (this.path.endsWith('.json')) {
      filesChangeset[this.path] = JSON.stringify(
        {
          ...files.reduce<GitSingleFileObject>((acc, file) => {
            if (file.type === FILE_TYPE.GRAPH) {
              acc[file.name] = file.data;
            }
            return acc;
          }, {}),
        },
        null,
        2,
      );
    } else if (this.flags.multiFileEnabled) {
      files.forEach((file) => {
        if (file.type === FILE_TYPE.GRAPH) {
          filesChangeset[joinPath(this.path, `${file.name}.json`)] =
            JSON.stringify(file.data, null, 2);
        }
      });
    } else {
      // When path is a directory and multiFile is disabled return
      throw new Error(ErrorMessages.GIT_MULTIFILE_PERMISSION_ERROR);
    }
    return this.writeChangeset(
      filesChangeset,
      saveOptions.commitMessage ?? 'Commit from Graph generator',
      this.branch,
      !branches.includes(this.branch),
    );
  }
}
