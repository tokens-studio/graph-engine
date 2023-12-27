import { graphSelector } from '@/redux/selectors/graph.ts';
import { useSelector } from 'react-redux';
export const useGraph = () => {
  return useSelector(graphSelector);
};
