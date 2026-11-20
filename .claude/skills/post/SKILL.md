---
name: post
description: Scaffold a new race write-up or blog post for manav.run — asks which one, collects the metadata, creates the markdown file (and registry entry / GPX for races), then points at the file to write in. Use when the user wants to add, start, or create a new race or blog post.
---

# New race or blog post

Creates the boilerplate for a race write-up or a blog post, then hands the user
the markdown file to write in. Work from the repo root.

## 1. Ask what they're creating

Use AskUserQuestion: **Race** (a race report with a GPX route, listed in the
race registry) or **Blog post** (a post under the Blog tab).

Then collect the details below in **one** AskUserQuestion call where possible.
Offer the derived defaults as the recommended option so the user can accept
them; they can type their own via "Other". Don't ask for anything you can derive.

## 2a. Race

Collect:
- **Race name** — official name, e.g. "Jersey City Half Marathon". Becomes the
  page title and the registry `children`.
- **Date** — YYYY-MM-DD.
- **Slug** — default `<date>-<short-kebab-name>`, matching existing ids like
  `2026-04-19-jersey-city-half` or `2025-11-02-nyc-marathon` (short form:
  `half`, `marathon`, `5k`, `10k`, `4m`...). Becomes the id, the URL and the
  page folder.
- **GPX file** — path to the exported .gpx (e.g. in ~/Downloads), or "later".

Check before writing anything:
- `pages/<slug>/` must not exist, and the slug/date must not already be in
  `race_registry.ts`.
- If a GPX path was given, it must exist and contain `<trkpt`.

Create:

1. **GPX** (if given): copy to `public/gpx-files/<Name>.gpx`, where `<Name>` is
   the race name in the existing style — words joined by underscores, no
   punctuation, e.g. `Jersey_City_Half_Marathon.gpx`, `NYC_Marathon.gpx`. Don't
   overwrite an existing file; pick another name instead. If "later", still
   choose this filename for the registry and tell the user where to drop it.

2. **Registry**: add an entry to `race_registry.ts`:
   ```ts
   {
       id: '<slug>',
       href: '/<slug>',
       children: '<Race name>',
       gpxfile: '<Name>.gpx',
       date: '<YYYY-MM-DD>'
   },
   ```
   - Put it in the `links` of the group whose `title` is the race's year.
     If there's no group for that year, add `{ title: '<year>', links: [...] }`
     in the right place — groups are newest year first.
   - Within a group, entries are newest first; insert by date.
   - Match the file's 4-space indentation and trailing commas.

3. **Page**: `pages/<slug>/index.md`:
   ```md
   ---
   title: <Race name>
   ---

   # {% $markdoc.frontmatter.title %}

   ### Training

   ### Race day
   ```

4. **Stats** (if the GPX was copied): run `npm run race-stats` so
   `race_stats.json` picks up distance, time and pace for the Running page.
   If "later", remind them to run it after adding the file.

Images for the write-up go in `public/images/` and are embedded with
`{% docimage title="..." src="/images/<file>" width=550 height=300 style="center" %} {% /docimage %}`.

## 2b. Blog post

Collect:
- **Title**.
- **Date** — default today (YYYY-MM-DD, local time).
- **Slug** — default the title in kebab-case, no date (e.g. "Why I switched to
  Hanson's" → `why-i-switched-to-hansons`). The URL is `/blog/<slug>`.
- **Description** — optional one-liner for link previews.
- **Draft?** — default yes. Drafts only show in `npm run dev`.

Check `content/blog/<slug>.md` doesn't already exist. Create `content/blog/`
if needed (git doesn't keep it while empty).

Create `content/blog/<slug>.md` (leave out the `description` line if there's
none, and the `draft` line if it isn't a draft):
```md
---
title: <Title>
date: <YYYY-MM-DD>
description: <Description>
draft: true
---

Start writing here.
```

Posts are Markdoc: `{% callout title="..." %}...{% /callout %}` and
`docimage` work as on race pages; put images in `public/images/blog/<slug>/`.

## 3. Hand off

Finish with a short summary:
- Every file created or changed, as clickable paths — **the markdown file
  first**, called out as where to write, with a line number pointing at where
  the body starts (the blank line under `### Training` for a race; the
  "Start writing here." line for a post), e.g. `pages/<slug>/index.md:8`.
- Where it will appear locally: `http://localhost:3000/<slug>` or
  `http://localhost:3000/blog/<slug>`. Blog pages need the `blog` flag on
  (`BLOG_FLAG_OVERRIDE=true` in dev); drafts need `npm run dev`.
- Any follow-up left (drop in the GPX + `npm run race-stats`; flip `draft`
  when ready to publish).

Don't commit; the user will commit when the write-up is ready.
