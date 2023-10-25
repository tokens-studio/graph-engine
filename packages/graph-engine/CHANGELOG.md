# @tokens-studio/graph-engine

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
