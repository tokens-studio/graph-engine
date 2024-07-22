/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from 'path';
import * as vscode from 'vscode';
import { FileSystem } from './capabilities/fs.js';
import { MessageHandler } from './messageHandler.js';
import { TSGraphDocument } from './document.js';
import { disposeAll } from './dispose.js';
import { getNonce } from './nonce.js';

const PREFIX = path.join('build');

/**
 * Provider for TS Graph editors.
 *
 * TS Graph editors are used for `.tsgraph` files, which are just `.json` files with a different file extension.
 *
 * This provider demonstrates:
 *
 * - How to implement a custom editor for binary files.
 * - Setting up the initial webview for a custom editor.
 * - Loading scripts and styles in a custom editor.
 * - Communication between VS Code and the custom editor.
 * - Using CustomDocuments to store information that is shared between multiple custom editors.
 * - Implementing save, undo, redo, and revert.
 * - Backing up a custom editor.
 */
export class TSGraphProvider
  implements vscode.CustomEditorProvider<TSGraphDocument>
{
  private static newTsGraphFileId = 1;

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    vscode.commands.registerCommand(
      'graph-engine-tokens-studio.graph.new',
      () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          vscode.window.showErrorMessage(
            'Creating new TS Graph files currently requires opening a workspace',
          );
          return;
        }

        const uri = vscode.Uri.joinPath(
          workspaceFolders[0].uri,
          `new-${TSGraphProvider.newTsGraphFileId++}.tsgraph`,
        ).with({ scheme: 'untitled' });

        vscode.commands.executeCommand(
          'vscode.openWith',
          uri,
          TSGraphProvider.viewType,
        );
      },
    );

    return vscode.window.registerCustomEditorProvider(
      TSGraphProvider.viewType,
      new TSGraphProvider(context),
      {
        // For this demo extension, we enable `retainContextWhenHidden` which keeps the
        // webview alive even when it is not visible. You should avoid using this setting
        // unless is absolutely required as it does have memory overhead.
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
      },
    );
  }

  private static readonly viewType = 'graph-engine-tokens-studio.graphFile';

  /**
   * Tracks all known webviews
   */
  private readonly webviews = new WebviewCollection();

  constructor(private readonly _context: vscode.ExtensionContext) {}

  //#region CustomEditorProvider

  async openCustomDocument(
    uri: vscode.Uri,
    openContext: { backupId?: string },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken,
  ): Promise<TSGraphDocument> {
    const document: TSGraphDocument = await TSGraphDocument.create(
      uri,
      openContext.backupId,
      {
        getFileData: async () => {
          const webviewsForDocument = Array.from(
            this.webviews.get(document.uri),
          );
          if (!webviewsForDocument.length) {
            throw new Error('Could not find webview to save for');
          }

          const panel = webviewsForDocument[0];

          const response =
            await panel.messageHandler.postMessageWithResponse<string>(
              'getFileData',
              {},
            );
          const data = new TextEncoder().encode(response);
          return data;
        },
      },
    );

    const listeners: vscode.Disposable[] = [];

    listeners.push(
      document.onDidChange((e) => {
        // Tell VS Code that the document has been edited by the use.
        this._onDidChangeCustomDocument.fire({
          document,
          ...e,
        });
      }),
    );

    listeners.push(
      document.onDidChangeContent((e) => {
        // Update all webviews when the document changes
        for (const webviewPanel of this.webviews.get(document.uri)) {
          webviewPanel.messageHandler.postMessage('update', {
            edits: e.edits,
            content: e.content,
          });
        }
      }),
    );

    document.onDidDispose(() => disposeAll(listeners));

    return document;
  }

  async resolveCustomEditor(
    document: TSGraphDocument,
    webviewPanel: vscode.WebviewPanel,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken,
  ): Promise<void> {
    // Setup initial content for the webview
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    const messageHandler = new MessageHandler(webviewPanel, document);

    // Add the webview to our internal set of active webviews
    const entry = this.webviews.add(document.uri, webviewPanel, messageHandler);

    new FileSystem(entry);

    messageHandler.on('ready', () => {
      if (document.uri.scheme === 'untitled') {
        messageHandler.postMessage('init', {
          untitled: true,
          editable: true,
        });
      } else {
        const editable = vscode.workspace.fs.isWritableFileSystem(
          document.uri.scheme,
        );

        messageHandler.postMessage('init', {
          value: JSON.parse(new TextDecoder().decode(document.documentData)),
          editable,
        });
      }
    });
  }

  private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<
    vscode.CustomDocumentEditEvent<TSGraphDocument>
  >();
  public readonly onDidChangeCustomDocument =
    this._onDidChangeCustomDocument.event;

  public saveCustomDocument(
    document: TSGraphDocument,
    cancellation: vscode.CancellationToken,
  ): Thenable<void> {
    return document.save(cancellation);
  }

  public saveCustomDocumentAs(
    document: TSGraphDocument,
    destination: vscode.Uri,
    cancellation: vscode.CancellationToken,
  ): Thenable<void> {
    return document.saveAs(destination, cancellation);
  }

  public revertCustomDocument(
    document: TSGraphDocument,
    cancellation: vscode.CancellationToken,
  ): Thenable<void> {
    return document.revert(cancellation);
  }

  public backupCustomDocument(
    document: TSGraphDocument,
    context: vscode.CustomDocumentBackupContext,
    cancellation: vscode.CancellationToken,
  ): Thenable<vscode.CustomDocumentBackup> {
    return document.backup(context.destination, cancellation);
  }

  //#endregion

  /**
   * Get the static HTML used for in our editor's webviews.
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const manifest = require(
      path.join(this._context.extensionPath, PREFIX, '.vite', 'manifest.json'),
    );
    const mainScript = manifest['index.html']['file'];

    const styles = manifest['index.html']['css']
      .map((style: string) => {
        const styleUri = webview.asWebviewUri(
          vscode.Uri.file(
            path.join(this._context.extensionPath, PREFIX, style),
          ),
        );

        return `<link rel="stylesheet" type="text/css" href="${styleUri}">`;
      })
      .join('\n');

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this._context.extensionPath, PREFIX, mainScript),
      ),
    );

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return /* html */ `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

                ${styles}


				<title>Graph</title>
                 <base href="${webview.asWebviewUri(vscode.Uri.file(path.join(this._context.extensionPath, PREFIX)))}">
			</head>
			<body>
	            <noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				<script  type="module" nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}

export type WebviewObject = {
  readonly resource: string;
  readonly messageHandler: MessageHandler;
  readonly webviewPanel: vscode.WebviewPanel;
};

/**
 * Tracks all webviews.
 */
class WebviewCollection {
  private readonly _webviews = new Set<WebviewObject>();

  /**
   * Get all known webviews for a given uri.
   */
  public *get(uri: vscode.Uri): Iterable<WebviewObject> {
    const key = uri.toString();
    for (const entry of this._webviews) {
      if (entry.resource === key) {
        yield entry;
      }
    }
  }

  /**
   * Get all known webviews for a given uri.
   */
  public *getWebview(uri: vscode.Uri): Iterable<vscode.WebviewPanel> {
    const key = uri.toString();
    for (const entry of this._webviews) {
      if (entry.resource === key) {
        yield entry.webviewPanel;
      }
    }
  }

  public *getHandler(uri: vscode.Uri): Iterable<MessageHandler> {
    const key = uri.toString();
    for (const entry of this._webviews) {
      if (entry.resource === key) {
        yield entry.messageHandler;
      }
    }
  }

  /**
   * Add a new webview to the collection.
   */
  public add(
    uri: vscode.Uri,
    webviewPanel: vscode.WebviewPanel,
    messageHandler: MessageHandler,
  ) {
    const entry = { resource: uri.toString(), webviewPanel, messageHandler };
    this._webviews.add(entry);

    webviewPanel.onDidDispose(() => {
      this._webviews.delete(entry);
    });
    return entry;
  }
}
