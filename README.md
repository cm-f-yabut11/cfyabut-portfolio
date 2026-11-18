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
