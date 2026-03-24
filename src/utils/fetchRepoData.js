/**
 * fetchRepoData.js
 *
 * GitHub API se COMPLETE repo data + contributor avatars fetch karta hai
 */

export async function fetchRepoData(owner, repo) {
  try {
    // ─── Main Repo Data ───────────────────────────
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );

    if (!repoRes.ok) throw new Error(`API error: ${repoRes.status}`);
    const repoData = await repoRes.json();

    // ─── Top Contributors (with avatars) ──────────
    let contributors = [];
    let contributorsCount = 0;

    try {
      const contribRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=6`,
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      );

      if (contribRes.ok) {
        const contribData = await contribRes.json();
        contributors = contribData.map((c) => ({
          login: c.login,
          avatar: c.avatar_url,
          contributions: c.contributions,
        }));

        // Total count from Link header
        const linkHeader = contribRes.headers.get('Link');
        if (linkHeader) {
          const lastMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (lastMatch) {
            contributorsCount = parseInt(lastMatch[1], 10) * 6;
          } else {
            contributorsCount = contributors.length;
          }
        } else {
          contributorsCount = contributors.length;
        }
      }
    } catch (err) {
      console.warn('Contributors fetch failed:', err.message);
    }

    return {
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description || '',
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      watchers: repoData.subscribers_count || 0,
      openIssues: repoData.open_issues_count || 0,
      language: repoData.language || '',
      topics: repoData.topics || [],
      license: repoData.license?.spdx_id || '',
      owner: {
        login: repoData.owner?.login || owner,
        avatarUrl: repoData.owner?.avatar_url || '',
        type: repoData.owner?.type || 'User',
      },
      contributors,
      contributorsCount,
    };
  } catch (error) {
    console.error('fetchRepoData failed:', error);
    return null;
  }
}

export function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
}