/**
 * useDebounce Hook
 * 
 * A custom hook that provides a debounced value of the input value.
 * This helps prevent excessive operations (like API calls) when a value
 * changes rapidly (e.g. during typing).
 */

import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of the provided value
 * @template T The type of the value to debounce
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds
 * @returns The debounced value
 */
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if value changes or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Export both as named and default export to support both import styles
export { useDebounce };
export default useDebounce;
