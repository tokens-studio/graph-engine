# @tokens-studio/graph-editor

![Version](https://img.shields.io/npm/v/@tokens-studio/graph-editor.svg)
![License](https://img.shields.io/npm/l/@tokens-studio/graph-editor.svg)

## Description

Graph editor component

## Installation

To use the @tokens-studio/graph-editor package in your project, you can install it via npm:

```bash
npm install @tokens-studio/graph-editor
```

## Basic Usage

To use the exported editor component, make sure to import the global styles as well:

```jsx
import React from 'react';
import { Editor } from '@tokens-studio/graph-editor';
//Load the required styles
import '@tokens-studio/graph-editor/dist/index.css';

function App() {
  return (
    <div>
      <Editor />
    </div>
  );
}

export default App;
```

## API

The Editor component allows you to build and manage token resolver graphs in your application. Below is an example of how to use the Editor component along with its API.

```jsx
import React, { useRef } from 'react';
import { Editor } from '@tokens-studio/graph-editor';
import '@tokens-studio/graph-editor/index.css'; // Make sure to import the global styles

function MyGraphEditor() {
  const editorRef = useRef(null);

  // Function to handle saving the graph
  const handleSave = () => {
    const editorState = editorRef.current.save();
    // Use the editorState containing nodes, edges, and node states as needed
    console.log(editorState);
  };

  // Function to handle loading the graph
  const handleLoad = () => {
    const data = /* Fetch your graph data */;
    editorRef.current.load(data);
  };

  return (
    <div>
      <Editor ref={editorRef} />

      {/* Buttons to trigger the save and load functions */}
      <button onClick={handleSave}>Save Graph</button>
      <button onClick={handleLoad}>Load Graph</button>
    </div>
  );
}

```

In the example above, we use the useRef hook to create a reference to the Editor component. This allows us to interact with the editor imperatively using the save() and load() functions.

**save()**: The save() function is called on the Editor component's ref, and it returns the current state of the editor. The state includes information about nodes, edges, and node states.

**load()**: The load(data) function allows you to load a specific graph data into the editor. You can fetch the data from an external source or use data from a previously saved state.
