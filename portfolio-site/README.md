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
- **RiderSafe link:** add a link if the site is still online.
- **Role lines:** add a line or two on what you did in each project.

## Changing content

Everything is in `index.html`. Each page is a `<div data-view="...">`. Add a new page by adding a view with a new name and a link such as `<a href="#name">` in the nav. Use only letters, numbers, and hyphens in the name.
