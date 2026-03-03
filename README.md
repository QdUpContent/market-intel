# AI Market Intel — Podcast Platform & Knowledge Hub

Self-hosted podcast website with an auto-updating knowledge hub. Episodes, AI glossary, platforms directory, and tools repository — all populated automatically from show notes via Make.com + Claude API.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/market-intel.git
cd market-intel

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
market-intel/
├── public/
│   ├── milogo.png              # Show logo
│   └── _redirects              # Netlify SPA routing fallback
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Router configuration
│   ├── theme.jsx               # Theme context (dark/light)
│   ├── components/
│   │   ├── Layout.jsx          # Nav + footer shell
│   │   ├── Logo.jsx            # Logo component
│   │   ├── SearchOverlay.jsx   # Global search modal
│   │   ├── ThemeToggle.jsx     # Dark/light toggle
│   │   └── UI.jsx              # Card, Tag, EpBadge, StatusDot, etc.
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Episodes.jsx        # Episode listing
│   │   ├── Glossary.jsx        # AI glossary
│   │   ├── Platforms.jsx       # Platform directory
│   │   └── Tools.jsx           # Tools repository
│   ├── hooks/
│   │   └── useSearch.js        # Cross-database search
│   └── data/                   # ← Make.com writes here
│       ├── show.js             # Static show metadata
│       ├── episodes.json       # Episode catalog
│       ├── glossary.json       # AI/marketing terms
│       ├── platforms.json      # Platform directory
│       └── tools.json          # Tools repository
├── docs/
│   └── claude-api-prompt.md    # Prompt for Make.com automation
├── index.html
├── vite.config.js
├── netlify.toml
└── package.json
```

## Data Architecture

All data lives in JSON files under `src/data/`. These are imported at build time by Vite — no runtime fetching needed. When Make.com commits updated JSON, Netlify rebuilds and the new data is baked in.

### JSON Schemas

**episodes.json** — Array of episode objects sorted newest-first.
**glossary.json** — Array of glossary terms sorted by letter → term.
**platforms.json** — Array of platform entries with status and episode links.
**tools.json** — Array of tools with ratings and episode links.

See `docs/claude-api-prompt.md` for full schema definitions.

## Deployment

### Netlify Setup

1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Connect your GitHub account and select the `market-intel` repo
4. Build settings (auto-detected from `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**

Every push to `main` triggers an auto-rebuild. Custom domain setup is in Netlify → Domain settings.

### GitHub Repo Setup

```bash
cd market-intel
git init
git add .
git commit -m "Initial commit: Market Intel platform v1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/market-intel.git
git push -u origin main
```

## Automation Pipeline

**Monday.com → Make.com → Claude API → GitHub → Netlify**

1. Episode status changes to "Published" in Monday.com
2. Make.com pulls all assets (MP3, artwork, notes, transcript)
3. Claude API analyzes content, returns structured JSON
4. Make.com merges new data into existing JSON files
5. Make.com commits to GitHub
6. Netlify auto-deploys from the commit

See `docs/claude-api-prompt.md` for the full Claude prompt and merge logic.

## Brand

- **Primary:** #E87D2A (orange)
- **Secondary:** #3D5A80 (slate blue)
- **Body font:** Plus Jakarta Sans
- **Data font:** JetBrains Mono
- **Theme:** Dark/light toggle, dark default

---

Built by [Q'd Up Agency](https://qd-up.com) for the AI Market Intel podcast.
