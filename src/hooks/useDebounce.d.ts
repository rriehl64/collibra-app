/**
 * Type declarations for useDebounce hook
 */

/**
 * Returns a debounced version of the provided value
 * @template T The type of the value to debounce
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds
 * @returns The debounced value
 */
declare function useDebounce<T>(value: T, delay: number): T;

export { useDebounce };
export default useDebounce;
