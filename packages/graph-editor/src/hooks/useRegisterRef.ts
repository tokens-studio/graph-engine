import { MutableRefObject, useCallback, useRef } from 'react';
import { useDispatch } from './useDispatch.js';

export const useRegisterRef = <T>(name: string): ((x: T) => void) => {
  const dispatch = useDispatch();

  const ref = useRef<T>() as MutableRefObject<T>;

  const register = useCallback(
    (value) => {
      ref.current = value;
      dispatch.refs.setRef({
        key: name,
        value: ref,
      });
    },
    [dispatch, name],
  );

  return register;
};
