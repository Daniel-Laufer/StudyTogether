/* eslint-disable no-undef */
import { useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 * source: https://stackoverflow.com/a/42234988
 */
function useOutsideAlerter(ref, func) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        func();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideAlerter;
