# @tokens-studio/graph-engine

## 1.0.0

### Patch Changes

- Updated dependencies [069b413]
- Updated dependencies [069b413]
  - @tokens-studio/graph-engine@1.0.0

## 0.17.4

### Patch Changes

- 1160ca8: Fixed an issue with the dropPanel height overflow. Fixed the resolve Tokens node to properly adhere to the existing typography and boxshadow structure

## 0.17.3

### Patch Changes

- 08de54a: Fixed Remap Node and updated usability

## 0.17.2

### Patch Changes

- ba4bb9c: Update miniizeFlowGraph to be quiet if disconnected edges are detected

## 0.17.1

### Patch Changes

- 473c0a3: Update miniizeFlowGraph to be quiet if disconnected edges are detected
- e068662: Remove console.log message from join string

## 0.17.0

### Minor Changes

- 248400c: Added new set color value node, added color as constant input type, added new array name node for incremental naming
- 6e58e27: Add CSS function node

### Patch Changes

- 69ea7b7: extract functions and presort items

## 0.16.0

### Minor Changes

- 22c6c01: Add Array Pass Unit Node
- 990b5a6: Update Series nodes to be more aligned
- 1c8fa1c: Added precision to arithmetic, geometric and harmonic series

## 0.15.3

### Patch Changes

- be2fe56: Bump engine for latest changes

## 0.15.2

### Patch Changes

- 1270113: Fix error on empty state for contrast node

## 0.15.1

### Patch Changes

- f52e0d7: Removed apca-w3 and replaced it with colorjs.io

## 0.15.0

### Minor Changes

- 612bc38: Exposes an extra output in token sets to allow users to interact with the set as an object

### Patch Changes

- 612bc38: Fixes how tokens are exposed in the token set to follow scope naming

## 0.14.0

### Minor Changes

- bd2346b: Exposes an extra output in token sets to allow users to interact with the set as an object

## 0.13.1

### Patch Changes

- cbc7ab3: Fixes the extract single token node which was never extracting the token

## 0.13.0

### Minor Changes

- c0fcbd6: Add Node Nearest to Color
- 4296c47: Add color name node
- bf4f5a1: Add regex support to select tokens node
- 53b29d3: Add split string node

## 0.12.0

### Minor Changes

- a7baf6d: add ungroup node, add select single token node, fix input issue on group and extract tokens

### Patch Changes

- 91da25d: Fix an issue with ESM loading not working correctly. Converts the input of the extract Tokens and Extract Single Token Node to use Regex

## 0.11.0

### Minor Changes

- de6a6f0: add ungroup node, add select single token node, fix input issue on group and extract tokens

### Patch Changes

- de6a6f0: Fix an issue with ESM loading not working correctly. Converts the input of the extract Tokens and Extract Single Token Node to use Regex

## 0.10.0

### Minor Changes

- eefa966: add ungroup node, add select single token node, fix input issue on group and extract tokens
- eaf05cd: Add Contrasting from Set node to return the first element of an array that has sufficient contrast

## 0.9.0

### Minor Changes

- ca1ed6d: Adds in a group and extract node for set manipulation

### Patch Changes

- ca1ed6d: Fix an issue with the editor where clicking on edges did not work as expected. Fixed an issue where the code was not being set correctly during the load of the initial graph

## 0.8.0

### Minor Changes

- d2096c1: Adds in a group and extract node for set manipulation

## 0.7.0

### Minor Changes

- 3a38bfe: Adds a base font node based on german DIN 1450 and calculates the min required font size for readability
- ed80a0b: Add a sort array node
- 4e19200: Adds a string join node

### Patch Changes

- e04601d: Trig should throw an error
- ab797ce: Fixed an issue with the basefont node

## 0.6.1

### Patch Changes

- f077533: Fixed input validation for tokenset input

## 0.6.0

### Minor Changes

- 732f6ee: - Adds a parse Unit node.
  - Adds `align-items` to the exposed UI
  - Adds native supports for tokenSets in input
  - Adds Json node (alpha)
- 732f6ee: Added new nodes for array concatenation and css box models

## 0.5.0

### Minor Changes

- 7644d05: - Adds a parse Unit node.
  - Adds `align-items` to the exposed UI
  - Adds native supports for tokenSets in input
  - Adds Json node (alpha)
- 7644d05: Added new nodes for array concatenation and css box models

## 0.4.0

### Minor Changes

- 745e1a2: - Adds a parse Unit node.
  - Adds `align-items` to the exposed UI
  - Adds native supports for tokenSets in input
  - Adds Json node (alpha)

## 0.3.0

### Minor Changes

- be38194: Add new node for contrasting color supporting wcag 2.1 and 3.0
- b1a09fd: Add Color Wheel node
- 823ac1e: Added Objectify and Dotprop nodes

### Patch Changes

- 122c050: Fixed issue with slider not working as expected

## 0.2.2

### Patch Changes

- a67b830: Some nodes were not exported, namely the convert node from color

## 0.2.1

### Patch Changes

- ec4a20a: Fix exposure of graph controls

## 0.2.0

### Minor Changes

- c95ee97: Removed graphlib dependency and swapped it out for an internal representation

## 0.1.0

### Minor Changes

- 4e36db5: Add more test nodes and fix culori problem
- d30d954: Added Advanced blend node, fixe bugs in remap and added step down in the harmonic

## 0.0.4

### Patch Changes

- 16716d0: Fixed issue with remap not respecting the input key and rather using the index

## 0.0.3

### Patch Changes

- a4f784f: Remove husky as postinstall script. It was affecting downstream users

## 0.0.2

### Patch Changes

- f5bff7c: Adds support for external load side effect with ephemeral data as well as protecting against dangling edges

## 0.0.1

### Patch Changes

- ed3e391: Add extra docs
