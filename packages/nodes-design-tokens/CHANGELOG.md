# @tokens-studio/graph-engine

## 7.2.1

### Patch Changes

- 116141a: Renamed Destruct Token to Deconstruct Token

## 7.2.0

### Minor Changes

- 94c6d31: We added the Create Reference node which makes it easier to create a reference string from other strings, you are able to just add a string per segment and it wraps it in {} and adds the . as seperator

## 7.1.1

### Patch Changes

- cf7b567: Fixed inverted node error
- d428728: Fixed spelling mistake

## 7.1.0

### Minor Changes

- 8b95696: Added array group/ungroup nodes for token arrays

### Patch Changes

- 809ef95: Upgrade @tokens-studio dependencies to latest, to avoid un-dedupable shared deps with Studio App and stitches styles from old UI leaking through.
- 433ddb5: Fixes the incorrectly typed Tokenset Schema

## 7.0.0

### Patch Changes

- Updated dependencies [87b0016]
- Updated dependencies [fe1ae29]
- Updated dependencies [7253355]
  - @tokens-studio/graph-engine@4.2.0
  - @tokens-studio/graph-editor@4.3.7

## 6.0.0

### Minor Changes

- ca67761: Add Alphabetic and Alphanumeric nodes for A, B, C and A7, B14, C21 naming.
- ca67761: Add Greek Letter node to get alpha, beta, gamma, ... names.
- 917632a: Add a T-Shirt size naming node to help with scale naming. You can choose between 3 schemas.
- ca67761: Add numeric naming node. Lets you do naming like level-1 or scale-100x
- ca67761: Added Hierachy Level node that lets you use primary, secondary, ... names

### Patch Changes

- 8e207c5: Fixed centering of EmptyStateEditor
- 8e207c5: Improved settings panel UI.
- Updated dependencies [9ab88a2]
- Updated dependencies [3bea85f]
- Updated dependencies [89d2dd0]
- Updated dependencies [902df8c]
- Updated dependencies [9ff1317]
- Updated dependencies [8e207c5]
- Updated dependencies [8bc1646]
- Updated dependencies [2f2e130]
- Updated dependencies [f90f677]
- Updated dependencies [9f72ce5]
- Updated dependencies [be053ca]
- Updated dependencies [aa21dae]
- Updated dependencies [befed71]
- Updated dependencies [b60c9d0]
- Updated dependencies [8e207c5]
- Updated dependencies [c4edd77]
- Updated dependencies [3dd0c82]
- Updated dependencies [7519a23]
- Updated dependencies [89d2dd0]
- Updated dependencies [18f41d3]
- Updated dependencies [9ab88a2]
- Updated dependencies [a986fde]
  - @tokens-studio/graph-engine@4.1.0
  - @tokens-studio/graph-editor@4.3.1

## 5.0.0

### Major Changes

- 02c859b: Update to use the latest exposed input manipulation from the engine via direct control

### Minor Changes

- 9fed81e: Removes tsup completely to prevent bundling, and rather to use raw typescript compilation

### Patch Changes

- Updated dependencies [02c859b]
- Updated dependencies [9fed81e]
- Updated dependencies [64d2acd]
- Updated dependencies [02c859b]
- Updated dependencies [02c859b]
- Updated dependencies [02c859b]
- Updated dependencies [02c859b]
- Updated dependencies [7b4a564]
- Updated dependencies [02c859b]
- Updated dependencies [02c859b]
- Updated dependencies [fb46f15]
  - @tokens-studio/graph-engine@4.0.0
  - @tokens-studio/graph-editor@4.3.0

## 4.1.0

### Minor Changes

- cd66e2c: Removed bundling from build step to support treeshaking

## 4.0.0

### Patch Changes

- 0c1e6a4: Improves the typescript typing for the nodes for programmatic usage
- Updated dependencies [5878649]
- Updated dependencies [02620af]
- Updated dependencies [bc39aeb]
- Updated dependencies [83abbb5]
- Updated dependencies [ac96d35]
- Updated dependencies [381fc4d]
- Updated dependencies [5af49ac]
  - @tokens-studio/graph-editor@4.2.0
  - @tokens-studio/graph-engine@3.1.0

## 3.0.1

### Patch Changes

- 8af0662: Fixed an issue where arrayToSet node did not result in an object with nested keys and instead only ever a single level deep
- Updated dependencies [8af0662]
- Updated dependencies [e4f6c2c]
- Updated dependencies [8af0662]
  - @tokens-studio/graph-engine@3.0.2
  - @tokens-studio/graph-editor@4.1.1

## 3.0.0

### Major Changes

- 6f7a482: Replaced Nearest Tokens with sort Color by node, also removed the inverted, this can be done through array reverse.
- 7325125: Update port names on most set/array operations

### Minor Changes

- 18b45c4: Fixed the typing on the external set
- 42618c0: Add Dimension and Reference types
- 42618c0: Added Object path and Assert Defined as a core node, added nodes to handle creating the specific complex objects for the types in the design tokens package

### Patch Changes

- Updated dependencies [42618c0]
- Updated dependencies [18b45c4]
- Updated dependencies [57522d0]
- Updated dependencies [18b45c4]
- Updated dependencies [6f7a482]
- Updated dependencies [18b45c4]
- Updated dependencies [42618c0]
- Updated dependencies [42618c0]
- Updated dependencies [18b45c4]
- Updated dependencies [18b45c4]
- Updated dependencies [42618c0]
- Updated dependencies [18b45c4]
- Updated dependencies [18b45c4]
- Updated dependencies [45eb061]
- Updated dependencies [965946d]
- Updated dependencies [fa6723b]
- Updated dependencies [18b45c4]
- Updated dependencies [18b45c4]
  - @tokens-studio/graph-editor@4.1.0
  - @tokens-studio/graph-engine@3.0.0

## 2.0.0

### Major Changes

- 7a7bb9e: BREAKING: Clean up publishing standards, ESM-only, no legacy fields.
- 921f878: Changed how color was represented to better support more exotic color spaces. Also removed the advanced blend node as culori is an unnecessary complication

### Patch Changes

- 267a9f1: Improve the offset on the bezier in the editor.
  Fix the typing on the invert node.
  Remove code for the obscure distance
- Updated dependencies [d45e99c]
- Updated dependencies [267a9f1]
- Updated dependencies [11dc900]
- Updated dependencies [5486cac]
- Updated dependencies [e09aa3f]
- Updated dependencies [787af7d]
- Updated dependencies [cd86a3b]
- Updated dependencies [6321006]
- Updated dependencies [921f878]
- Updated dependencies [921f878]
- Updated dependencies [6321006]
- Updated dependencies [b3301e0]
- Updated dependencies [f5a622a]
- Updated dependencies [8d0f934]
- Updated dependencies [7a7bb9e]
- Updated dependencies [6321006]
- Updated dependencies [921f878]
- Updated dependencies [a6651ac]
- Updated dependencies [921f878]
- Updated dependencies [921f878]
- Updated dependencies [6321006]
- Updated dependencies [921f878]
- Updated dependencies [6321006]
- Updated dependencies [6321006]
- Updated dependencies [cb050f0]
- Updated dependencies [addb50d]
- Updated dependencies [921f878]
- Updated dependencies [921f878]
- Updated dependencies [6321006]
- Updated dependencies [56fb988]
- Updated dependencies [1e68191]
  - @tokens-studio/graph-editor@4.0.0
  - @tokens-studio/graph-engine@2.0.0

## 1.0.0

### Patch Changes

- Updated dependencies [069b413]
- Updated dependencies [069b413]
  - @tokens-studio/graph-engine@1.0.0
  - @tokens-studio/graph-editor@3.0.0

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
