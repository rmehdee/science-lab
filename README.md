# Science Lab

Free science practice for grades 1 to 5, built on Florida's Next Generation
Sunshine State Standards (NGSSS) for science. Part of the learning games at
[mehdee.com/games](https://mehdee.com/games/).

## What it covers

All **156** NGSSS science benchmarks for grades 1 to 5, one topic each:

| Grade | Benchmarks | Levels |
|---|---|---|
| 1 | 18 | 8 |
| 2 | 29 | 9 |
| 3 | 32 | 10 |
| 4 | 41 | 11 |
| 5 | 36 | 12 |

Levels follow the NGSSS Big Ideas themselves, so clearing a grade means every
benchmark in that grade has been practised. The last level of each grade mixes
everything. Florida gives the Statewide Science Assessment in grade 5, covering
grades 3 to 5 content, so those grades carry the most topics.

Every question shows its benchmark code, every wrong answer gets an
explanation, and every topic has a "how do I do this" card giving the idea
behind the standard rather than the answer.

Not affiliated with or endorsed by the Florida Department of Education.

## Privacy

No accounts, no ads, no cookies, no advertising or profiling scripts. The child's
name and progress live in `localStorage` on that device only and are never
transmitted. The one server request is an anonymous page-view count through
Cloudflare Web Analytics: cookieless, no fingerprinting, no cross-site tracking,
and it identifies nobody. The game still works offline after the first load; the
beacon simply fails silently.
A parent reset on the start screen erases all saved progress.

## Files

- `content.js` — all 156 topics, the level ladders, the help cards, and the SVG
  drawings (plant parts, food chains, the water cycle, moon phases, states of
  matter, magnets, life cycles, thermometer)
- `app.js` — game loop, scoring, report card
- `index.html`, `styles.css` — the shell, shared with Math Arena
- `preview.html` — one live example of every topic, for checking content
  without playing to it. Noindex.

## Checking content

Open `preview.html` to see a live example of all 156 topics with their
drawings, choices, explanations and help cards. Press "New examples" to reroll.

## Custom domain

Lives at https://science.mehdee.com/ . The DNS record on the `mehdee.com`
Cloudflare zone is:

```
Type: CNAME   Name: science   Target: rmehdee.github.io   Proxy: DNS only
```

Proxy must stay DNS only. If Cloudflare proxies the record, GitHub cannot
complete the certificate challenge and the subdomain serves no HTTPS.

## Photographs

`photos/` holds public-domain photographs, self-hosted and credited in the
caption of every question that uses one. They are deliberately **not**
hotlinked: loading them from NASA or Wikimedia would send a child's IP address
to a third party. The analytics beacon is the single deliberate exception,
and it carries no information about the person loading the page.

Sources are limited to genuinely public-domain material: NASA (space and Earth
imagery) and the U.S. Fish and Wildlife Service. Wikimedia results were filtered
by licence and anything CC BY-SA or GFDL was rejected. Each file is resized to a
720px long edge and encoded as WebP; the whole set is under 400KB.
