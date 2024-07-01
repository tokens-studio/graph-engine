import { Graph } from '@tokens-studio/graph-engine';
import { graphSelector } from '@/redux/selectors/graph.js';
import { useSelector } from 'react-redux';
export const useGraph = (): Graph | undefined => {
  return useSelector(graphSelector);
};
