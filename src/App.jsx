import { useState, useCallback } from 'react';

// Components
import Header from './components/Header';
import RepoInput from './components/RepoInput';
import PreviewCard from './components/PreviewCard';
import TrendingRepos from './components/TrendingRepos';

// Utilities
import { parseGithubUrl } from './utils/parseGithubUrl';
import { getPreviewImage } from './utils/getPreviewImage';

/**
 * App.jsx — Root application component.
 *
 * Manages the global state for:
 *   - Input value (controlled)
 *   - Preview detection state (image URL, loading, error)
 *
 * Orchestrates the flow between user input, preview detection,
 * and trending repo selection.
 */
function App() {
  // Controlled input value for the repo URL field
  const [inputValue, setInputValue] = useState('');

  // Preview detection state
  const [previewData, setPreviewData] = useState({
    imageUrl: null,
    owner: '',
    repo: '',
    loading: false,
    error: null,
  });

  /**
   * Handle form submission — triggers the 3-condition preview detection.
   * Called when the user submits the input form or clicks a trending repo.
   *
   * @param {{ owner: string, repo: string }} parsed - The parsed owner and repo.
   */
  const handleSubmit = useCallback(async ({ owner, repo }) => {
    // Set loading state
    setPreviewData({
      imageUrl: null,
      owner,
      repo,
      loading: true,
      error: null,
    });

    try {
      // Run the 3-condition preview detection
      const result = await getPreviewImage(owner, repo);

      if (result) {
        // ✅ Preview found
        setPreviewData({
          imageUrl: result.url,
          owner,
          repo,
          loading: false,
          error: null,
        });
      } else {
        // ❌ No preview available (Condition 3)
        setPreviewData({
          imageUrl: null,
          owner,
          repo,
          loading: false,
          error: 'No social preview available for this repository.',
        });
      }
    } catch (err) {
      // ❌ Unexpected error
      console.error('Preview detection error:', err);
      setPreviewData({
        imageUrl: null,
        owner,
        repo,
        loading: false,
        error: 'Failed to detect social preview. Please try again.',
      });
    }
  }, []);

  /**
   * Handle trending repo card click.
   * Fills the input field and triggers preview detection automatically.
   *
   * @param {string} repoString - The "owner/repo" string from the card.
   */
  const handleTrendingSelect = useCallback(
    (repoString) => {
      // Fill the input field
      setInputValue(repoString);

      // Parse and trigger preview
      const parsed = parseGithubUrl(repoString);
      if (parsed) {
        handleSubmit(parsed);
      }
    },
    [handleSubmit]
  );

  return (
    <div className="min-h-screen bg-ghBg flex flex-col">
      {/* ── Header ── */}
      <Header />

      {/* ── Main Content ── */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Hero section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Download GitHub
            <br className="hidden sm:block" />
            <span className="text-ghAccent"> Social Previews</span>
          </h2>
          <p className="text-ghMuted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Paste any GitHub repository URL to instantly preview and download
            its Open Graph social preview image.
          </p>
        </div>

        {/* Input section */}
        <RepoInput
          onSubmit={handleSubmit}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={previewData.loading}
        />

        {/* Preview section */}
        <PreviewCard
          imageUrl={previewData.imageUrl}
          owner={previewData.owner}
          repo={previewData.repo}
          loading={previewData.loading}
          error={previewData.error}
        />

        {/* Trending repos section */}
        <TrendingRepos onSelect={handleTrendingSelect} />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-ghBorder bg-ghCard mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-ghMuted text-sm">
            Made With ❤️ By{' '}
            <a
              href="https://github.com/ashishalf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ghAccent hover:underline font-semibold"
            >
              Ashish Kumar
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;