import { useCallback } from 'react';
import {
  getNearestLink,
  hidePageUpdatedToasts,
  logPageView,
} from "../functions";

/**
 * Custom hook for handling TextTV page navigation
 * 
 * @param {object} history - React Router history object
 * @returns {Function} - Click handler function
 */
export const useTextTVPageNavigation = (history) => {
  const handleClick = useCallback((e) => {
    const link = getNearestLink(e);

    // Bail if no link was found
    if (!link || link.nodeName !== "A") {
      return;
    }

    // If it's not a page but e.g. a regular link,
    // we follow it normally, i.e., let the page open
    // in the device's web browser.
    let target = link.getAttribute("target");
    if (target && target === "_blank") {
      return;
    }

    // Don't follow the link since we manually push to history
    e.preventDefault();

    // href is '/100', '/101-102', '150,163'
    let href = link.getAttribute("href");

    // Make sure string begins with "/"
    if (!href.startsWith("/")) {
      href = `/${href}`;
    }

    // Also keep version of href without / for stats
    const linkPageNum = href.replace(/\//g, "");

    // Hide any visible toasts
    // TODO: hide toast via state and not via query selector + api method
    hidePageUpdatedToasts();

    logPageView(linkPageNum, "click");

    const fullUrl = `/sidor${href}`;
    history.push(fullUrl);
  }, [history]);

  return handleClick;
}; 