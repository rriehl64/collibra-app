/**
 * Domain color mapping with 508-compliant colors
 * All colors provide sufficient contrast ratio for accessibility
 * Format: { background, text, border } for each domain
 */

interface DomainColorScheme {
  background: string;
  text: string;
  border: string;
}

// 508-compliant color schemes with good contrast ratios
export const domainColors: Record<string, DomainColorScheme> = {
  // USCIS blue with high contrast
  Customer: {
    background: '#e6f0fa',
    text: '#003366',
    border: '#003366'
  },
  // Accessible green
  Finance: {
    background: '#e6f5e9',
    text: '#0d5f26',
    border: '#0d5f26'
  },
  // Accessible purple
  Marketing: {
    background: '#f2e6f5',
    text: '#5a1e72',
    border: '#5a1e72'
  },
  // Accessible orange
  Operations: {
    background: '#fff1e6',
    text: '#943500',
    border: '#943500'
  },
  // Accessible red
  Product: {
    background: '#fce8e8',
    text: '#991b1b',
    border: '#991b1b'
  },
  // Accessible teal
  HR: {
    background: '#e6f5f5',
    text: '#074e4e',
    border: '#074e4e'
  },
  // Neutral gray for "Other" or unspecified
  Other: {
    background: '#f0f0f0',
    text: '#333333',
    border: '#666666'
  },
  // Default fallback if domain is undefined
  default: {
    background: '#f0f0f0', 
    text: '#333333',
    border: '#666666'
  }
};

/**
 * Get domain color scheme based on domain name
 * @param domain Domain name
 * @returns Color scheme object
 */
export const getDomainColorScheme = (domain: string | undefined): DomainColorScheme => {
  if (!domain) return domainColors.default;
  return domainColors[domain] || domainColors.default;
};
