/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalLoadOptions } from '@tokens-studio/graph-engine';
import { MessageHandler } from './messageHandler';

export class Loader {
  nexus: MessageHandler;
  cache: Record<string, any> = {};

  constructor(nexus: MessageHandler) {
    this.nexus = nexus;

    this.nexus.on('updatedResource', ({ uri, data }) => {
      this.cache[uri] = data;
    });
  }

  public getLoader = () => {
    return async (opts: ExternalLoadOptions) => {
      if (this.cache[opts.uri]) {
        return this.cache[opts.uri];
      }

      const data = await this.nexus.postMessageWithResponse(
        'loadResource',
        opts.uri,
      );

      //Cache
      this.cache[opts.uri] = data;
      return data;
    };
  };
}
