import { BatchExecution, Graph } from '@tokens-studio/graph-engine';

// const data = {
//     name: 'root',
//     value: 5,
//     children: [
//         {
//             name: 'custom tooltip',
//             value: 1,

//             // Each node can specify a "tooltip" to be shown on hover.
//             // By default, the node's "name" will be used for this.
//             tooltip: 'Custom tooltip shown on hover',
//         },
//         {
//             name: 'custom colors',

//             // Each node can also provide a custom "backgroundColor" or text "color".
//             backgroundColor: '#35f',
//             color: '#fff',

//             value: 3,
//             children: [
//                 {
//                     name: 'leaf',
//                     value: 2
//                 }
//             ]
//         },
//     ],
// };

export const convertToFlameGraph = (
  graph: Graph,
  batchExecution: BatchExecution,
) => {
  const data = {
    name: 'root',
    //Has to be a minimum of 1
    value: batchExecution.end - batchExecution.start || 1,
    children: [],
  };

  data.children = batchExecution.order.reduce((acc, id) => {
    const actualNode = graph.getNode(id);

    const node = batchExecution.stats[id];
    const start = node.start - batchExecution.start;
    const end = node.end - batchExecution.start;

    const value = end - start;

    if (!value) {
      return acc;
    }

    return acc.concat([
      {
        name: graph.getNode(id).factory.title,
        value,
        tooltip: id,
        // children: [],
      },
    ]);
  }, []);

  return data;
};
