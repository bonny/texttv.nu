import { useEffect } from 'react';

/**
 * Custom hook for handling TextTV page update callbacks
 * 
 * @param {Function} onPageUpdate - Callback function to run when page data updates
 * @param {Array} pageData - The current page data
 * @param {string} pageNum - The current page number
 */
export const useTextTVPageUpdate = (onPageUpdate, pageData, pageNum) => {
  useEffect(() => {
    if (onPageUpdate) {
      onPageUpdate(pageData);
    }
  }, [pageNum, pageData, onPageUpdate]);
}; 