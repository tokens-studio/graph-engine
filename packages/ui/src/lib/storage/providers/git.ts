import { RemoteStorage, RemoteStorageFile } from './base.ts';
import { joinPath } from '../utils.ts';

export type GitStorageSaveOptions = {
  commitMessage?: string;
};

export type GitStorageSaveOption = {
  commitMessage?: string;
};

export abstract class GitStorage extends RemoteStorage<
  GitStorageSaveOptions,
  GitStorageSaveOption
> {
  public secret: string;

  public owner: string;

  public repository: string;

  public branch: string = 'master';

  public path: string = '';

  public baseUrl: string | undefined = undefined;

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
    files: RemoteStorageFile[],
    saveOptions: GitStorageSaveOption,
  ): Promise<boolean> {
    const branches = await this.fetchBranches();
    if (!branches.length) return false;

    const filesChangeset: Record<string, string> = {};

    files.forEach((file) => {
      filesChangeset[joinPath(this.path, file.name)] = file.data;
    });

    return this.writeChangeset(
      filesChangeset,
      saveOptions.commitMessage ?? 'Commit from Graph UI',
      this.branch,
      !branches.includes(this.branch),
    );
  }

  static deserialize(): GitStorage {
    throw new Error('Method not implemented.');
  }
}
