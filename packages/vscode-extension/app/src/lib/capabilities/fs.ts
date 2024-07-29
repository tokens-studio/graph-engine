/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FSCapabilityFactory,
  FSEntity,
} from '@tokens-studio/graph-engine-nodes-fs';
import { MessageHandler } from '../messageHandler.js';

export class FSCapability {
  nexus: MessageHandler;

  constructor(nexus: MessageHandler) {
    this.nexus = nexus;
  }

  private readFile = async (path: string): Promise<Uint8Array> => {
    return await this.nexus.postMessageWithResponse('fs.readFile', path);
  };
  private writeFile = async (path: string, data: Uint8Array): Promise<void> => {
    return await this.nexus.postMessageWithResponse('fs.writeFile', {
      path,
      data,
    });
  };
  private rm = async (path: string): Promise<void> => {
    return await this.nexus.postMessageWithResponse('fs.rm', path);
  };
  private mkdir = async (
    path: string,
    opts: { recursive: boolean },
  ): Promise<void> => {
    return await this.nexus.postMessageWithResponse('fs.mkdir', { path, opts });
  };
  private rmdir = async (path: string): Promise<void> => {
    return await this.nexus.postMessageWithResponse('fs.rmdir', path);
  };
  private cp = async (src: string, dest: string): Promise<void> => {
    return await this.nexus.postMessageWithResponse('fs.cp', { src, dest });
  };
  private readdir = async (path: string): Promise<FSEntity[]> => {
    return await this.nexus.postMessageWithResponse('fs.readdir', path);
  };
  public getCapability = () => {
    return FSCapabilityFactory(() => {
      return {
        readFile: this.readFile,
        writeFile: this.writeFile,
        rm: this.rm,
        mkdir: this.mkdir,
        rmdir: this.rmdir,
        cp: this.cp,
        readdir: this.readdir,
      };
    });
  };
}
