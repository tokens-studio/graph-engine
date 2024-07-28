/* eslint-disable @typescript-eslint/no-explicit-any */
import { TSGraphDocument } from './document';
import { WebviewPanel } from 'vscode';

type Callback = (message: any, requestId?: number) => void;

export class MessageHandler {
  private _requestId = 1;
  private readonly _callbacks = new Map<number, (response: any) => void>();

  private handlers = new Map<string, Callback[]>();

  private document: TSGraphDocument;
  private webview: WebviewPanel;

  constructor(webview: WebviewPanel, document: TSGraphDocument) {
    this.document = document;
    this.webview = webview;

    webview.webview.onDidReceiveMessage((e) => this.onMessage(e));
  }

  public postMessage(type: string, body?: any): void {
    this.webview.webview.postMessage({ type, body });
  }

  public postResponse(requestId: number, body: any = null): void {
    this.webview.webview.postMessage({ type: 'response', requestId, body });
  }

  public postMessageWithResponse<R = unknown>(
    type: string,
    body: any,
  ): Promise<R> {
    const requestId = this._requestId++;
    const p = new Promise<R>((resolve) =>
      this._callbacks.set(requestId, resolve),
    );
    this.webview.webview.postMessage({ type, requestId, body });
    return p;
  }

  public on(type: string, callback: Callback) {
    this.handlers.set(type, [...(this.handlers.get(type) || []), callback]);
    return () => this.off(type, callback);
  }

  public off(type: string, callback: Callback) {
    this.handlers.set(
      type,
      (this.handlers.get(type) || []).filter((cb) => cb !== callback),
    );
  }

  private onMessage(message: any) {
    switch (message.type) {
      case 'response': {
        const callback = this._callbacks.get(message.requestId);
        callback?.(message.body);
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
