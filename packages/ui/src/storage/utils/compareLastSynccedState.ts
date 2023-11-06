import compact from 'just-compact';
import { isEqual } from './isEqual.ts';
import { RemoteGraphStorageSingleGraphFile } from '../types/index.ts';

export type LastSyncedState<Metadata = null> =
  | [RemoteGraphStorageSingleGraphFile]
  | [RemoteGraphStorageSingleGraphFile, Metadata];

export function tryParseJson<V = any>(value: string): V | null {
  try {
    return JSON.parse(value);
  } catch (err) {
    console.error(err);
  }
  return null;
}

export function compareLastSyncedState<Metadata = null>(
  graphs: RemoteGraphStorageSingleGraphFile,
  lastSyncedState: string,
  defaultSyncedState: LastSyncedState<Metadata>,
) {
  const parsedState = tryParseJson<LastSyncedState<Metadata>>(lastSyncedState);
  if (!parsedState) {
    return false;
  }
  return isEqual(
    compact([
      parsedState[0] ?? defaultSyncedState[0],
      parsedState[1] ?? defaultSyncedState[1],
      parsedState[2] ?? defaultSyncedState[2],
    ]),
    compact([graphs, metadata ?? defaultSyncedState[2]]),
  );
}
