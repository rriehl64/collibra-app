import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page when navigation occurs.
 * This ensures better accessibility by providing a consistent viewing experience
 * when navigating between routes.
 * 
 * Should be placed inside the Router component in App.tsx.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top with smooth behavior for better user experience
    // Unless reduced motion is preferred (handled by CSS)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Additionally, set focus to the main content for screen readers
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
