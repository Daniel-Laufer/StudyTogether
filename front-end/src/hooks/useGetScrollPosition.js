/* eslint-disable no-undef */

// Source: https://github.com/Daniel-Laufer/portfolio_website/blob/main/src/hooks/useGetScrollPosition.js
import { useState, useEffect } from 'react';

const useGetScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const getScrollPosition = () => {
    setScrollPosition(window.scrollY);
  };
  useEffect(() => {
    window.addEventListener('scroll', getScrollPosition);

    return () => window.removeEventListener('scroll', getScrollPosition);
  }, []);

  return scrollPosition;
};

export default useGetScrollPosition;
