import { useEffect, useRef } from 'react';

export default <T extends HTMLElement>(
  callback: () => void,
  active = false,
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      //TODO: find a solution for this
      if (
        ref.current &&
        !ref.current.contains(target) &&
        target.nodeName !== 'BODY' &&
        target.nodeName !== 'HTML'
      ) {
        if (
          [...target.classList.values()].find((itm) =>
            itm.includes('react-colorful'),
          )
        ) {
          return;
        }

        callback();
      }
    };

    if (active) {
      document.addEventListener('click', handleClick, true);
    }

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [callback, ref, active]);

  return ref;
};
