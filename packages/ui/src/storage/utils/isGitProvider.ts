import { StorageProviderType } from '#/types/storageType.ts';
import { RemoteStorage } from '../interfaces/remoteStorage.ts';

export function isGitProvider<T extends RemoteStorage>(provider: T): boolean {
  return provider.type === StorageProviderType.GITHUB;
}
