/**
 * Polyfill for Node.js util/types module
 * This provides basic type checking functionality needed by Undici
 */

/* eslint-disable no-undef */

// Basic type checkers that mimic Node.js util/types functionality
const isAnyArrayBuffer = obj => obj instanceof ArrayBuffer || (typeof window !== 'undefined' && 'SharedArrayBuffer' in window && obj instanceof window.SharedArrayBuffer);
const isArrayBufferView = obj => ArrayBuffer.isView(obj);
const isAsyncFunction = obj => Object.prototype.toString.call(obj) === '[object AsyncFunction]';
const isDate = obj => obj instanceof Date;
const isMap = obj => obj instanceof Map;
const isPromise = obj => obj !== null && typeof obj === 'object' && typeof obj.then === 'function';
const isRegExp = obj => obj instanceof RegExp;
const isSet = obj => obj instanceof Set;
const isTypedArray = obj => ArrayBuffer.isView(obj) && !(obj instanceof DataView);
const isUint8Array = obj => obj instanceof Uint8Array;

/**
 * Adapts event handlers for charts/components
 * This is needed by Recharts library
 */
const adaptEventHandlers = (handlers, data, dataKey) => {
  if (!handlers || typeof handlers !== 'object') {
    return {};
  }

  // Create a new object with all handlers properly adapted
  const adapted = {};
  
  // Process each event handler
  Object.keys(handlers).forEach(eventName => {
    const handler = handlers[eventName];
    
    if (typeof handler === 'function') {
      adapted[eventName] = (e) => {
        // Call the original handler with appropriate context
        handler(data, dataKey, e);
      };
    }
  });
  
  return adapted;
};

/**
 * Adapts events of child components for Recharts legends
 * This function is used by the DefaultLegendContent component in Recharts
 */
const adaptEventsOfChild = (props, data, dataKey) => {
  if (!props || typeof props !== 'object') {
    return {};
  }

  // Create a new props object with adapted event handlers
  const result = {};
  
  // Iterate through all props and adapt event handlers (typically onClick, onMouseEnter, etc.)
  Object.keys(props).forEach(key => {
    const value = props[key];
    
    // Check if the property is an event handler (starts with 'on')
    if (key.startsWith('on') && typeof value === 'function') {
      result[key] = (e) => {
        // Call the original handler with the context Recharts expects
        value(data, dataKey, e);
      };
    } else {
      // For non-event properties, just copy them
      result[key] = value;
    }
  });
  
  return result;
};

// Export the polyfilled functionality
module.exports = {
  isAnyArrayBuffer,
  isArrayBufferView,
  isAsyncFunction,
  isDate,
  isMap,
  isPromise,
  isRegExp,
  isSet,
  isTypedArray,
  isUint8Array,
  // Add the Recharts needed functions
  adaptEventHandlers,
  adaptEventsOfChild,
  // Add other type checks as needed
  isBoxedPrimitive: (val) => {
    return val !== null && typeof val === 'object' && (
      val instanceof Number || val instanceof String || 
      val instanceof Boolean || val instanceof Symbol ||
      (typeof window !== 'undefined' && 'BigInt' in window && typeof val.valueOf === 'function' && typeof val.valueOf() === 'bigint')
    );
  }

/* eslint-enable no-undef */
};
