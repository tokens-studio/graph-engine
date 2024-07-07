import { StorageProviderType } from './types.ts';

type RemoteResponseSuccess<Metadata = unknown> = {
	status: 'success';
	data: unknown;
	metadata?: Metadata | null;
	commitSha?: string;
	commitDate?: Date;
};

type RemoteResponseFailure = {
	status: 'failure';
	errorMessage: string;
};

export type RemoteResponseData<Metadata = unknown> =
	| RemoteResponseSuccess<Metadata>
	| RemoteResponseFailure;

export type RemoteResponseStatus = {
	status: 'success' | 'failure';
	errorMessage?: string;
};

export type RemoteStorageFile<Metadata = unknown> = {
	name: string;
	path: string;
	data: unknown;
	metadata?: Metadata | null;
};

export interface RemoteStorageErrorMessage {
	errorMessage: string;
}

export type RemoteStorageSaveOptions = {
	//TODO implement
};

export abstract class RemoteStorage<
	Metadata = unknown,
	SaveOptions extends RemoteStorageSaveOptions = object
> {
	//TODO this should be overriden by the child class
	public storageType: StorageProviderType = StorageProviderType.LOCAL;
	public name: string = 'Local Storage';

	public abstract write(
		files: RemoteStorageFile<Metadata>[],
		saveOptions?: SaveOptions
	): Promise<boolean>;
	public abstract read(): Promise<
		RemoteStorageFile<Metadata>[] | RemoteStorageErrorMessage
	>;

	public async save(
		data: RemoteStorageFile,
		saveOptions: SaveOptions
	): Promise<boolean> {
		const files: RemoteStorageFile<Metadata>[] = [];

		//Some processing might be required here, but for now we will just pass the data as is
		return this.write(files, saveOptions);
	}

	public async retrieve(): Promise<RemoteResponseData<Metadata> | null> {
		// start by reading the files from the remote source
		// it is up to the remote storage implementation to split it up into "File" objects
		const files = await this.read();

		// successfully fetch data
		if (Array.isArray(files)) {
			if (files.length === 0) {
				return null;
			}

			return {
				status: 'success',
				data: files
			};
		}
		return {
			status: 'failure',
			...(files as RemoteStorageErrorMessage)
		};
	}

	public abstract serialize(): object;
}
