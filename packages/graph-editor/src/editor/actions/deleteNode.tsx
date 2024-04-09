export const deleteNode = (graph, dispatch) => {

    return (id: string) => {
        const node = graph.removeNode(id);
        dispatch.graph.checkClearSelectedNode(id);

        if (node) {
            dispatch.graph.appendLog({
                time: new Date(),
                type: 'info',
                data: {
                    id: id,
                    msg: `Node deleted`
                },

            })
        }
    }
}