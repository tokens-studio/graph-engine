import { graphSelector } from '@/redux/selectors/graph.ts';
import { Graph } from '@tokens-studio/graph-engine';
import { useSelector } from 'react-redux';
export const useGraph = ():Graph => {
  return useSelector(graphSelector);
};
