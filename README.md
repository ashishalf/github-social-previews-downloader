<div align="center">

# 📸 GitHub Social Previews Downloader

**Download GitHub repository social preview (Open Graph) images instantly.**

Paste any GitHub repo URL → Preview the OG image → Download it directly.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-58a6ff?style=for-the-badge)](https://github-social-previews-downloader.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-161b22?style=for-the-badge&logo=github)](https://github.com/ashishalf/github-social-preview-downloader)
[![License](https://img.shields.io/badge/License-MIT-238636?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

- 🔗 **Flexible Input** — Paste full GitHub URL or just `owner/repo`
- 🖼️ **Smart Detection** — 3-step cascading logic to find the best preview image
- ⬇️ **Direct Download** — Download image directly as PNG without opening new tabs
- 📋 **Copy URL** — One-click copy image URL to clipboard
- 🔥 **Trending Repos** — Browse top trending GitHub repositories as clickable examples
- 🌙 **GitHub Dark Theme** — Beautiful dark UI inspired by GitHub's design
- 📱 **Fully Responsive** — Works perfectly on mobile, tablet and desktop
- ⚡ **Fast & Lightweight** — Built with Vite for blazing fast performance

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI library with functional components & hooks |
| **Vite** | Build tool for fast development |
| **TailwindCSS 3** | Utility-first CSS framework |
| **Vercel Analytics** | Website analytics |
| **Fetch API** | HTTP requests |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Top navigation bar
│   ├── RepoInput.jsx       # URL input form with validation
│   ├── PreviewCard.jsx     # Image preview + download/copy buttons
│   ├── TrendingRepos.jsx   # Trending repos section
│   └── RepoCard.jsx        # Individual repo card component
│
├── utils/
│   ├── parseGithubUrl.js   # URL parser utility
│   └── getPreviewImage.js  # 3-condition image detection logic
│
├── App.jsx                 # Root component
├── main.jsx                # Entry point
└── index.css               # Global styles + Tailwind imports
```

---

## 🧠 How It Works

### Input Parsing

The app accepts multiple input formats:

```
✅ https://github.com/facebook/react
✅ http://github.com/facebook/react
✅ github.com/facebook/react
✅ facebook/react
```

All are parsed to extract `owner` and `repo`.

### 3-Condition Image Detection

The app uses a cascading detection strategy:

```
Condition 1 → Auto-generated OG Image
              https://opengraph.githubassets.com/1/{owner}/{repo}
              
              ↓ If fails

Condition 2 → Custom Social Preview
              Fetch repo HTML → Parse og:image meta tag
              
              ↓ If fails

Condition 3 → No Preview Available
              Show error message
```

### Download Strategy

Direct download with 3 fallback methods:

```
Method 1 → Canvas API (draw image → create blob → download)
    ↓ If fails
Method 2 → CORS Proxy fetch (try multiple proxies)
    ↓ If fails  
Method 3 → Direct link download (last resort)
```

---

## 🎨 Design System

GitHub-inspired dark theme color palette:

| Color | Hex | Usage |
|---|---|---|
| Background | `#0d1117` | Page background |
| Card | `#161b22` | Card backgrounds |
| Border | `#30363d` | Borders & dividers |
| Text | `#c9d1d9` | Primary text |
| Muted | `#8b949e` | Secondary text |
| Accent | `#58a6ff` | Links & highlights |
| Green | `#238636` | Primary buttons |
| Red | `#f85149` | Error states |

---

## 📱 Responsive Design

| Screen | Breakpoint | Layout |
|---|---|---|
| Mobile | < 640px | Single column, stacked elements |
| Tablet | ≥ 640px | Two column grid, side-by-side buttons |
| Desktop | ≥ 1024px | Full layout with larger text |

---

## 🧪 Testing

| Test Case | Input | Expected |
|---|---|---|
| Full URL | `https://github.com/facebook/react` | Shows preview + download |
| Short format | `vercel/next.js` | Shows preview + download |
| Trailing slash | `https://github.com/vuejs/vue/` | Parsed correctly |
| Invalid URL | `hello world` | Error message shown |
| Non-existent repo | `abcxyz123/norepo999` | "No preview available" |
| Trending click | Click any card | Auto-fills input + loads preview |
| Download | Click download button | File saves as `repo-social-preview.png` |
| Copy URL | Click copy button | URL copied + "Copied!" shown |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository

# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make your changes and commit
git commit -m "Add amazing feature"

# 4. Push to your branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

### Contribution Ideas

- [ ] Add support for GitLab / Bitbucket repositories
- [ ] Add image dimension display
- [ ] Add batch download for multiple repos
- [ ] Add download history with local storage
- [ ] Add share preview on social media
- [ ] Add dark/light theme toggle

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Ashish Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- [GitHub](https://github.com) — For the Open Graph image system
- [TailwindCSS](https://tailwindcss.com) — For the utility-first CSS framework
- [Vite](https://vitejs.dev) — For the blazing fast build tool
- [Vercel](https://vercel.com) — For hosting and analytics

---

<div align="center">

**Made With ❤️ By [Ashish Kumar](https://github.com/ashishalf)**

⭐ Star this repo if you found it useful!

</div>
