import * as vscode from 'vscode';
import { WebviewObject } from '../graphProvider';
import type {
  FSCapability,
  FSEntity,
  //@ts-expect-error ESM in CJS
} from '@tokens-studio/graph-engine-nodes-fs';

const toLocalUri = (path: string) => {
  return vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0]!.uri, path);
};

export class FileSystem implements FSCapability {
  constructor(graph: WebviewObject) {
    graph.messageHandler.on('fs.readFile', async (path, requestId) => {
      const data = await this.readFile(path);
      console.log(
        data,
        data instanceof Uint8Array,
        data instanceof ArrayBuffer,
      );
      graph.messageHandler.postResponse(requestId!, data);
    });

    graph.messageHandler.on(
      'fs.writeFile',
      async ({ path, data }, requestId) => {
        await this.writeFile(path, data);
        graph.messageHandler.postResponse(requestId!);
      },
    );

    graph.messageHandler.on('fs.rm', async (path, requestId) => {
      await this.rm(path);
      graph.messageHandler.postResponse(requestId!);
    });

    graph.messageHandler.on('fs.mkdir', async ({ path }, requestId) => {
      await this.mkdir(path);
      graph.messageHandler.postResponse(requestId!);
    });

    graph.messageHandler.on('fs.rmdir', async (path, requestId) => {
      await this.rmdir(path);
      graph.messageHandler.postResponse(requestId!);
    });

    graph.messageHandler.on('fs.cp', async ({ src, dest }, requestId) => {
      await this.cp(src, dest);
      graph.messageHandler.postResponse(requestId!);
    });

    graph.messageHandler.on('fs.readdir', async (path, requestId) => {
      const data = await this.readdir(path);
      graph.messageHandler.postResponse(requestId!, data);
    });
  }

  async mkdir(path: string): Promise<void> {
    try {
      await vscode.workspace.fs.createDirectory(toLocalUri(path));
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create directory: ${path}`);
      throw error;
    }
  }

  async rmdir(path: string): Promise<void> {
    const uri = vscode.Uri.file(path);
    try {
      await vscode.workspace.fs.delete(uri);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to remove directory: ${path}`);
      throw error;
    }
  }

  async cp(src: string, dest: string): Promise<void> {
    const srcUri = vscode.Uri.file(src);
    const destUri = vscode.Uri.file(dest);

    try {
      await vscode.workspace.fs.copy(srcUri, destUri);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to copy file from ${src} to ${dest}`,
      );
      throw error;
    }
  }

  async readdir(path: string): Promise<FSEntity[]> {
    try {
      const files = await vscode.workspace.fs.readDirectory(
        vscode.Uri.file(path),
      );
      const entities: FSEntity[] = files.map(([path, type]) => {
        if (type === vscode.FileType.Directory) {
          return {
            path,
            type: 'dir',
          };
        }
        return {
          path,
          type: 'file',
        };
      });

      return entities;
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to read directory: ${path}`);
      throw error;
    }
  }

  async readFile(path: string) {
    console.log(path);
    console.log('as local', toLocalUri(path));
    return new Uint8Array(await vscode.workspace.fs.readFile(toLocalUri(path)));
  }

  async writeFile(path: string, data: Uint8Array) {
    return await vscode.workspace.fs.writeFile(vscode.Uri.file(path), data);
  }

  async rm(path: string) {
    const uri = vscode.Uri.file(path);
    try {
      return await vscode.workspace.fs.delete(uri);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to remove file: ${path}`);
      throw error;
    }
  }
}
