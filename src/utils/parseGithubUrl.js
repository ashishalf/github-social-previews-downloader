/**
 * parseGithubUrl.js
 *
 * Parses a GitHub repository URL or shorthand "owner/repo" string
 * and extracts the owner and repository name.
 *
 * Supported input formats:
 *   - https://github.com/owner/repo
 *   - http://github.com/owner/repo
 *   - github.com/owner/repo
 *   - www.github.com/owner/repo
 *   - owner/repo
 *
 * @param {string} input - The user-provided GitHub URL or owner/repo string.
 * @returns {{ owner: string, repo: string } | null} Parsed result or null if invalid.
 */
export function parseGithubUrl(input) {
  // Guard clause: input must be a non-empty string
  if (!input || typeof input !== 'string') {
    return null;
  }

  // Clean whitespace and trailing slashes
  const trimmed = input.trim().replace(/\/+$/, '');

  // Pattern 1: Full GitHub URL
  // Matches https://github.com/owner/repo with optional protocol and www
  const urlPattern =
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/?(?:[#?].*)?$/;
  const urlMatch = trimmed.match(urlPattern);

  if (urlMatch) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2],
    };
  }

  // Pattern 2: Shorthand owner/repo
  // Matches simple owner/repo format without URL prefix
  const shortPattern = /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/;
  const shortMatch = trimmed.match(shortPattern);

  if (shortMatch) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2],
    };
  }

  // Input didn't match any known pattern
  return null;
}