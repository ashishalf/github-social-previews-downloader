import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { fetchRepoData, formatNumber } from '../utils/fetchRepoData';

/**
 * CustomImageGenerator.jsx
 *
 * Bannerbear jaisa professional social preview generator
 * 4 distinct layouts + contributor avatars + real GitHub data
 * PreviewCard jaisa centered & responsive
 */

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', 'C++': '#f34b7d', Go: '#00ADD8', Rust: '#dea584',
  Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138', Kotlin: '#A97BFF',
  CSS: '#563d7c', HTML: '#e34c26', Shell: '#89e051', Dart: '#00B4AB',
  Vue: '#41b883', 'C#': '#178600', Lua: '#000080',
  'Jupyter Notebook': '#DA5B0B', Svelte: '#ff3e00',
};

export default function CustomImageGenerator({ owner, repo }) {
  const [layout, setLayout] = useState('github');
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [repoData, setRepoData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [customDesc, setCustomDesc] = useState('');
  const [previewScale, setPreviewScale] = useState(0.5);
  const templateRef = useRef(null);
  const previewWrapperRef = useRef(null);

  useEffect(() => {
    if (owner && repo) loadData();
  }, [owner, repo]);

  // ─ Dynamic scale: preview ko container ke hisaab se resize karo ──
  useEffect(() => {
    const updateScale = () => {
      if (previewWrapperRef.current) {
        const containerWidth = previewWrapperRef.current.offsetWidth;
        // 1280px content ko fit karo, max scale 0.5 (640px), min scale 0.25
        const scale = Math.min(containerWidth / 1280, 0.5);
        setPreviewScale(Math.max(scale, 0.25));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [showForm]);

  const loadData = async () => {
    setDataLoading(true);
    const data = await fetchRepoData(owner, repo);
    if (data) {
      setRepoData(data);
      setCustomDesc(data.description);
    }
    setDataLoading(false);
  };

  const handleGenerate = async () => {
    if (!templateRef.current) return;
    setGenerating(true);
    try {
      const el = templateRef.current;
      const parent = el.parentElement;

      // ─ Step 1: Save original styles ──
      const origTransform = el.style.transform;
      const origOrigin = el.style.transformOrigin;
      const origParentW = parent.style.width;
      const origParentH = parent.style.height;
      const origParentOverflow = parent.style.overflow;

      // ── Step 2: Remove scale → full size for capture ─
      el.style.transform = 'none';
      el.style.transformOrigin = 'unset';
      parent.style.width = '1280px';
      parent.style.height = '640px';
      parent.style.overflow = 'visible';

      await new Promise((r) => setTimeout(r, 100));

      // ── Step 3: Capture at FULL 1280x640 ──
      const dataUrl = await toPng(el, {
        width: 1280,
        height: 640,
        pixelRatio: 2,
        cacheBust: true,
        fetchRequestInit: { mode: 'cors' },
        style: {
          transform: 'none',
          transformOrigin: 'unset',
        },
      });

      // ── Step 4: Restore original styles ──
      el.style.transform = origTransform;
      el.style.transformOrigin = origOrigin;
      parent.style.width = origParentW;
      parent.style.height = origParentH;
      parent.style.overflow = origParentOverflow;

      // ── Step 5: Download ──
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${repo}-${layout}-preview.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Generation failed:', err);
      const el = templateRef.current;
      if (el) {
        el.style.transform = `scale(${previewScale})`;
        el.style.transformOrigin = 'top left';
      }
    } finally {
      setGenerating(false);
    }
  };

  const layouts = {
    github: { name: '📋 GitHub Classic', desc: 'Light header + clean layout' },
    terminal: { name: '🖥️ Terminal Dark', desc: 'macOS window + dark theme' },
    gradient: { name: '🌌 Gradient Pro', desc: 'Dark gradient + glow effects' },
    card: { name: '🃏 Card Modern', desc: 'White card + border accent' },
  };

  const desc = customDesc || repoData?.description || `A project by ${owner}`;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-slide-up px-4 sm:px-0">
      <div className="bg-ghCard border border-ghBorder rounded-lg overflow-hidden">
        {/* Toggle */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-ghBg/50 transition-colors"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-ghText flex items-center gap-2.5">
             Generate Custom Preview Image
          </h2>
          <svg
            className={`h-5 w-5 text-ghMuted transition-transform duration-200 ${showForm ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showForm && (
          <div className="px-4 sm:px-6 pb-6 border-t border-ghBorder pt-6 animate-fade-in">
            {/* Loading */}
            {dataLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-ghBorder border-t-ghAccent" />
                <p className="mt-4 text-ghMuted">Fetching repository data from GitHub...</p>
              </div>
            )}

            {repoData && !dataLoading && (
              <>
                {/* Description Input */}
                <div className="mb-5">
                  <label className="block text-ghMuted text-sm mb-2">Description:</label>
                  <input
                    type="text"
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    placeholder={repoData.description}
                    className="w-full px-4 py-3 bg-ghBg border border-ghBorder rounded-lg text-ghText
                               placeholder-[#484f58] focus:outline-none focus:border-ghAccent
                               focus:ring-1 focus:ring-ghAccent transition-colors"
                  />
                </div>

                {/* Layout Selector */}
                <div className="mb-6">
                  <label className="block text-ghMuted text-sm mb-2">Choose Layout:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(layouts).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => setLayout(key)}
                        className={`px-4 py-3 rounded-lg text-left border transition-all
                          ${layout === key
                            ? 'border-ghAccent bg-ghAccent/10'
                            : 'border-ghBorder hover:border-ghAccent/50'
                          }`}
                      >
                        <p className={`text-sm font-bold ${layout === key ? 'text-ghAccent' : 'text-ghText'}`}>
                          {val.name}
                        </p>
                        <p className="text-[11px] text-ghMuted mt-0.5">{val.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ══ LIVE PREVIEW — PreviewCard jaisa centered & responsive ══ */}
                <div className="mb-6">
                  <label className="block text-ghMuted text-sm mb-3 text-center">Live Preview:</label>

                  {/* PreviewCard-style container */}
                  <div className="bg-ghCard border border-ghBorder rounded-lg overflow-hidden">
                    {/* Image area — aspect ratio 2:1, responsive */}
                    <div className="p-4 sm:p-6">
                      <div
                        ref={previewWrapperRef}
                        className="w-full rounded-lg overflow-hidden border border-ghBorder bg-ghBg"
                        style={{ aspectRatio: '2 / 1' }}
                      >
                        {/* Scaled content — dynamically scaled to fit */}
                        <div
                          style={{
                            width: '1280px',
                            height: '640px',
                            transform: `scale(${previewScale})`,
                            transformOrigin: 'top left',
                            overflow: 'hidden',
                          }}
                        >
                          <div ref={templateRef}>
                            {layout === 'github' && (
                              <LayoutGithub owner={owner} repo={repo} data={repoData} desc={desc} />
                            )}
                            {layout === 'terminal' && (
                              <LayoutTerminal owner={owner} repo={repo} data={repoData} desc={desc} />
                            )}
                            {layout === 'gradient' && (
                              <LayoutGradient owner={owner} repo={repo} data={repoData} desc={desc} />
                            )}
                            {layout === 'card' && (
                              <LayoutCard owner={owner} repo={repo} data={repoData} desc={desc} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Download button — PreviewCard style */}
                    <div className="px-4 sm:px-6 py-4 border-t border-ghBorder">
                      <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                                   bg-ghGreen hover:bg-ghGreenHover disabled:opacity-50
                                   disabled:cursor-not-allowed text-white font-semibold rounded-lg
                                   transition-colors duration-200"
                      >
                        {generating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Generating HD Image...
                          </>
                        ) : (
                          <>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Custom Preview (1280×640 HD)
                          </>
                        )}
                      </button>
                      <p className="text-ghMuted text-xs text-center mt-2">
                        Perfect for Twitter, LinkedIn, Facebook, Discord & README
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYOUT 1: GITHUB CLASSIC — Light header + clean design
// ══════════════════════════════════════════════════════════
function LayoutGithub({ owner, repo, data, desc }) {
  return (
    <div style={{
      width: '1280px', height: '640px',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 60px', height: '90px',
        backgroundColor: '#f6f8fa', borderBottom: '1px solid #d0d7de',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <svg width="28" height="28" fill="#57606a" viewBox="0 0 16 16">
            <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
          </svg>
          <span style={{ fontSize: '28px', color: '#24292f' }}>
            {owner} / <span style={{ color: '#0969da', fontWeight: '700' }}>{repo}</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '28px', fontWeight: '700', color: '#24292f' }}>
            {formatNumber(data.stars)}
          </span>
          <svg width="28" height="28" fill="#24292f" viewBox="0 0 16 16">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
          </svg>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '50px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '36px', color: '#24292f', lineHeight: 1.5, maxWidth: '1000px' }}>
          {desc}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
            {data.contributors.slice(0, 6).map((c, i) => (
              <img
                key={c.login}
                src={`${c.avatar}?s=80`}
                alt={c.login}
                crossOrigin="anonymous"
                style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  border: '3px solid #ffffff',
                  marginLeft: i === 0 ? '0' : '-14px',
                  position: 'relative', zIndex: 6 - i,
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            {data.language && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '16px', height: '16px', borderRadius: '50%', display: 'inline-block',
                  backgroundColor: LANG_COLORS[data.language] || '#8b949e',
                }} />
                <span style={{ fontSize: '22px', color: '#57606a' }}>{data.language}</span>
              </div>
            )}
            <span style={{ fontSize: '22px', color: '#57606a', fontWeight: '600' }}>
              {formatNumber(data.contributorsCount)} Contributors
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYOUT 2: TERMINAL DARK — macOS window + dark theme
// ═══════════════════════════════════════════════════════════
function LayoutTerminal({ owner, repo, data, desc }) {
  return (
    <div style={{
      width: '1280px', height: '640px',
      backgroundColor: '#1a1b26',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '30px',
    }}>
      <div style={{
        width: '100%', height: '100%',
        backgroundColor: '#24283b',
        borderRadius: '20px',
        border: '1px solid #414868',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Title Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 28px',
          borderBottom: '1px solid #414868',
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
            <span style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#febc2e' }} />
            <span style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#28c840' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#c0caf5' }}>
              {formatNumber(data.stars)}
            </span>
            <svg width="24" height="24" fill="#e0af68" viewBox="0 0 16 16">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '40px 40px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '22px', color: '#7aa2f7', marginBottom: '6px' }}>
              {owner} /
            </p>
            <p style={{ fontSize: '44px', fontWeight: '800', color: '#7dcfff', marginBottom: '24px', lineHeight: 1.1 }}>
              {repo}
            </p>
            <p style={{ fontSize: '26px', color: '#a9b1d6', lineHeight: 1.6, maxWidth: '900px' }}>
              {desc}
            </p>
            {data.topics && data.topics.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
                {data.topics.slice(0, 4).map((t) => (
                  <span key={t} style={{
                    fontSize: '16px', padding: '4px 16px', borderRadius: '20px',
                    backgroundColor: 'rgba(122,162,247,0.15)', color: '#7aa2f7',
                    border: '1px solid rgba(122,162,247,0.3)',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {data.contributors.slice(0, 6).map((c, i) => (
                <img
                  key={c.login}
                  src={`${c.avatar}?s=72`}
                  alt={c.login}
                  crossOrigin="anonymous"
                  style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    border: '3px solid #24283b',
                    marginLeft: i === 0 ? '0' : '-12px',
                    zIndex: 6 - i, position: 'relative',
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {data.language && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '14px', height: '14px', borderRadius: '50%', display: 'inline-block',
                    backgroundColor: LANG_COLORS[data.language] || '#8b949e',
                  }} />
                  <span style={{ fontSize: '20px', color: '#565f89' }}>{data.language}</span>
                </div>
              )}
              <span style={{ fontSize: '20px', color: '#565f89' }}>
                {formatNumber(data.contributorsCount)} Contributors
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYOUT 3: GRADIENT PRO — Cyberpunk glow + gradient bg
// ═══════════════════════════════════════════════════════════
function LayoutGradient({ owner, repo, data, desc }) {
  return (
    <div style={{
      width: '1280px', height: '640px',
      background: 'linear-gradient(135deg, #0f0518 0%, #1a0533 30%, #0d1b2a 70%, #0f0518 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative glow circles */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-80px',
        width: '450px', height: '450px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-60px',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
      }} />

      {/* Top accent line */}
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #8b5cf6, #06b6d4, #8b5cf6)',
      }} />

      {/* Content */}
      <div style={{
        flex: 1, padding: '50px 70px 0', position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Avatar + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px', marginBottom: '24px' }}>
          <img
            src={`${data.owner?.avatarUrl || ''}?s=100`}
            alt={owner}
            crossOrigin="anonymous"
            style={{
              width: '68px', height: '68px', borderRadius: '50%',
              border: '3px solid rgba(139,92,246,0.5)',
            }}
          />
          <div>
            <p style={{ fontSize: '20px', color: '#9ca3af', letterSpacing: '3px', textTransform: 'uppercase' }}>
              {owner}
            </p>
            <p style={{ fontSize: '48px', fontWeight: '800', color: '#22d3ee', lineHeight: 1.1 }}>
              {repo}
            </p>
          </div>
        </div>

        <p style={{ fontSize: '26px', color: '#d1d5db', lineHeight: 1.6, maxWidth: '900px', marginBottom: '20px' }}>
          {desc}
        </p>

        {data.topics && data.topics.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {data.topics.slice(0, 5).map((t) => (
              <span key={t} style={{
                fontSize: '15px', padding: '5px 16px', borderRadius: '20px',
                backgroundColor: 'rgba(34,211,238,0.1)', color: '#22d3ee',
                border: '1px solid rgba(34,211,238,0.3)',
              }}>
                {t}
              </span>
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />
      </div>

      {/* Bottom Stats Bar */}
      <div style={{
        padding: '20px 70px',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(139,92,246,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" fill="#eab308" viewBox="0 0 16 16">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
            </svg>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#e5e7eb' }}>
              {formatNumber(data.stars)}
            </span>
            <span style={{ fontSize: '16px', color: '#9ca3af' }}>stars</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" fill="#9ca3af" viewBox="0 0 16 16">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013.5 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm6.75.75a.75.75 0 10.001-1.5.75.75 0 00-.001 1.5zM8 12.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0z" />
            </svg>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#e5e7eb' }}>
              {formatNumber(data.forks)}
            </span>
            <span style={{ fontSize: '16px', color: '#9ca3af' }}>forks</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex' }}>
              {data.contributors.slice(0, 4).map((c, i) => (
                <img
                  key={c.login}
                  src={`${c.avatar}?s=40`}
                  alt={c.login}
                  crossOrigin="anonymous"
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    border: '2px solid #0f0518',
                    marginLeft: i === 0 ? '0' : '-8px',
                    zIndex: 4 - i, position: 'relative',
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#e5e7eb' }}>
              {formatNumber(data.contributorsCount)}
            </span>
            <span style={{ fontSize: '16px', color: '#9ca3af' }}>contributors</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="22" height="22" fill="#6b7280" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span style={{ fontSize: '18px', color: '#6b7280' }}>github.com</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LAYOUT 4: CARD MODERN — White card + thick accent border
// ═══════════════════════════════════════════════════════════
function LayoutCard({ owner, repo, data, desc }) {
  return (
    <div style={{
      width: '1280px', height: '640px',
      backgroundColor: '#e5e7eb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '1120px', height: '520px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '4px solid #1f2937',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: '12px 12px 0px #1f2937',
      }}>
        <div style={{
          flex: 1, padding: '50px 60px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ fontSize: '36px', color: '#1f2937', marginBottom: '20px' }}>
              {owner} / <span style={{ color: '#2563eb', fontWeight: '800' }}>{repo}</span>
            </p>
            <p style={{ fontSize: '30px', color: '#4b5563', lineHeight: 1.6, maxWidth: '900px' }}>
              {desc}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {data.contributors.slice(0, 6).map((c, i) => (
                <img
                  key={c.login}
                  src={`${c.avatar}?s=80`}
                  alt={c.login}
                  crossOrigin="anonymous"
                  style={{
                    width: '52px', height: '52px', borderRadius: '12px',
                    border: '3px solid #ffffff',
                    marginLeft: i === 0 ? '0' : '-10px',
                    zIndex: 6 - i, position: 'relative',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
              ))}
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '22px', color: '#6b7280' }}>
                <span style={{ fontWeight: '800', color: '#1f2937' }}>{formatNumber(data.stars)}</span> stars
              </p>
              <p style={{ fontSize: '22px', color: '#6b7280', marginTop: '4px' }}>
                <span style={{ fontWeight: '800', color: '#1f2937' }}>{formatNumber(data.contributorsCount)}</span> Contributors
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
