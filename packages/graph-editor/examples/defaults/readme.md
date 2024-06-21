# Barebones example

In this example we show the bare minimum of having an editable graph. No menu is shown, or any other controls exposed.

The basics of the layout is provided by selecting an initial layout and passing it through.

We override the default set of nodes exposed from the engine to pass in our own.

## To run

1. Ensure the graph editor is built. This can be done by running `npm run dev:ui` in the root of the monorepo as the side effect of this build the graph-editor package

2. Execute `npm run dev` within this folder.
