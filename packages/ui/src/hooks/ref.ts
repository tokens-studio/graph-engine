import { useCallback, useRef, MutableRefObject } from 'react';
import { useDispatch } from './useDispatch.ts';

/**
 * Add this to your keyUp event to call a function when the user presses enter
 * @param callback
 * @returns
 */
export const useRegisterRef = <T>(
  name: string,
): [MutableRefObject<T>, (x: T) => void] => {
  const dispatch = useDispatch();

  const ref = useRef<T>() as MutableRefObject<T>;

  const register = useCallback(
    (value) => {
      ref.current = value;
      dispatch.refs.set({
        key: name,
        value: ref,
      });
    },
    [dispatch.refs, name],
  );

  return [ref, register];
};
