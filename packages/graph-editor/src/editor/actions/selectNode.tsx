export const selectNode = (dispatch) => {
  return (id: string) => {
    dispatch.graph.setCurrentNode(id);
  };
};
