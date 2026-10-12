# Mx. Coad — Computer Science Resources

Teaching resources for computing and computer science, from KS3 through GCSE, A-Level and BTEC IT.

**Live site:** https://mxcoad.github.io

The site is plain HTML, CSS and JavaScript hosted on GitHub Pages. There is no build step: anything merged into `main` is published automatically.

## What's here

| Resource | Audience | Link |
| --- | --- | --- |
| **Homepage** — links to everything, plus exam countdowns | All | [index.html](https://mxcoad.github.io/) |
| **Learning Defold** — game-development course using the Defold engine | A-Level | [Defold/01-homepage.html](https://mxcoad.github.io/Defold/01-homepage.html) |
| **Binary practice tools** — binary, hexadecimal, negative binary and floating point | KS3 / GCSE / A-Level | [Binary_Practice/binary.html](https://mxcoad.github.io/Binary_Practice/binary.html) |
| **GCSE Revision Console** — OCR GCSE Computer Science revision | GCSE | [GCSE/Revision_Console.html](https://mxcoad.github.io/GCSE/Revision_Console.html) |
| **GCSE revision notes** — every J277 topic (1.1–2.5) with notes, interactive tools and self-marked exam questions | GCSE | [GCSE/](https://mxcoad.github.io/GCSE/) |
| **Cyber Defence Console** — interactive activity on hacking, DoS and brute-force attacks | KS3 / GCSE | [cyber-defence-console.html](https://mxcoad.github.io/cyber-defence-console.html) |
| **KS3 Computing curriculum** — current draft | KS3 | [ks3-computing-curriculum.html](https://mxcoad.github.io/ks3-computing-curriculum.html) |
| **Spreadsheet cover lessons** — Year 7 and Year 9 cover work and revision | KS3 | [Cover Lessons/](Cover%20Lessons/) |
| **BTEC example website** — "GreenThread" sample shop showing good web design practice | BTEC IT | [EcommerceWebsite/shophomepage.html](https://mxcoad.github.io/EcommerceWebsite/shophomepage.html) |
| **Timetable → Calendar** — turn a school timetable into an `.ics` file for Google Calendar | Students | [timetable-to-calendar.html](https://mxcoad.github.io/timetable-to-calendar.html) |

### Learning Defold

The `Defold/` folder is a complete course:

- **Tutorials** (`Defold/tutorials/`) — five step-by-step game builds: **Pong**, **Worm**, **Landers**, **Incoming** and **Spotter**. Each has an index page and numbered stages with screenshots.
- **Help sheets** (`Defold/help/`) — installation, a skills matrix, how-to guides (animation, waypoints, interfaces, timers, particle effects), theory notes and fixes for common errors.
- **Assets** (`Defold/assets/`) — sprites, sound effects, a boilerplate project and libraries for students to use in their games.

### Cover lessons

| File | Lesson |
| --- | --- |
| `y7-spreadsheets-cover-lesson.html` | Year 7 Spreadsheets — Paws & Claws Animal Rescue |
| `Year9.html` | Year 9 Spreadsheets — Velocity FC |
| `y9-spreadsheets-cover-lesson.html` | Year 9 Spreadsheets — Cover Lesson 1 |
| `y9-spreadsheets-cover-lesson-2.html` | Year 9 Spreadsheets — Cover Lesson 2 |
| `y9-spreadsheets-cover-lesson-3.html` | Year 9 Spreadsheets — VLOOKUP & HLOOKUP |
| `year9-revision.html` | Year 9 Computing — Revision Session |

## Folder layout

```
index.html                  Homepage
assets/site.css             Shared design: colours, fonts, light/dark mode, site bar
assets/site.js              Sets light/dark mode and adds the site bar to every page
ks3-computing-curriculum.html
cyber-defence-console.html
timetable-to-calendar.html
floating-point-practice.html  Redirect (moved to Binary_Practice/)
Binary_Practice/            Number-representation practice tools
Cover Lessons/              KS3 spreadsheet cover lessons (index.html lists them)
Defold/                     Defold game-development course
EcommerceWebsite/           BTEC IT example website
GCSE/                       Revision notes for every J277 topic (index.html) and the revision console
```

## Adding or updating a page

1. Add or edit the `.html` file (uploading through GitHub's website works fine).
2. Give a new page the shared design by adding these two lines inside `<head>`, straight after `<title>`:
   ```html
   <link rel="stylesheet" href="/assets/site.css">
   <script src="/assets/site.js"></script>
   ```
   Then use the `--ms-*` colour and font variables from `assets/site.css` (for example `background: var(--ms-bg); color: var(--ms-text);`) so the page works in light and dark mode.
3. To make it easy to find, copy a card in `index.html` into the right key-stage section and set its `data-topic`.
4. Commit to `main`. GitHub Pages republishes the site within a minute or two.

GCSE topic pages also use `assets/topic.css` and `assets/topic.js`, which provide the shared layout, progress tracking and self-marked exam questions. Each page defines its questions in `window.TOPIC`.

The Defold course and the BTEC example website keep their own designs on purpose.

Links are case-sensitive on GitHub Pages, so `Climbing Stairs/` and `Climbing stairs/` are different folders. Check that a link's capitalisation matches the file or folder name exactly.
