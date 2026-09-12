# Website setup and maintenance

The website is at the root of this public repository. It is plain static HTML, CSS, and JavaScript. It does not require a database, application server, or production dependencies. Deployment status is not tracked in this document; confirm the active deployment in the hosting dashboard.

## Preview locally

From the repository root, run `python -m http.server 4173 --bind 127.0.0.1`, then open `http://127.0.0.1:4173/`. Use an HTTP server rather than opening HTML with a file URL because routes and JavaScript modules use root-relative paths. Stop the server with Ctrl+C.

## Cloudflare configuration

1. Open Cloudflare Workers & Pages, select Pages, and import the existing GitHub repository `malikali4129/AIM-DOWNLOADER-RELEASE`. If an `aimdownloader` Pages project already exists, inspect its settings and reuse it rather than creating another project.
2. Use `main` as the production branch, framework preset **None**, build command `exit 0`, build output directory `.`, and leave the root directory unset (repository root).
3. Use project name `aimdownloader` if available in your account. The intended canonical URL is `https://aimdownloader.pages.dev/`; do not claim this address is live until Cloudflare confirms it.
4. Enable preview deployments for non-production branches. Review a preview before publishing to `main`.
5. Check the home, download, getting-started, support, and releases routes. Check that an unknown path serves `404.html` with a 404 response. Cloudflare applies the security headers in `_headers` to the static site.

No API token or other secret is needed by this static website. GitHub release downloads stay on GitHub. A new stable software release is discovered at page load; it does not need a website commit or deployment.

Reference: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/

## Update the website

- Edit shared page content, navigation, footer, metadata, and availability text in `scripts/build-site.py`. Run `python scripts/build-site.py` and commit the regenerated HTML along with the script. Python is an authoring convenience, not a hosting requirement.
- The `AVAILABILITY` value is the single source of the pricing/availability wording. It currently says “Free to download for now.”
- Edit visual styles in `assets/styles.css`, navigation behavior in `assets/app.js`, and release parsing in `assets/releases.mjs`.
- The approved brand icon is `assets/brand-icon.png`. The product image is an actual screenshot of the installed v1.0.7 application with an empty queue, captured for this website; no interface or download records were fabricated. Replace it with another actual app capture when the interface changes.
- Keep all five canonical URLs and the sitemap consistent if the domain changes.
- Do not copy private application source, data folders, credentials, or binaries into this website. Release binaries belong in GitHub Releases.

## Release behavior

The download page requests `/repos/malikali4129/AIM-DOWNLOADER-RELEASE/releases/latest` from the public GitHub API and discovers the named Windows x64 installer, portable ZIP, and SHA256SUMS asset URLs. Direct buttons are shown only for validated assets. The releases page requests recent releases, excluding drafts and prereleases. It links to release notes instead of rendering their HTML. There is an eight-second timeout. On API failure or rate limiting, GitHub release-page links remain available. No version number is hard-coded into the page.

Support goes to public GitHub issues and `business.aliimranmalik@gmail.com`. There are no accounts, contact forms, analytics, or payment services.

## Checks

Run `node --test tests/releases.test.mjs` for release parsing and failure cases. Browser checks in `tests/browser-checks.cjs` require Playwright and its Chromium browser in the development environment, plus the local server. Run `node tests/browser-checks.cjs`; optionally set `SITE_URL` to another preview URL. Browser screenshots are written to ignored `tests/.artifacts/`. No test dependency is required on Cloudflare.

Only stage and commit website files after reviewing `git diff`. Existing release tags and the private application's release workflow must stay unchanged.

## Repository presentation

Set these in GitHub's About panel when publishing the repository updates:

- Description: Official Windows downloads for AIM Downloader. Videos, playlists, audio, and a portable edition.
- Website: use the confirmed live production URL; keep it consistent with the site's canonical URLs.
- Topics: `windows`, `video-downloader`, `playlist-downloader`, `audio-downloader`, `download-manager`, `portable`, `freeware`.

The README uses the existing app icon and screenshot. Keep them current when the app interface changes.

Issue forms live in `.github/ISSUE_TEMPLATE`. Security and support guidance live in `SECURITY.md` and `SUPPORT.md`. The license for the app is in `APP-LICENSE.txt`; `LICENSE.txt` covers the original website materials separately.

Use `.github/RELEASE_TEMPLATE.md` as a writing guide for user-facing release notes. The private application's workflow supplies release descriptions automatically; this public template does not override that workflow.

## Release freshness

The website fetches public release information on page load. No persistent application cache is used. Newly published stable releases can appear on the next page load once GitHub's API exposes them. Pushing source commits alone does not publish a release.

On a failed request or rate limit, the direct GitHub release-page fallback remains available. Do not put a private GitHub token into browser code to bypass rate limits.
