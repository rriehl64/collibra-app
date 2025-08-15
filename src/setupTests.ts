// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Configure jest-axe for accessibility testing
import { toHaveNoViolations } from 'jest-axe';

// Add the custom matcher to Jest
expect.extend(toHaveNoViolations);

// Mock window.matchMedia for responsive design testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver for component visibility testing
global.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: number[] = [0];
  
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    // Store options if provided
    if (options) {
      // Ensure root is either Element or null (not Document)
      this.root = options.root instanceof Element ? options.root : null;
      this.rootMargin = options.rootMargin || '0px';
      this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0];
    }
  }
  
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
};
