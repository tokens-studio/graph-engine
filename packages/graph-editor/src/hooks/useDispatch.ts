import { Dispatch } from '../redux/store.tsx';
import { useDispatch as ReduxDispatch } from 'react-redux';
export const useDispatch = <T = Dispatch>() => {
  return ReduxDispatch() as T;
};
