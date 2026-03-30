import { useState, useEffect } from 'react';

/**
 * Enterprise-grade Custom Hook for Debouncing high-frequency states.
 * Prevents rapid subsequent updates (like fast typing) from triggering costly network requests
 * until a specified delay has completely elapsed since the final keystroke.
 * 
 * @param {any} value - The raw state variable to debounce (e.g., search text)
 * @param {number} delay - The stabilization delay in milliseconds
 * @returns {any} - The mathematically stabilized version of the value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If the value changes before the delay completes, React instantly drops the old timer
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
