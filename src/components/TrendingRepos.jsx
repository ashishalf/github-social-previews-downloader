import { useState, useEffect } from 'react';
import RepoCard from './RepoCard';

/**
 * TrendingRepos.jsx
 *
 * Fetches and displays trending/popular GitHub repositories.
 * Uses the GitHub Search API to find top-starred repositories.
 * Falls back to a hardcoded list if the API call fails (rate limiting, etc.).
 *
 * Props:
 *   - onSelect(repoString): callback when a user clicks a repo card
 */

// Fallback list of popular repositories (used when API fails)
const FALLBACK_REPOS = [
  { owner: 'facebook', repo: 'react', description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.', stars: 225000 },
  { owner: 'vercel', repo: 'next.js', description: 'The React Framework for the Web.', stars: 125000 },
  { owner: 'microsoft', repo: 'vscode', description: 'Visual Studio Code — code editing redefined.', stars: 162000 },
  { owner: 'openai', repo: 'openai-cookbook', description: 'Examples and guides for using the OpenAI API.', stars: 58000 },
  { owner: 'supabase', repo: 'supabase', description: 'The open source Firebase alternative.', stars: 70000 },
  { owner: 'tailwindlabs', repo: 'tailwindcss', description: 'A utility-first CSS framework for rapid UI development.', stars: 81000 },
  { owner: 'denoland', repo: 'deno', description: 'A modern runtime for JavaScript and TypeScript.', stars: 94000 },
  { owner: 'sveltejs', repo: 'svelte', description: 'Cybernetically enhanced web apps.', stars: 78000 },
  { owner: 'vitejs', repo: 'vite', description: 'Next generation frontend tooling.', stars: 67000 },
  { owner: 'flutter', repo: 'flutter', description: 'Flutter makes it easy and fast to build beautiful apps.', stars: 164000 },
];

export default function TrendingRepos({ onSelect }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    fetchTrendingRepos();
  }, []);

  /**
   * Fetch trending repositories from GitHub Search API.
   * Searches for repos with >50k stars, sorted by stars descending.
   * Falls back to hardcoded list on failure.
   */
  const fetchTrendingRepos = async () => {
    try {
      const response = await fetch(
        'https://api.github.com/search/repositories?q=stars:>50000&sort=stars&order=desc&per_page=10',
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API responded with ${response.status}`);
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const formatted = data.items.map((item) => ({
          owner: item.owner.login,
          repo: item.name,
          description: item.description || '',
          stars: item.stargazers_count,
        }));
        setRepos(formatted);
      } else {
        throw new Error('No items returned');
      }
    } catch (error) {
      console.warn('Failed to fetch trending repos, using fallback list:', error.message);
      setFetchError(true);
      setRepos(FALLBACK_REPOS);
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading skeleton ─────────────────────────────────────────────
  if (loading) {
    return (
      <section className="w-full max-w-2xl mx-auto mt-14">
        {/* Section heading */}
        <SectionHeading />

        {/* Skeleton cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-ghCard border border-ghBorder rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-ghBorder" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-ghBorder rounded w-3/4" />
                  <div className="h-3 bg-ghBorder rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ─── Loaded state ─────────────────────────────────────────────────
  return (
    <section className="w-full max-w-2xl mx-auto mt-14 animate-fade-in">
      {/* Section heading */}
      <SectionHeading />

      {/* Info badge if using fallback */}
      {fetchError && (
        <p className="text-ghMuted text-xs mb-4 flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 8a8 8 0 1116 0A8 8 0 010 8zm8-6.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM6.5 7.75A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          Showing curated popular repositories
        </p>
      )}

      {/* Repository cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {repos.map((repo) => (
          <RepoCard
            key={`${repo.owner}/${repo.repo}`}
            owner={repo.owner}
            repo={repo.repo}
            description={repo.description}
            stars={repo.stars}
            onClick={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * SectionHeading — reusable heading for the trending section.
 */
function SectionHeading() {
  return (
    <h2 className="text-xl font-semibold text-ghText mb-6 flex items-center gap-2.5">
      {/* Fire / trending icon */}
      <svg
        className="h-5 w-5 text-ghOrange"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M7.998.002C7.998.002 3 5.604 3 9a5 5 0 0010 0c0-3.396-4.998-8.998-4.998-8.998zM8 14a3.5 3.5 0 01-3.5-3.5c0-1.18.39-2.44 1.165-3.774a.25.25 0 01.455.098c.178 1.057.746 1.97 1.632 2.593a.25.25 0 00.38-.217c-.016-1.2.3-2.3.878-3.34a.25.25 0 01.444.063C10.366 8.09 11.5 9.645 11.5 10.5A3.5 3.5 0 018 14z" />
      </svg>
      Trending GitHub Repositories
    </h2>
  );
}