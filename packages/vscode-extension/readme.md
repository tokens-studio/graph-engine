# VS Code extension

This is a proof of concept exploration of embedding the graph engine inside of VS Code for faster iteration of Tokens Studio graphs

## Features

- Provides a custom editor for the new file extension type `.tsgraph` which is a token studio specific format for the serialized graph.

- Custom icons for the `.tsgraph` format

- Provides a command to quick create new TS Graph files

## Requirements

No special requirements needed

## Extension Settings

No settings are currently exposed.

## Known Issues

Due to the embedding of the `@tokens-studio/graph-editor`, this requires a large initial page load. This will be rectified in future releases.

Due to how serialization occurs for array buffers and typed arrays, you must use engine 1.57.0 and above of vscode to prevent huge data transfer inefficiencies

## Release Notes

Please see the changelog included in the project for more information
