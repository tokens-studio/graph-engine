/* eslint-disable @typescript-eslint/no-explicit-any */

type Callback = {
  resolve: (response: any) => void;
  reject: (error: any) => void;
};

export class MessageHandler {
  private _requestId = 1;
  private readonly _callbacks = new Map<number, Callback>();

  private handlers = new Map<
    string,
    ((message: any, requestId?: string) => void)[]
  >();

  private vscode;

  constructor() {
    this.vscode = acquireVsCodeApi();

    window.addEventListener('message', (event) => {
      this.onMessage(event.data);
    });
  }

  public dispose() {
    window.removeEventListener('message', this.onMessage);
  }

  public postMessage(type: string, body?: any): void {
    this.vscode.postMessage({ type, body });
  }

  public postResponse(requestId: number, body: any): void {
    this.vscode.postMessage({ type: 'response', requestId, body });
  }

  public postMessageWithResponse<R = unknown>(
    type: string,
    body: any,
  ): Promise<R> {
    const requestId = this._requestId++;
    const p = new Promise<R>((resolve, reject) =>
      this._callbacks.set(requestId, { resolve, reject }),
    );
    this.vscode.postMessage({ type, requestId, body });
    return p;
  }

  public on(type, callback) {
    this.handlers.set(type, [...(this.handlers.get(type) || []), callback]);
    return () => this.off(type, callback);
  }

  public off(type, callback) {
    this.handlers.set(
      type,
      (this.handlers.get(type) || []).filter((cb) => cb !== callback),
    );
  }

  private onMessage(message: any) {
    switch (message.type) {
      case 'response': {
        const callback = this._callbacks.get(message.requestId);
        if (message.error) {
          callback?.reject(message.body);
        } else {
          callback?.resolve(message.body);
        }
        return;
      }
      default: {
        const handlers = this.handlers.get(message.type);
        handlers?.forEach((handler) =>
          handler(message.body, message.requestId),
        );

        if (!handlers) {
          console.warn(`No handler for message type ${message.type}`);
        }
      }
    }
  }
}
