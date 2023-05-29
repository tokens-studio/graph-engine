# Phases

The graph engine goes through multiple phases as it is evaluated. All phases are represented as functions on the node definition and are expected to be [pure functions](https://en.wikipedia.org/wiki/Pure_function) to help the graph engine efficiently cache internally.

1. Set Inputs

If the node depends on prior inputs, the system will create an object as a key value store with inputs from other nodes

2. Map inputs

Key values stores are not always appropriate data structures. Some nodes might want to change the input to rather be in the form of an array. They do so using the mapInputs function on the nodeDefinition which allows them to transform their inputs. This is an optional step. 

Mapping might depend on the configuration of the node, hence the state can be used during this phase.

3. Validate inputs

After the inputs have been mapped, we will likely want to check that they are correct. This uses the mapped input from the prior phases as well as the state config.

4. Load external

If the node depends on some external data, we use the stored state where we assume the reference will be and then attempt to load the ephemeral data. This is exposed to the consumer as a load request. It is important to note that the node should not be performing any ephemeral data loading itself. This would make it difficult to track in a multi user environment with say multiple users collaborating on a graph, hence it must be managed.

This step is never cached internally as remote data might change and we rely on the user to manage caching at this layer.

5. Processing

All the data from the prior steps is now available to the node to perform processing. 

6. Output mapping

The output of the processing might have different forms, hence we provide a last phase to coerce the data into a key value object so that it may be routed to consuming node(s). The keys should be stable.