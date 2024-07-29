# <%- name %>,

This is an example workspace showing an idealized layout for the system as well as examples of settings to help a user organize their graph materials easily

## Breakdown

```
│   .tsgraphrc
│   metadata.json
│   package.json
│   tsconfig.json
│   user.json
│
├───assets
│   └───audio
│           example.wav
│
├───capabilities
├───editor
│   ├───controls
│   ├───icons
│   ├───nodes
│   └───previews
├───graphs
│   └───test
│           graph.metadata.json
│           graph.tsGraph
│
├───nodes
└───schemas
```

Let's step through each of these files to explain their function 

1. .tsgraphrc

This identifies the root of the graph project. It contains information on how to find other code files and assets. It also stores version information about the project. Note that this is independent of the package.json version and is used to identify the versioning of the project layout, not the actual code.

2. metadata.json

This is a file which stores global level metadata for the project such as editor config, logs , etc.

3. package.json

This is your standard nodejs package.json file. Install your custom nodes, etc here.

4. tsconfig.json

This is used to support typescript based projects. You do not need to use typescript and can delete this if you wish.

5. user.json

User specific project info. This should be gitignored and represents info about you as a user such as theming, etc.

6. assets

This folder is used to store assets for binary or text files. You can potentially lock down file based interactions in a graph to only view the assets folder

7. capabilities

Capabilities are graph level libraries that can be used to abstract away complexity and blackbox complicated mechanisms, such as file system interactions which might vary greatly depending on the platform where the graph is being executed. 

8. editor

The editor folder contains code specific to your editing experience within the UI. 

9. editor/controls

Controls are used to interact with the ports on a node. These could potentially be very complicated or specific to a use case, so you can either create a new control or override an existing control here.

10. nodes

You can create your own custom nodes and store them here. The nodes will be made available to your graphs
