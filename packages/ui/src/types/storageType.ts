export enum StorageProviderType {
  LOCAL = 'local',
  GITHUB = 'github',
}

/**
 * StorageTypes are meant to define the parameters of a storage provider
 * but this does not include their credentials
 */

export type GenericStorageType<
  T extends StorageProviderType = StorageProviderType,
  P = unknown,
> = P & {
  provider: T;
} & (T extends StorageProviderType.LOCAL
    ? unknown
    : {
        internalId: string;
      });

export type LocalStorageType = GenericStorageType<StorageProviderType.LOCAL>;

export type GitHubStorageType = GenericStorageType<
  StorageProviderType.GITHUB,
  {
    name: string; // this is only for refrence
    id: string; // this should be the repository identifier; eg {username}/{repo}
    branch: string; // this is the base branch
    filePath: string; // this is the path to the token file or files (depends on multifile support)
    baseUrl?: string; // this is the base API url. This is important for self hosted environments
    commitSha?: string; // this is the commit sha of the current file or folder
  }
>;

export type StorageType = LocalStorageType | GitHubStorageType;

export type StorageTypeCredential<
  T extends GenericStorageType,
  Required extends boolean = true,
> = T & (Required extends true ? { secret: string } : { secret?: string });

export type StorageTypeCredentials = StorageTypeCredential<GitHubStorageType>;
