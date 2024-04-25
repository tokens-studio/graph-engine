# Graph Execution SDK

This is an automatically generated SDK for the graph engine backend.

Please see the generated code for more info

```ts
import {GraphService,OpenAPI} from '@tokens-studio/graph-engine-sdk';
//This can also be imported directly from the above entrypoint, however this shows that we can tree shake as well
import {GraphCreationParams, Graph } from '@tokens-studio/graph-engine-sdk/types.gen';

const myCoolGraph:GraphCreationParams = //...

OpenAPI.TOKEN = //... my token
OpenAPI.BASE = 'https://api.tokens.studio/graph'


const response = await GraphService.createGraph(myCoolGraph )

```