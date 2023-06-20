import { useCallback } from 'react';

/**
 * Add this to your keyUp event to call a function when the user presses enter
 * @param callback
 * @returns
 */
export const useOnEnter = (callback?: (event: React.KeyboardEvent) => void) => {
  return useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        callback && callback(event);
      }
    },
    [callback],
  );
};
