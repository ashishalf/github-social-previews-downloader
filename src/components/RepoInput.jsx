import { useState } from 'react';
import { parseGithubUrl } from '../utils/parseGithubUrl';

/**
 * RepoInput.jsx
 *
 * Input form for entering a GitHub repository URL or owner/repo shorthand.
 * Validates the input and triggers the preview detection callback.
 *
 * Props:
 *   - onSubmit({ owner, repo }): called with parsed owner/repo on valid submission
 *   - inputValue: controlled input value
 *   - setInputValue: setter for the controlled input value
 *   - isLoading: boolean to disable the button during loading
 */
export default function RepoInput({ onSubmit, inputValue, setInputValue, isLoading }) {
  const [error, setError] = useState('');

  /**
   * Handle form submission — validate and parse the URL
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Don't submit if already loading
    if (isLoading) return;

    // Validate input is not empty
    if (!inputValue.trim()) {
      setError('Please enter a GitHub repository URL.');
      return;
    }

    // Parse the input
    const parsed = parseGithubUrl(inputValue);

    if (!parsed) {
      setError(
        'Invalid GitHub repository URL. Use format: owner/repo or https://github.com/owner/repo'
      );
      return;
    }

    // Trigger the parent callback with parsed owner/repo
    onSubmit(parsed);
  };

  /**
   * Handle input change — clear any previous error
   */
  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        {/* URL input field */}
        <div className="relative flex-1">
          {/* Search icon inside input */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg
              className="h-5 w-5 text-ghMuted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Paste GitHub URL or type owner/repo..."
            disabled={isLoading}
            className="w-full pl-11 pr-4 py-3 bg-ghBg border border-ghBorder rounded-lg
                       text-ghText placeholder-[#484f58]
                       focus:outline-none focus:border-ghAccent focus:ring-1 focus:ring-ghAccent
                       disabled:opacity-60 disabled:cursor-not-allowed
                       transition-colors duration-200"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-ghGreen hover:bg-ghGreenHover
                     disabled:opacity-60 disabled:cursor-not-allowed
                     text-white font-semibold rounded-lg
                     transition-colors duration-200 whitespace-nowrap
                     flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Detecting...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Get Preview
            </>
          )}
        </button>
      </form>

      {/* Error message */}
      {error && (
        <div className="mt-3 flex items-start gap-2 animate-fade-in">
          <svg
            className="h-4 w-4 text-ghRed flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575L6.457 1.047zM8 5a.75.75 0 00-.75.75v2.5a.75.75 0 001.5 0v-2.5A.75.75 0 008 5zm1 6a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <p className="text-ghRed text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}