import {
  StorageProviderType,
  StorageType,
  StorageTypeCredentials,
} from '#/types/storageType.ts';

export function isGitProvider<T extends StorageType | StorageTypeCredentials>(
  provider: T,
): provider is Extract<T, { provider: StorageProviderType.GITHUB }> {
  return provider.provider === StorageProviderType.GITHUB;
}
