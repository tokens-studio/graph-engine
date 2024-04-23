import { Octokit } from '@octokit/rest';
import { GitStorage } from './git.ts';
import compact from 'just-compact';
import multiFileCommit from 'octokit-commit-multiple-files';
import { RemoteStorageErrorMessage, RemoteStorageFile } from './base.ts';
import { normalizePath, joinPath } from '../utils.ts';


type ExtendedOctokitClient = Omit<Octokit, 'repos'> & {
    repos: Octokit['repos'] & {
        createOrUpdateFiles: (params: {
            owner: string
            repo: string
            branch: string
            createBranch?: boolean
            changes: {
                message: string
                files: Record<string, string>,
                filesToDelete?: string[],
                ignoreDeletionFailures?: boolean,
            }[]
        }) => ReturnType<Octokit['repos']['createOrUpdateFileContents']>
    }
};

// @README https://github.com/octokit/octokit.js/issues/890
const octokitClientDefaultHeaders = {
    'If-None-Match': '',
};

export function getTreeMode(type: 'dir' | 'file' | string) {
    switch (type) {
        case 'dir':
            return '040000';
        default:
            return '100644';
    }
}

export class GithubStorage extends GitStorage {
    private octokitClient: ExtendedOctokitClient;

    name: string;

    constructor(
        secret: string,
        owner: string,
        repository: string,
        baseUrl?: string,
        name?: string,

    ) {
        super(secret, owner, repository, baseUrl);

        this.name = name || 'Github';
        // eslint-disable-next-line
        const ExtendedOctokitConstructor = Octokit.plugin(multiFileCommit);
        this.octokitClient = new ExtendedOctokitConstructor({
            auth: this.secret,
            baseUrl: this.baseUrl || undefined,
        }) as ExtendedOctokitClient;
    }

    public serialize(): object {
        return {
            secret: this.secret,
            owner: this.owner,
            repository: this.repository,
            branch: this.branch,
            path: this.path,
            baseUrl: this.baseUrl,
            type: this.storageType
        };
    }


    static deserialize(serialized: object): GitStorage {
        const { secret, owner, repository, branch, path, baseUrl, name } = serialized as any;
        return new GithubStorage(secret, owner, repository, baseUrl, name)
            .selectBranch(branch)
            .changePath(path);
    }


    public async listBranches() {
        return this.octokitClient.paginate(this.octokitClient.repos.listBranches, {
            owner: this.owner,
            repo: this.repository,
            headers: octokitClientDefaultHeaders,
            per_page: 30, // Set to desired page size (max 100)
        });
    }

    public async getTreeShaForDirectory(path: string) {
        // @README this is necessary because to figure out the tree SHA we need to fetch the parent directory contents
        // however when pulling from the root directory we can  not do this, but we can take the SHA from the branch
        if (path === '') {
            const branches = await this.listBranches();
            const branch = branches?.find((entry) => entry.name === this.branch);
            if (!branch) throw new Error(`Branch not found, ${this.branch}`);
            return branch.commit.sha;
        }

        // get the parent directory content to find out the sha
        const parent = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '';
        const parentDirectoryTreeResponse = await this.octokitClient.rest.repos.getContent({
            owner: this.owner,
            repo: this.repository,
            path: parent,
            ref: this.branch,
            headers: octokitClientDefaultHeaders,
        });

        if (Array.isArray(parentDirectoryTreeResponse.data)) {
            const directory = parentDirectoryTreeResponse.data.find((item) => item.path === path);
            if (!directory) throw new Error(`Unable to find directory, ${path}`);
            return directory.sha;
        }

        // @README if the parent directory only contains a single subdirectory
        // it will not return an array with 1 item - but rather it will return the item itself
        if (parentDirectoryTreeResponse.data.path === path) {
            return parentDirectoryTreeResponse.data.sha;
        }

        throw new Error('Could not find directory SHA');
    }

    /**
     * Retrieves all branch names from the repo
     * @returns 
     */
    public async fetchBranches(): Promise<string[]> {
        const branches = await this.listBranches();
        return branches?.map((branch) => branch.name);
    }

    /**
     * Creates a new branch from the source branch
     * @param branch 
     * @param source 
     * @returns 
     */
    public async createBranch(branch: string, source?: string) {
        try {
            const originRef = `heads/${source || this.branch}`;
            const newRef = `refs/heads/${branch}`;
            const originBranch = await this.octokitClient.git.getRef({
                owner: this.owner,
                repo: this.repository,
                ref: originRef,
                headers: octokitClientDefaultHeaders,
            });
            const newBranch = await this.octokitClient.git.createRef({
                owner: this.owner, repo: this.repository, ref: newRef, sha: originBranch.data.object.sha,
            });
            return !!newBranch.data.ref;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    public async canWrite(): Promise<boolean> {
        const currentUser = await this.octokitClient.rest.users.getAuthenticated();
        if (!currentUser.data.login) return false;
        try {
            const canWrite = await this.octokitClient.rest.repos.getCollaboratorPermissionLevel({
                owner: this.owner,
                repo: this.repository,
                username: currentUser.data.login,
                headers: octokitClientDefaultHeaders,
            });
            return !!canWrite;
        } catch (e) {
            return false;
        }
    }

    public async read<Metadata = unknown>(): Promise<RemoteStorageFile<Metadata>[] | RemoteStorageErrorMessage> {
        try {
            const normalizedPath = normalizePath(this.path);
            const response = await this.octokitClient.rest.repos.getContent({
                path: normalizedPath,
                owner: this.owner,
                repo: this.repository,
                ref: this.branch,
                headers: {
                    ...octokitClientDefaultHeaders,
                    // Setting this makes github return the raw file instead of a json object.
                    Accept: 'application/vnd.github.raw',
                },
            });

            // read entire directory
            if (Array.isArray(response.data)) {
                const directorySha = await this.getTreeShaForDirectory(normalizedPath);
                const treeResponse = await this.octokitClient.rest.git.getTree({
                    owner: this.owner,
                    repo: this.repository,
                    tree_sha: directorySha,
                    recursive: 'true',
                    headers: octokitClientDefaultHeaders,
                });
                if (treeResponse && treeResponse.data.tree.length > 0) {
                    const files = treeResponse.data.tree;
                    const fileContents = await Promise.all(files.map((treeItem) => (
                        treeItem.path ? this.octokitClient.rest.repos.getContent({
                            owner: this.owner,
                            repo: this.repository,
                            path: treeItem.path.startsWith(normalizedPath) ? treeItem.path : `${normalizedPath}/${treeItem.path}`,
                            ref: this.branch,
                            headers: {
                                ...octokitClientDefaultHeaders,
                                // Setting this makes github return the raw file instead of a json object.
                                Accept: 'application/vnd.github.raw',
                            },
                        }) : Promise.resolve(null)
                    )));
                    return compact(fileContents.map<RemoteStorageFile<Metadata> | null>((fileContent, index) => {
                        const { path } = files[index];
                        if (
                            path
                            && fileContent?.data
                            && !Array.isArray(fileContent?.data)
                        ) {
                            const filePath = path.startsWith(normalizedPath) ? path : `${normalizedPath}/${path}`;
                            let name = filePath.substring(this.path.length).replace(/^\/+/, '');

                            return {
                                path: filePath,
                                name,
                                data: fileContent.data,
                            } as RemoteStorageFile<Metadata>;
                        }
                        return null;
                    }));
                }
            } else if (response.data) {
                return {
                    errorMessage: 'Single file found, expected a directory',
                };
            }

            return [];
        } catch (e) {
            // Raise error (usually this is an auth error)
            console.error('Error', e);
            return [];
        }
    }

    public async createOrUpdate(changeset: Record<string, string>, message: string, branch: string, shouldCreateBranch?: boolean, filesToDelete?: string[], ignoreDeletionFailures?: boolean): Promise<boolean> {
        const response = await this.octokitClient.repos.createOrUpdateFiles({
            branch,
            owner: this.owner,
            repo: this.repository,
            createBranch: shouldCreateBranch,
            changes: [
                {
                    message,
                    files: changeset,
                    filesToDelete,
                    ignoreDeletionFailures,
                },
            ],
        });
        return !!response;
    }

    public async writeChangeset(changeset: Record<string, string>, message: string, branch: string, shouldCreateBranch?: boolean): Promise<boolean> {
        try {
            const response = await this.octokitClient.rest.repos.getContent({
                owner: this.owner,
                repo: this.repository,
                path: this.path,
                ref: this.branch,
            });

            if (Array.isArray(response.data)) {
                const directoryTreeResponse = await this.octokitClient.rest.git.createTree({
                    owner: this.owner,
                    repo: this.repository,
                    tree: response.data.map((item) => ({
                        path: item.path,
                        sha: item.sha,
                        mode: getTreeMode(item.type),
                    })),
                });

                if (directoryTreeResponse.data.tree[0].sha) {
                    const treeResponse = await this.octokitClient.rest.git.getTree({
                        owner: this.owner,
                        repo: this.repository,
                        tree_sha: directoryTreeResponse.data.tree[0].sha,
                        recursive: 'true',
                    });

                    if (treeResponse.data.tree.length > 0) {
                        const jsonFiles = treeResponse.data.tree.filter((file) => (
                            file.path?.endsWith('.json')
                        )).sort((a, b) => (
                            (a.path && b.path) ? a.path.localeCompare(b.path) : 0
                        ));

                        const filesToDelete = jsonFiles.filter((jsonFile) => !Object.keys(changeset).some((item) => jsonFile.path && item === joinPath(this.path, jsonFile?.path)))
                            .map((fileToDelete) => (`${this.path.split('/')[0]}/${fileToDelete.path}` ?? ''));
                        return await this.createOrUpdate(changeset, message, branch, shouldCreateBranch, filesToDelete, true);
                    }
                }
            }

            return await this.createOrUpdate(changeset, message, branch, shouldCreateBranch);
        } catch {
            return await this.createOrUpdate(changeset, message, branch, shouldCreateBranch);
        }
    }

    public async getCommitSha(): Promise<string> {
        try {
            const normalizedPath = compact(this.path.split('/')).join('/');
            const response = await this.octokitClient.rest.repos.getContent({
                path: normalizedPath,
                owner: this.owner,
                repo: this.repository,
                ref: this.branch,
                headers: octokitClientDefaultHeaders,
            });
            // read entire directory
            if (Array.isArray(response.data)) {
                const directorySha = await this.getTreeShaForDirectory(normalizedPath);
                return directorySha;
            }
            return response.data.sha;
        } catch (e) {
            // Raise error (usually this is an auth error)
            console.error('Error', e);
            return '';
        }
    }
}
