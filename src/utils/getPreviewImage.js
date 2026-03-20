/**
 * getPreviewImage.js
 *
 * Detects the social preview image for a GitHub repository
 * using a 3-condition cascading logic:
 *
 *   Condition 1 → Auto-generated OG image from opengraph.githubassets.com
 *   Condition 2 → Custom social preview parsed from repo HTML meta tags
 *   Condition 3 → No preview available (returns null)
 *
 * No GitHub API token is required.
 */

// CORS proxy used to fetch GitHub HTML pages from the browser
const CORS_PROXY = 'https://corsproxy.io/?';

/**
 * Attempts to load an image URL in the browser.
 * Returns a promise that resolves to true on success, false on failure.
 *
 * @param {string} url - The image URL to test.
 * @param {number} timeout - Max time in ms to wait (default: 8000).
 * @returns {Promise<boolean>}
 */
function tryLoadImage(url, timeout = 8000) {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;

    // Timeout guard — if image takes too long, consider it failed
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(false);
      }
    }, timeout);

    img.onload = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        // Extra check: GitHub sometimes returns tiny 1x1 placeholder images
        resolve(img.naturalWidth > 1 && img.naturalHeight > 1);
      }
    };

    img.onerror = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(false);
      }
    };

    img.src = url;
  });
}

/**
 * Extracts the og:image URL from raw HTML string.
 *
 * @param {string} html - The raw HTML of a GitHub repo page.
 * @returns {string|null} The og:image content value, or null.
 */
function extractOgImage(html) {
  // Try multiple meta tag formats GitHub might use
  const patterns = [
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Main function — detects the social preview image for a GitHub repository.
 *
 * @param {string} owner - The repository owner/organization.
 * @param {string} repo - The repository name.
 * @returns {Promise<{ url: string, type: string } | null>}
 *   - url: The detected image URL.
 *   - type: 'auto' for auto-generated OG, 'custom' for manually set preview.
 *   - null if no preview is available.
 */
export async function getPreviewImage(owner, repo) {
  // ─── Condition 1: Auto-generated Open Graph Image ──────────────────
  // GitHub generates these for all public repositories automatically.
  const autoOgUrl = `https://opengraph.githubassets.com/1/${owner}/${repo}`;

  try {
    const loaded = await tryLoadImage(autoOgUrl);
    if (loaded) {
      return { url: autoOgUrl, type: 'auto' };
    }
  } catch (error) {
    console.warn('[Condition 1] Auto OG image check failed:', error.message);
  }

  // ─── Condition 2: Custom Social Preview from HTML Meta Tags ────────
  // Fetches the repository page via CORS proxy and extracts og:image.
  try {
    const targetUrl = `https://github.com/${owner}/${repo}`;
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;

    const response = await fetch(proxyUrl, {
      headers: { Accept: 'text/html' },
    });

    if (response.ok) {
      const html = await response.text();
      const ogImageUrl = extractOgImage(html);

      if (ogImageUrl) {
        // Verify the extracted image URL actually loads
        const imageLoaded = await tryLoadImage(ogImageUrl);
        if (imageLoaded) {
          return { url: ogImageUrl, type: 'custom' };
        }
      }
    }
  } catch (error) {
    console.warn('[Condition 2] HTML parsing failed:', error.message);
  }

  // ─── Condition 3: No Social Preview Available ──────────────────────
  return null;
}