import { useState } from 'react';

/**
 * PreviewCard.jsx
 * 
 * Direct download using Canvas method.
 * No proxy needed. Image directly download hoti hai.
 */
export default function PreviewCard({ imageUrl, owner, repo, loading, error }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  /**
   * Direct download using Canvas approach
   * Image ko canvas pe draw karo, phir blob banaake download karo
   */
  const handleDownload = async () => {
    if (!imageUrl || downloading) return;
    setDownloading(true);

    try {
      // Method 1: Canvas se direct download
      const downloaded = await downloadViaCanvas(imageUrl, `${repo}-social-preview.png`);
      
      if (!downloaded) {
        // Method 2: Fetch blob via proxy
        await downloadViaProxy(imageUrl, `${repo}-social-preview.png`);
      }
    } catch (err) {
      console.error('Download failed:', err);
      // Method 3: Last fallback - direct link
      downloadViaLink(imageUrl, `${repo}-social-preview.png`);
    } finally {
      setDownloading(false);
    }
  };

  // ─── Loading State ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 animate-fade-in">
        <div className="bg-ghCard border border-ghBorder rounded-lg p-10 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-ghBorder border-t-ghAccent" />
          <p className="mt-5 text-ghMuted text-lg">Detecting social preview...</p>
          <p className="mt-1 text-ghMuted text-sm opacity-60">
            Checking {owner}/{repo}
          </p>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────
  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 animate-slide-up">
        <div className="bg-ghCard border border-ghRed/30 rounded-lg p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ghRed/10 mb-4">
            <svg className="h-8 w-8 text-ghRed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-ghRed text-lg font-medium">{error}</p>
          <p className="mt-2 text-ghMuted text-sm">
            Make sure the repository exists and is public.
          </p>
        </div>
      </div>
    );
  }

  // ─── Empty State ──────────────────────────────────────────────────
  if (!imageUrl) return null;

  // ─── Success State ────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-slide-up">
      <div className="bg-ghCard border border-ghBorder rounded-lg overflow-hidden">

        {/* Repo name header */}
        <div className="px-6 py-4 border-b border-ghBorder flex items-center gap-2.5">
          <svg className="h-5 w-5 text-ghMuted flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
          </svg>
          <a
            href={`https://github.com/${owner}/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ghAccent font-semibold hover:underline"
          >
            {owner}/{repo}
          </a>
        </div>

        {/* Image preview */}
        <div className="p-4 sm:p-6">
          {!imageLoaded && (
            <div className="w-full aspect-[2/1] bg-ghBorder/30 rounded-lg animate-pulse" />
          )}
          <img
            id="preview-img"
            src={imageUrl}
            alt={`${owner}/${repo} social preview`}
            crossOrigin="anonymous"
            onLoad={() => setImageLoaded(true)}
            className={`w-full rounded-lg border border-ghBorder preview-image ${
              imageLoaded ? 'preview-image-loaded' : 'preview-image-loading'
            }`}
          />
        </div>

        {/* Action buttons */}
        <div className="px-4 sm:px-6 py-4 border-t border-ghBorder flex flex-col sm:flex-row gap-3">

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={downloading || !imageLoaded}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                       bg-ghGreen hover:bg-ghGreenHover
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-white font-semibold rounded-lg
                       transition-colors duration-200"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Downloading...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Preview
              </>
            )}
          </button>

          {/* Copy URL button */}
          <button
            onClick={handleCopyUrl}
            disabled={!imageLoaded}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                       bg-ghBtnBg hover:bg-ghBorder
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-ghText font-semibold rounded-lg
                       border border-ghBorder
                       transition-colors duration-200"
          >
            {copied ? (
              <>
                <svg className="h-5 w-5 text-ghSuccess" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-ghSuccess">Copied!</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Image URL
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  /**
   * Copy URL to clipboard
   */
  async function handleCopyUrl() {
    if (!imageUrl) return;
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = imageUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }
}

// ═══════════════════════════════════════════════════
// DOWNLOAD HELPER FUNCTIONS
// ═══════════════════════════════════════════════════

/**
 * Method 1: Canvas se download
 * Image ko canvas pe draw karo aur blob banaake download karo
 */
function downloadViaCanvas(imageUrl, filename) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Canvas banao image ke size ka
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Image draw karo canvas pe
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Canvas se blob banao
        canvas.toBlob((blob) => {
          if (blob) {
            // Blob se download link banao
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            resolve(true);
          } else {
            resolve(false);
          }
        }, 'image/png');
      } catch {
        resolve(false);
      }
    };

    img.onerror = () => resolve(false);

    // Timestamp lagao taaki cache na ho
    img.src = imageUrl + (imageUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
  });
}

/**
 * Method 2: CORS proxy se fetch karke download
 */
async function downloadViaProxy(imageUrl, filename) {
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`,
  ];

  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) continue;

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch {
      continue;
    }
  }

  throw new Error('All proxies failed');
}

/**
 * Method 3: Direct link se download (last fallback)
 */
function downloadViaLink(imageUrl, filename) {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = filename;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}