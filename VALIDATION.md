# Website verification

Verified locally on 12 September 2026.

- Seven release parser tests passed: expected asset selection, missing assets, draft/prerelease exclusion, unsafe URLs, invalid dates/sizes, API failures, malformed responses, and history handling.
- Browser checks passed for Home, Download, Getting started, FAQ & support, Releases, and the custom 404 page at 390, 768, and 1440 pixels wide.
- Verified local links, images, one main heading per page, canonical metadata, mobile menu, FAQ expansion, keyboard skip link, Escape behavior, reduced motion, and JavaScript-disabled navigation/download fallback.
- Verified release rendering with success, missing assets, rate limiting, empty history, and malicious text fixtures. Fixture version/filenames match the public v1.0.7 release; fixture file sizes are test data only, not production page values.
- The live GitHub API was rate-limited during inspection. Its real failure fallback was verified. GitHub's public release page confirmed v1.0.7 and the installer, portable ZIP, and SHA256SUMS assets. All three actual download URLs returned HTTP 200 to HEAD requests.
- Visual review covered desktop Home, Download, Support, and Releases, and mobile Home and Getting started. Resolved decorative overflow, preserved icon proportions, and removed the initial opacity fade so primary content remains readable during animation.
- Product screenshot captured from the installed v1.0.7 app with an empty queue. Guide copy was checked against current app source, including Auto-Download review behavior and configurable concurrency.
- No application source, update endpoint, release workflow, release tag, or binary was changed.

Cloudflare was not connected or deployed, as requested. Its root routing, security headers, and 404 status must be confirmed on the future Pages preview. The local Python server serves the custom 404 page at `/404.html`; unknown paths use Python's default 404 response until hosted by Pages.
