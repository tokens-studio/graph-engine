# @tokens-studio/graph-editor

## 4.0.0

### Major Changes

- 7a7bb9e: BREAKING: Clean up publishing standards, ESM-only, no legacy fields.
- 921f878: Changed how color was represented to better support more exotic color spaces. Also removed the advanced blend node as culori is an unnecessary complication

### Minor Changes

- 921f878: Add keyboard shortcut to show/hide values inside the node
- b3301e0: Add better support for icons in the editor with both group and specific icons
- a6651ac: - Use ReactFlow selection state as source of truth
  - Elevate nodes on selection
  - Auto select nodes when added to the stage
  - Clear nodes selection when swithing graph tabs
- 1e68191: Adds filter , find and flatten to array transformations

### Patch Changes

- d45e99c: Add error boundaries to the graph editor panels
- 267a9f1: Improve the offset on the bezier in the editor.
  Fix the typing on the invert node.
  Remove code for the obscure distance
- 5486cac: Fix CSS properties import for CSS map node
- e09aa3f: Fix the center alignment of handles on a node
- cd86a3b: Add error boundary to nodes & fix color swatch error
- 921f878: Fixes color compare preview node to crash when entering a non valid color string
- cb050f0: Fixed an issue on input that was throwing an error if you create both an array and enumerated value
- 921f878: Add ability to update array inputs
- 56fb988: Fix the width of the color swatch on color compare node.
- Updated dependencies [11dc900]
- Updated dependencies [787af7d]
- Updated dependencies [6321006]
- Updated dependencies [921f878]
- Updated dependencies [6321006]
- Updated dependencies [f5a622a]
- Updated dependencies [8d0f934]
- Updated dependencies [7a7bb9e]
- Updated dependencies [6321006]
- Updated dependencies [921f878]
- Updated dependencies [921f878]
- Updated dependencies [921f878]
- Updated dependencies [6321006]
- Updated dependencies [921f878]
- Updated dependencies [6321006]
- Updated dependencies [6321006]
- Updated dependencies [addb50d]
- Updated dependencies [921f878]
- Updated dependencies [6321006]
- Updated dependencies [1e68191]
  - @tokens-studio/graph-engine@2.0.0

## 3.0.0

### Major Changes

- 069b413: Major overhaul for strong typing v2

### Patch Changes

- Updated dependencies [069b413]
- Updated dependencies [069b413]
  - @tokens-studio/graph-engine@1.0.0

## 2.10.0

### Minor Changes

- bdc94f2: Prevent toolpanel from covering canvas
- f954273: Add pointer-events to css map

## 2.9.5

### Patch Changes

- 813f33c: Fix issue with squash node indexing
- Updated dependencies [813f33c]
  - @tokens-studio/graph-engine@0.17.5

## 2.9.4

### Patch Changes

- 72eae83: Fix flatten node being stupid

## 2.9.3

### Patch Changes

- 1160ca8: Fixed an issue with the dropPanel height overflow. Fixed the resolve Tokens node to properly adhere to the existing typography and boxshadow structure
- Updated dependencies [1160ca8]
  - @tokens-studio/graph-engine@0.17.4

## 2.9.2

### Patch Changes

- bb8893a: Fixes an issue with required type assertion of json for imports

## 2.9.1

### Patch Changes

- 59dbbb2: Fixed an issue with missing package "mdn-data"
- 08de54a: Fixed Remap Node and updated usability
- a0f7a9f: Added new props to the editor: `showNodesPanel` and `onShowNodesPanelChange` to make appearance of nodes panel optional and controllable.
  Fixed vertical scroll of nodes panel
- Updated dependencies [08de54a]
  - @tokens-studio/graph-engine@0.17.3

## 2.9.0

### Minor Changes

- 248400c: Added new set color value node, added color as constant input type, added new array name node for incremental naming
- 217deb1: Change passUnit nodes to use MDN unit definitions
- 6e58e27: Add CSS function node

### Patch Changes

- 632150a: Rename Poline node in UI
- Updated dependencies [69ea7b7]
- Updated dependencies [248400c]
- Updated dependencies [6e58e27]
  - @tokens-studio/graph-engine@0.17.0

## 2.8.2

### Patch Changes

- ff9ab59: Fix contrasting from array nodes output

## 2.8.1

### Patch Changes

- 23cc354: Fix output of Contrasting from Set

## 2.8.0

### Minor Changes

- 41f6a49: Add border-image to css map
- 41f6a49: Add clip-path to css map
- 22c6c01: Add Array Pass Unit Node
- 990b5a6: Update Series nodes to be more aligned
- 1c8fa1c: Added precision to arithmetic, geometric and harmonic series

### Patch Changes

- Updated dependencies [22c6c01]
- Updated dependencies [990b5a6]
- Updated dependencies [1c8fa1c]
  - @tokens-studio/graph-engine@0.16.0

## 2.7.2

### Patch Changes

- 9fc6bd7: Add support for stringify node, fix an issue with subtract on initial load

## 2.7.1

### Patch Changes

- bb77dae: Fixes an import issue with elkjs

## 2.7.0

### Minor Changes

- dba5c05: add blending and blur to css map

### Patch Changes

- Updated dependencies [f52e0d7]
  - @tokens-studio/graph-engine@0.15.1

## 2.6.0

### Minor Changes

- 612bc38: Exposes an extra output in token sets to allow users to interact with the set as an object

### Patch Changes

- Updated dependencies [612bc38]
- Updated dependencies [612bc38]
  - @tokens-studio/graph-engine@0.15.0

## 2.5.0

### Minor Changes

- bd2346b: Exposes an extra output in token sets to allow users to interact with the set as an object

### Patch Changes

- Updated dependencies [bd2346b]
  - @tokens-studio/graph-engine@0.14.0

## 2.4.1

### Patch Changes

- ed4bdcb: Fixes an issue with the EditorProps which did not allow additional properties and forced certain properties to be required when they were optional

## 2.4.0

### Minor Changes

- 00941fe: Add an option to show or hide the side menu
- c0fcbd6: Add Node Nearest to Color
- 4296c47: Add color name node
- bf4f5a1: Add regex support to select tokens node
- 53b29d3: Add split string node

### Patch Changes

- 35e0533: showMenu is an optional value in the editor to hide the default menu sidebar
- Updated dependencies [c0fcbd6]
- Updated dependencies [4296c47]
- Updated dependencies [bf4f5a1]
- Updated dependencies [53b29d3]
  - @tokens-studio/graph-engine@0.13.0

## 2.3.0

### Minor Changes

- a7baf6d: add ungroup node, add select single token node, fix input issue on group and extract tokens

### Patch Changes

- 91da25d: Fix an issue with ESM loading not working correctly. Converts the input of the extract Tokens and Extract Single Token Node to use Regex
- Updated dependencies [a7baf6d]
- Updated dependencies [91da25d]
  - @tokens-studio/graph-engine@0.12.0

## 2.2.0

### Minor Changes

- de6a6f0: add ungroup node, add select single token node, fix input issue on group and extract tokens

### Patch Changes

- de6a6f0: Fix an issue with ESM loading not working correctly. Converts the input of the extract Tokens and Extract Single Token Node to use Regex
- Updated dependencies [de6a6f0]
- Updated dependencies [de6a6f0]
  - @tokens-studio/graph-engine@0.11.0

## 2.1.0

### Minor Changes

- eefa966: add ungroup node, add select single token node, fix input issue on group and extract tokens
- eaf05cd: Add Contrasting from Set node to return the first element of an array that has sufficient contrast

### Patch Changes

- Updated dependencies [eefa966]
- Updated dependencies [eaf05cd]
  - @tokens-studio/graph-engine@0.10.0

## 2.0.3

### Patch Changes

- 08ddaf2: Adjusts error styling for nodes
- 4de167b: Force bump to fix the pan drag setting
- b4d5c8a: Fixes Preview to have resize on the left
  Fixes behavior of opening and closing Preview
- 9c017b0: Adds hints on hover of node types to the drop panel as well as the Shift + K menu
- cce0c72: Adds Load example dialog to the empty state as well as to the toolbar
- 9ee84c2: Moves Settings to the left menu
- 9dd9239: Changes markerEnd to not include arrow head

## 2.0.2

### Patch Changes

- ca1ed6d: Fix an issue with the editor where clicking on edges did not work as expected. Fixed an issue where the code was not being set correctly during the load of the initial graph
- Updated dependencies [ca1ed6d]
- Updated dependencies [ca1ed6d]
  - @tokens-studio/graph-engine@0.9.0

## 2.0.1

### Patch Changes

- b94d6bb: Fixed issue with exposing exports correctly
- Updated dependencies [d2096c1]
  - @tokens-studio/graph-engine@0.8.0

## 2.0.0

### Major Changes

- 5070766: Major V2 update for the UI. Removes multiple tab support
- 5070766: Large overhaul of internals to better support keymaps, and window managers. Adds support for context menus as well as using tsup as the build tool of choice over rollup for better support for esm

### Patch Changes

- 5070766: Removed pan on right click as it affects the context menu that was added

## 1.3.0

### Minor Changes

- 3a38bfe: Adds a base font node based on german DIN 1450 and calculates the min required font size for readability
- 231a25e: Add support for other layout options
- ab797ce: Improved how custom nodes and groups can be exposed in the editor courtesy of @himanshu-satija. Users can now pass through the allowed nodes to expose

### Patch Changes

- ab797ce: Fixed an issue with the basefont node
- Updated dependencies [e04601d]
- Updated dependencies [ab797ce]
- Updated dependencies [3a38bfe]
- Updated dependencies [ed80a0b]
- Updated dependencies [4e19200]
  - @tokens-studio/graph-engine@0.7.0

## 1.2.1

### Patch Changes

- bbd381e: Fixed issue with exposing exports correctly

## 1.2.0

### Minor Changes

- 732f6ee: Added new nodes for array concatenation and css box models

### Patch Changes

- 732f6ee: Fix changeset
- Updated dependencies [732f6ee]
- Updated dependencies [732f6ee]
  - @tokens-studio/graph-engine@0.6.0

## 1.1.0

### Minor Changes

- 7644d05: Added new nodes for array concatenation and css box models

### Patch Changes

- Updated dependencies [7644d05]
- Updated dependencies [7644d05]
  - @tokens-studio/graph-engine@0.5.0

## 1.0.0

### Major Changes

- a16c12c: Initial
