# Clarence Yabut: Portfolio

A plain HTML, CSS, and JavaScript portfolio. There is no build step and nothing to install.

```
index.html        the whole site (pages are #home, #work, #about, ...)
css/styles.css    styles, with light and dark themes
js/main.js        page switching, the landing game, eyes, forms
assets/img/       project pictures
favicon.svg       browser tab icon
render.yaml       optional Render blueprint
```

## Run it locally

Open `index.html` in a browser, or run `npx serve .` in this folder.

## Deploy on Render (free static site)

1. Create a new GitHub repository and push the contents of this folder to it, with `index.html` at the top level.
2. In Render, choose **New > Static Site** and connect the repository.
3. Leave **Build Command** empty and set **Publish Directory** to `.`
4. Click **Create Static Site**. Every push to the main branch redeploys automatically.

(Alternatively, choose **New > Blueprint** and Render will read `render.yaml`.)

## Receive contact messages by email

By default the contact form opens the visitor's email app. To get messages in your inbox without that:

1. Create a free form at https://formspree.io and copy its URL (it looks like `https://formspree.io/f/xxxxxxxx`).
2. Paste it into `FORM_ENDPOINT` at the top of `js/main.js`.
3. Commit and push. The form will now send directly and fall back to the email app if sending fails.

## Things to replace before sharing

- **Recommendations page:** the four cards are lorem ipsum samples. Replace them in `index.html` (search for `class="quote"`) with real quotes from people who agreed to be featured, and remove the `Sample` tags.
- **Case studies:** the 303 Apparel and KainSaan pages use screenshots from your project documents. Swap them in `assets/img/case/` if you take better ones.
- **RiderSafe link:** add a link if the site is still online.
- **Role lines:** add a line or two on what you did in each project.

## Changing content

Everything is in `index.html`. Each page is a `<div data-view="...">`. Add a new page by adding a view with a new name and a link such as `<a href="#name">` in the nav. Use only letters, numbers, and hyphens in the name.

## Link preview card

`assets/img/og-card.png` is the image shown when the site is shared on LinkedIn, Messenger, and similar apps. The `og:url`, `og:image`, and `canonical` tags in `index.html` point to `https://cfyabut-portfolio.onrender.com/`. If you ever move the site to another address, update those three tags.

## Resume and 404 page

- `assets/Clarence-Yabut-Resume.pdf` is the file behind the "Download resume" links. Replace it with a new PDF of the same name whenever you update your resume.
- `404.html` is shown by Render for any address that does not exist.

## Accessibility notes

The site has a skip link, visible keyboard focus, labelled forms and buttons, alt text on images, and respects the visitor's reduced motion setting. Run Lighthouse in Chrome DevTools after each big change to re-check.

## Colors

The default accent is blue. Visitors can switch to teal, orange, or pink with the dots in the footer; the choice is remembered in their browser. On the three project case studies the blue accent changes to each project's own color (teal for KainSaan, navy for 303 Apparel, green for RiderSafe) unless the visitor picked a different accent.

## Music player

A small white pill with blue soundbars sits in the bottom-left corner when there is music to play.

1. Put your MP3 files in `assets/audio/`.
2. List them in `assets/audio/playlist.json`, for example `{ "tracks": ["my-song.mp3", "another-song.mp3"] }`. Details are in `assets/audio/README.txt`.
3. Commit and push. While the list is empty, the pill stays hidden.

Music never starts on its own; visitors press play, and it keeps playing as they move between pages. The soundbars move with the actual music on the deployed site, and fall back to a simple animation when the page is opened straight from disk. Only use music you made or have the right to share publicly.

The pill can be moved: drag it, or focus the dotted handle on its left edge and use the arrow keys (Home resets it). Its position is remembered in the visitor's browser. On phones and tablets, the background eyes are replaced by a pair next to the logo in the header that glances at taps and looks up or down as you scroll.

## Extras

- **Quick jump:** press Ctrl or Cmd plus K (or use the "Quick jump" button in the footer) to jump to any page, project, or action.
- **Terminal view:** on the About page, "Terminal view" shows the bio as a typed terminal session.
- **Footer bug:** a small bug walks along the footer line and reacts when clicked.
- **Hidden code:** typing "debug" (or the Konami code) makes the eyes wink and a few code symbols float up.
- **Hero name:** on computers, the letters of the name get a little wider and bolder near the cursor.
- **Music player:** has two states. The small rounded pill shows the play button and title; the arrow button on its right expands it into a larger card with the progress bar, previous and next, and volume. The choice is remembered.

The music pill keeps a small set of soundbars under the title, even in its small state, and drifts a little after you let go of it (visitors who prefer reduced motion get no drift).

Press `?` (or use the "Shortcuts" button in the footer) to see the keyboard shortcuts. On the About page, the dark "Terminal view" button under the title switches the bio to a typed terminal session.

## Creative page

`#creative` shows the campaign posters, the promo video (a poster frame that links to the live 303 Apparel site, because the video file is too large to host here), the project logos, and design tools. The images are in `assets/img/creative/`. To add a poster, copy the image there and add another `<figure>` inside `.posters` in `index.html`.

## Small details

- The dark mode switch grows outward from the button when the browser supports it (it falls back to an instant switch).
- The home page background tint shifts through the day on Philippine time.
- Five secrets can be found; the count shows quietly at the bottom of the shortcuts sheet (press `?`).

**Autoplay and colors:** when a visitor wins the landing game, the music fades in on its own (browsers allow this because the visitor has already clicked Start). Visitors who skip the game, or who return later in the same session, never get autoplay; they press play themselves. If a browser blocks the autoplay, the pill gives a small nudge and a "Press play for music" message. The pill uses the site's light or dark theme and the chosen accent color.
