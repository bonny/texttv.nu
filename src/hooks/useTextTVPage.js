import { useState, useEffect } from "react";
import { isPlatform } from "@ionic/react";
import {
  getCacheBustTimeString,
  sendStats,
} from "../functions";

/**
 * Custom hook for fetching TextTV pages
 * 
 * @param {string} pageNum - The page number to fetch
 * @param {string} pageId - Optional page ID for archived pages
 * @param {number} refreshTime - Timestamp to trigger refresh
 * @returns {Object} - Object containing page data, loading state, and error state
 */
export const useTextTVPage = (pageNum, pageId, refreshTime) => {
  const [pageData, setPageData] = useState([]);
  const [pageIsLoading, setPageIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPageContents() {
      // Bail if no page is set
      if (!pageNum && !pageId) {
        return;
      }

      setPageIsLoading(true);
      setError(null);

      // Get latest page if only pageNum is provided,
      // get archive page if pageId is provided
      let url;

      // Set to seconds integer to fake a slow answer.
      const slowAnswer = false;
      let slowAnswerQueryString = slowAnswer
        ? `&slow_answer=${slowAnswer}`
        : "";

      // Group API calls with cachebuster string
      const cacheBustTimeString = getCacheBustTimeString(15);

      let platform = "";

      if (isPlatform("ios")) {
        platform = "ios";
      } else if (isPlatform("android")) {
        platform = "android";
      } else {
        platform = "web";
      }

      const appId = "texttvapp." + platform;

      if (pageId) {
        url = `https://api.texttv.nu/api/getid/${pageId}/${pageNum}?cb=${cacheBustTimeString}&app=${appId}${slowAnswerQueryString}`;
      } else {
        url = `https://api.texttv.nu/api/get/${pageNum}?cb=${cacheBustTimeString}&app=${appId}${slowAnswerQueryString}`;
      }

      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch page: ${response.status}`);
        }
        
        const data = await response.json();
        
        setPageData(data);
        sendStats(data, "view");
      } catch (err) {
        setError(err.message || "Failed to fetch page");
        console.error("Error fetching TextTV page:", err);
      } finally {
        setPageIsLoading(false);
      }
    }

    fetchPageContents();
  }, [pageNum, pageId, refreshTime]);

  return { pageData, pageIsLoading, error };
}; 