# Public release review, 2026-11-21

Review of `fbratten/interactive-pedagogicals` (formerly `interactive-pedagocicals`) before the
repository is made public and served with GitHub Pages. Reviewer: Claude (agent), on behalf of the
owner. Scope: code, content, git history and repository settings.

## Summary

| Area | Result |
|---|---|
| Secrets in files and history | PASS: no keys, tokens, passwords or private keys found (pattern scan of the working tree and of every commit) |
| Code | PASS: static files only, no backend, no network requests, no `eval`; Content Security Policy added |
| Personal data | PASS with note: the owner's commit e-mail is visible in history; it is already public in `fbratten.github.io` |
| Content and licenses | PASS: original texts and illustrations, Natural Earth (public domain), MIT + CC BY 4.0 added |
| Repository settings | OWNER ACTION: not readable or writable with the agent's access; checklist below |

## Code

- **Static only.** The page is HTML, CSS and JavaScript loaded with `<script src>`. No build step at runtime, no
  dependencies, no package manager files, no third-party scripts, fonts or images.
- **Content Security Policy** (`forsta-amerikanerna/index.html`):
  `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self' blob:;
  connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`. Verified in headless Chromium:
  no CSP violations, no console errors.
- **DOM injection.** Data is inserted with `innerHTML` only after escaping (`FA.esc`), or as static strings
  and SVG written in the code. No inline event handlers, no `eval`, no `new Function`, no `document.write`.
- **URL input.** The page reads `?lang=` (accepted values: `sv`, `en`) and `#t=<digits>&e=<id>`; the event id is
  only used after a lookup in the known event list.
- **Storage.** `localStorage` holds only the chosen language, wrapped in try/catch.
- **Links** to sources open in a new tab with `rel="noopener noreferrer"`.
- **Tools** (`tools/*.py`) run locally on local files only; `tools/dev-globe.html` is a developer view with an
  inline script and no CSP, and is not linked from the page.

## Git history

- 6 commits on `main` before this review; authors `Fredrik Brattén <ragnart851@outlook.com>` (initial commit,
  merges, title fix) and `Claude <noreply@anthropic.com>`.
- The e-mail address is already public through `fbratten/fbratten.github.io`. Recommendation for the future:
  GitHub **Settings > Emails > Keep my email addresses private** (commits made on github.com then use a
  `noreply` address).
- Commit messages contain a `Claude-Session:` link to a private claude.ai session. It cannot be opened by
  others. Informational only.
- History is not rewritten (preserve-first: no force-push or history rewrite).

## Content

- Event texts are original paraphrases with links to the cited research; no long quotations.
- Sensitive framing is handled in the page: Indigenous perspectives note, "the Ancient One" naming, 1492 as an
  end marker only, Population Y not presented as a Pacific crossing.
- Third-party material and licenses are listed in `LICENSE-CONTENT.md`.

## Owner checklist (repository settings)

Do these in order on github.com. The agent's access cannot read or change repository settings.

1. **Rename**: Settings > General > Repository name: `interactive-pedagogicals`. GitHub redirects the old name.
2. **Features**: Settings > General > Features. Turn off Wikis and Projects unless you want them.
   Issues: your choice (on is fine for feedback). Keep *Automatically delete head branches* **off** (preserve-first).
3. **Protect `main`**: Settings > Rules > Rulesets > New branch ruleset, target `main`:
   require a pull request before merging, block force pushes, restrict deletions.
4. **Security**: Settings > Security (Advanced Security / Code security):
   enable *Private vulnerability reporting*, *Dependabot alerts*, *Secret scanning* and *Push protection*.
5. **Actions**: Settings > Actions > General. Keep Actions **enabled**: GitHub Pages builds from a branch
   through GitHub's built-in Pages workflow. Set workflow permissions to read-only.
6. **Visibility**: Settings > General > Danger Zone > Change visibility > Public.
7. **Pages**: Settings > Pages > Build and deployment > Source *Deploy from a branch*, branch `main`,
   folder `/ (root)`, Save. Tick *Enforce HTTPS* when offered.
8. **About** (repository front page, gear icon): description, website
   `https://fbratten.github.io/interactive-pedagogicals/`, topics such as `education`, `archaeology`,
   `genetics`, `interactive`, `webgl`, `peopling-of-the-americas`.

## After the switch (agent verification)

- Public API readback of visibility and default branch.
- The Pages URL answers `200` and the page runs in headless Chromium in Swedish and English.
- Links from `fbratten.github.io` point to the live URL.
