import React from 'react';

/**
 * Component that displays attribution/source for current text TV pages.
 * 
 * @param {Array} pageData - The page data to display attribution for
 * @returns {JSX.Element} - The attribution component
 */
export const TextTVPageAttribution = ({ pageData = [] }) => {
  return (
    <aside className="TextTVPage__attribution">
      <p>{pageData.length === 1 ? "Källa:" : "Källor:"}</p>
      <ul>
        {pageData.map((page) => {
          if (pageData && pageData.length) {
            return (
              <li key={page.num}>
                svt.se/text-tv/{page.num} • Hämtad{" "}
                {new Date(page.date_updated_unix * 1000).toLocaleString()}
              </li>
            );
          } else {
            return null;
          }
        })}
      </ul>
    </aside>
  );
}; 