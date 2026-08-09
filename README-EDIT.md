# Nor — Portfolio Site

A multi-page, Matrix-themed portfolio for a software developer / penetration
tester. Every page shares one CSS file and one JS file, so editing the design
once updates the whole site.

## File structure

```
index.html          Home — hero, live stats, teasers into the other pages
about.html           Full bio + quick facts
skills.html          Skill bars + certifications
projects.html        Project grid with expandable case studies (filterable)
experience.html      Work history timeline + education
contact.html         Contact form + direct email + socials
404.html             Themed error page
resume.pdf           Real, downloadable one-page resume (generated from the same content)
assets/css/style.css All shared styling — edit tokens at the top of the file to reskin
assets/js/main.js    All shared behavior — guards on element existence, safe on every page
```

## Before you publish — replace these placeholders

Search each file for `<!-- EDIT -->` comments; they mark every placeholder.
The main ones:

- **Bio & quick facts** — `about.html`, `index.html`
- **Real numbers** — the stats strip in `index.html` (vulns disclosed, years, etc.)
- **Skill percentages & certifications** — `skills.html`
- **Every project** — `projects.html` (and the 3 featured teasers in `index.html`
  which should stay in sync). Each project card has a `GitHub →` link pointed
  at `https://github.com/nor/<repo>` — update to your real repos or remove the
  link entirely if a project isn't public.
- **Work history & education** — `experience.html`
- **Contact details** — `contact.html` and the footer on every page:
  - Email: currently `nor@example.com` (used as both a `mailto:` link and
    plain text — update both)
  - GitHub: currently `https://github.com/nor`
  - LinkedIn: currently `https://linkedin.com/in/nor`
  - TryHackMe: currently `https://tryhackme.com/p/nor` (swap for HackTheBox,
    a CTF profile, or remove if not relevant)
- **Resume** — `resume.pdf` was generated from `build_resume.py`. Edit that
  script and rerun `python3 build_resume.py` to regenerate it once your real
  experience is final, or just replace `resume.pdf` with your own file (keep
  the filename so every "Download Resume" link keeps working).

## About the contact form

The form validates input and shows a confirmation message, but **it does not
send email on its own** — there's no backend here. To make it actually
deliver messages, connect it to a form service such as Formspree, Resend, or
your own API endpoint (a few lines in `initContactForm()` inside
`assets/js/main.js`). Until then, the direct `mailto:` link on the same page
works immediately with no setup.

## Deployment

This is a fully static site — no build step. Any static host works:

- **GitHub Pages** — push this folder to a repo, enable Pages on the `main`
  branch
- **Netlify / Vercel** — drag-and-drop the folder or connect the repo
- **Any web server** — just copy the files

For GitHub Pages / Netlify, `404.html` is picked up automatically as the
custom error page. On other hosts you may need to configure that manually.

## Design notes

- The heavy 3D scene, Matrix rain, and boot sequence are reserved for the
  homepage hero only — interior pages use a lighter ambient rain layer so
  they stay fast.
- The boot sequence plays once per browser session (via `sessionStorage`),
  not on every page load.
- All animation respects `prefers-reduced-motion`.
- Featured project cards on the homepage deep-link to their full case study
  on `projects.html` (e.g. `projects.html#p-secureauth`) — the accordion
  auto-opens and scrolls to the right card.

