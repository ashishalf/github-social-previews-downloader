/**
 * RepoCard.jsx
 *
 * A single clickable card representing a GitHub repository.
 * Displays the owner's avatar, full name, optional description,
 * and star count. Clicking triggers the preview generation.
 *
 * Props:
 *   - owner: repository owner login
 *   - repo: repository name
 *   - description: optional repo description
 *   - stars: optional star count number
 *   - onClick(repoString): callback when the card is clicked
 */
export default function RepoCard({ owner, repo, description, stars, onClick }) {
  return (
    <button
      onClick={() => onClick(`${owner}/${repo}`)}
      className="group w-full bg-ghCard border border-ghBorder rounded-lg p-4
                 text-left cursor-pointer
                 hover:border-ghAccent hover:bg-ghCard/80
                 focus-visible:border-ghAccent
                 transition-all duration-200
                 hover:shadow-lg hover:shadow-ghAccent/5"
      aria-label={`Preview ${owner}/${repo}`}
    >
      <div className="flex items-start gap-3">
        {/* Owner avatar */}
        <img
          src={`https://github.com/${owner}.png?size=40`}
          alt={`${owner} avatar`}
          className="h-10 w-10 rounded-full border border-ghBorder flex-shrink-0
                     group-hover:border-ghAccent transition-colors duration-200"
          loading="lazy"
          onError={(e) => {
            // Fallback if avatar fails to load
            e.target.src = `https://ui-avatars.com/api/?name=${owner}&background=30363d&color=c9d1d9&size=40`;
          }}
        />

        <div className="min-w-0 flex-1">
          {/* Repository full name */}
          <p className="text-ghAccent font-semibold group-hover:underline truncate">
            {owner}/{repo}
          </p>

          {/* Optional description */}
          {description && (
            <p className="text-ghMuted text-xs mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Star count and click hint */}
          <div className="flex items-center gap-3 mt-2">
            {stars !== undefined && stars !== null && (
              <div className="flex items-center gap-1 text-ghMuted text-xs">
                <svg
                  className="h-3.5 w-3.5 text-ghYellow"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                </svg>
                <span>{Number(stars).toLocaleString()}</span>
              </div>
            )}

            <span className="text-ghMuted/50 text-xs group-hover:text-ghAccent/70 transition-colors">
              Click to preview →
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}