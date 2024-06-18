import { graphSelector } from '@/redux/selectors/graph.js';
import { Graph } from '@tokens-studio/graph-engine';
import { useSelector } from 'react-redux';
export const useGraph = (): Graph | undefined => {
  return useSelector(graphSelector);
};
