# @tokens-studio/graph-engine

## 4.3.0

### Minor Changes

- 79b16d7: Add find First and linear search nodes.
- 6d9b5c3: Added new string manipulation nodes:
  - Case Convert: Transform strings between camelCase, snake_case, kebab-case, and PascalCase
  - Replace: Simple string replacement without regex
  - Normalize: String normalization with accent removal options

### Patch Changes

- df74698: Add hex to color space selector

## 4.2.0

### Minor Changes

- 7253355: Add Color Range node that lets you create a gradient between two colors and sample steps on it.

### Patch Changes

- 87b0016: Fixes an issue with loading not working , relaxes restriction on requiring an input nodes as part of execution via options

## 4.1.0

### Minor Changes

- 9ff1317: Created the Match Alpha node which finds the alpha value that can be used to composite two colors to match a reference third color.
- 8bc1646: Add a parseNumber node that lets you parse a string into a number.
- 2f2e130: Index Array node now accepts negative index values
- f90f677: Add Alternating, Fibonacci, Linear and Power series.
- 9f72ce5: Add indicies to sort tokens by, which helps you to select the right items.
- be053ca: Add inverse linear node.
- aa21dae: Add Sample Array from Float Curve node that gives you n values from your float curve.
- befed71: Add a new node for css clamp function that outputs your accessible css clamp function for fluid dimensions.
- b60c9d0: Add Flip Float Curve node, this lets you change the curves as needed for light, dark mode for example.
- c4edd77: An Array Length node was added to get the length of an array.
- 3dd0c82: Add distance node to math, to calculate the distance between two numbers.
- 18f41d3: Add Closest Number node that allows you to get the closest number from an array of numbers.
- a986fde: Add exponantial distribution node to spread a number over a length of items, with adjusting the decay.

### Patch Changes

- 9ab88a2: Fixing the issue of min and max size being mixed up in the fluid node, this wasn't resolving before.
- 3bea85f: Fix Nan values in color deconstruct if the channel doesn't output something.
- 7519a23: Fixed Sort Colors By node not working with Contrast.
- 9ab88a2: Fix issue on accessible clamp node that would break on mixed up min and max values.

## 4.0.0

### Major Changes

- 02c859b: Removed .getInput and .getRawInput from the Node. Direct access to the underlying ports are preferred over these utility methods
- 02c859b: Removed .setOutput from the Node class, this should be replaced with direct port manipulation
- 02c859b: Removed .getOutput from the node. This was never used and can rather be implemented as a utility method
- 02c859b: Removed getAllOutputs from the Node definition, this was never used and can rather be implemented as a utility

### Minor Changes

- 9fed81e: Removes tsup completely to prevent bundling, and rather to use raw typescript compilation
- 64d2acd: Add Replace Item node which lets you replace a specific item of an array.
- 02c859b: Add typing/hasValue node that lets you check if a value is present
- 02c859b: Add pad node that lets you fill a string to a certain lenght with a given character, like 25 to 025
- 7b4a564: Add support for all colorjs color spaces in the color nodes like color to string
- fb46f15: Upgrade mafs library to latest & remove mathjax

## 3.1.0

### Minor Changes

- 02620af: Add typing/hasValue node that lets you check if a value is present
- bc39aeb: Add pad node that lets you fill a string to a certain lenght with a given character, like 25 to 025
- 83abbb5: Add Inject Item into Array node, this allows you to add a new item to the array at a given index, also allowing negative index to go last to first

### Patch Changes

- 381fc4d: Fix output of split string to array

## 3.0.2

### Patch Changes

- 8af0662: Fixed an issue with deserialization of a subgraph node where inputs and outputs would not be computed correctly
- e4f6c2c: Fix an issue where we were saving the color space name instead of the id which caused errors in conversion

## 3.0.1

### Patch Changes

- d116ff8: Fix an issue where we were saving the color space name instead of the id which caused errors in conversion

## 3.0.0

### Major Changes

- 6f7a482: Replaced Nearest Tokens with sort Color by node, also removed the inverted, this can be done through array reverse.

### Minor Changes

- 57522d0: Added colorToString and stringToColor to handle stringification of the color spaces
- 42618c0: Add range mapping node, this node lets you map from one range to another.
- 42618c0: Add Dimension and Reference types
- 42618c0: Added Object path and Assert Defined as a core node, added nodes to handle creating the specific complex objects for the types in the design tokens package
- fa6723b: Changed registering capabilities to be async if needed

### Patch Changes

- 18b45c4: The deserialization of nodes is now asynchronous to better support loading in dynamic values which might be external
- 18b45c4: Fixed an issue with duplicate external loader definitions
- 18b45c4: Removed the unused linear sample. Will be replaced with f curves in the future
- 18b45c4: Improved performance by removing the ripple behavior in setting a value

## 2.0.0

### Major Changes

- 787af7d: Rename input channel d to alpha
- 6321006: Added support for different contrast algorithms Weber, Michelson, APCA, Lstar, DeltaPhi, WCAG21
  Renamed WCAG Version to algorithm
  Added validation to distance node
- f5a622a: Fix contrasting color node
- 7a7bb9e: BREAKING: Clean up publishing standards, ESM-only, no legacy fields.
- 921f878: Changed how color was represented to better support more exotic color spaces. Also removed the advanced blend node as culori is an unnecessary complication
- 6321006: Remove Join Array from array and add to string nodes
- 921f878: Remove Blend Node and split it up into Lighten, Darken, Mix nodes
- 6321006: Move Base Font Size Node to Typography section and add precision.
  Move Contrast from Accessibility to Color

### Minor Changes

- 11dc900: Add deconstruct color node to seperate a color into it's channels
- 6321006: Change output to color for Color Blindness node
- 8d0f934: Set dynamic types for variadic inputs
- 6321006: Add Lighte, Darken, Mix nodes to colors
- 921f878: Add range mapping node, this node lets you map from one range to another.
- 6321006: Remove mixing option from the blend node, you now have a mix node for this
- 921f878: Add string interpolation node for easier naming
- 6321006: Add WCAG Version selector for contrast node, you can now select between 2.1 and 3.0 (APCA)
- addb50d: Add preset bezier curves and a create bezier curve
- 1e68191: Adds filter , find and flatten to array transformations

### Patch Changes

- 921f878: Fixes color compare preview node to crash when entering a non valid color string
- 921f878: Array Index is now inferring the type

## 1.0.0

### Major Changes

- 069b413: Major overhaul for strong typing v2

### Patch Changes

- 069b413: Fixes the color wheel calculation.

## 0.17.5

### Patch Changes

- 813f33c: Fix issue with squash node indexing

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
