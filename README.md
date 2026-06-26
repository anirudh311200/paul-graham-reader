# Paul Graham Reader

A personal, dark-mode reader for [Paul Graham's essays](https://www.paulgraham.com/articles.html) — synced from paulgraham.com.

## Features

- **Dynamic catalog** — scrapes `articles.html` and refreshes every hour (daily cron revalidation on Vercel)
- **New essay detection** — essays show **New** for 10 days after first appearing (or if published in the current month)
- **Since last visit** — client-side tracking for essays you haven't seen yet
- **Starred essays** — mark high-fi favorites (localStorage, no account)
- **In-site reader** — beautiful typography with serif body text
- **Download PDF** — print stylesheet → Save as PDF in your browser
- **Dark only** — deep charcoal palette with calligraphy logo

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Import in [Vercel](https://vercel.com) as `paul-graham-reader`
3. Optional: set `CRON_SECRET` env var for the sync endpoint

## Attribution

All essays © [Paul Graham](https://www.paulgraham.com). This is an unofficial personal reader, not affiliated with Paul Graham or Y Combinator.
