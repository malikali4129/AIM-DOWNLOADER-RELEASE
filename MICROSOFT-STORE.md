# Microsoft Store submission notes

Prepared 12 September 2026 for the current Windows x64 EXE distribution. These notes and legal drafts do not guarantee certification or legal compliance.

## Public links to supply after deployment

Use your confirmed production origin followed by:

| Field | Path |
| --- | --- |
| Privacy policy | `/privacy/` |
| Support | `/support/` |
| Application license / custom terms | `/license/` |
| Website terms | `/terms/` |

The permanent origin `https://aimdownloader.pages.dev` was verified to return the AIM website on 12 September 2026. Use it instead of the expiring custom domain. The new legal routes must be deployed before their URLs are submitted. Pages must be publicly reachable over HTTPS without signing in. Legal HTML is generated into the repository; Cloudflare can serve it without running Python.

The owner confirmed Cloudflare Web Analytics is disabled. The drafts reflect reviewed application and website source; hosting-dashboard settings were not inspected. Confirm support-data handling and applicable distribution-market requirements before publication. Review material legal obligations with qualified counsel as appropriate for those markets.

## Does the Store follow GitHub releases?

No. Publishing a GitHub release does not create a Microsoft Store update submission.

For MSI/EXE submissions, provide a version-specific HTTPS installer URL in Partner Center. Keep that file unchanged. Submit the next version's URL as a Store update; do not use a moving `latest` URL. The Store downloads the submitted package for new installations. A GitHub release asset must still meet Microsoft's availability and package requirements; acceptance has not been tested here.

Microsoft says the Store does not deliver MSI/EXE updates to existing users automatically or manually. Your app or installer must handle those updates. AIM's GitHub update checks are separate from updating the Store listing.

MSIX is a different distribution path: Store-managed updates are available for Store-submitted MSIX packages. GitHub publishing alone still does not submit a new Store package.

## Package checks still needed

- Validate the chosen EXE's signing and all relevant binaries against Microsoft's current signing requirements.
- Confirm silent installation, exit codes, architecture, and upgrade behavior. The existing Inno Setup build has not been certified by Microsoft here.
- Microsoft requires a standalone/offline installer, not an installer that downloads its binaries. AIM's app performs first-run tool downloads; disclose this behavior for review and assess the Store distribution package. Do not assume policy pages alone resolve this requirement.
- Add an accessible privacy-policy link inside the app for Store submission where required. This website task has not modified the app UI.
- Complete Partner Center's privacy, age-rating, and content declarations based on actual behavior. Do not state that no data is accessed or transmitted: the app reads user-selected links/files, can read clipboard text, and sends network requests to third parties.
- Preserve third-party notices and satisfy applicable redistribution/source obligations, particularly for any FFmpeg build bundled in a release.

## Keeping the legal pages current

Edit `scripts/legal-content.json` and regenerate with `python scripts/build-site.py`. The app-license page reads `APP-LICENSE.txt`. Update the displayed policy date when changing practices. If the production domain changes, update `ORIGIN` in the generator and regenerate canonical URLs and the sitemap.

## Official references

- [EXE/MSI updates](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msi/publish-update-to-your-app-on-store)
- [Package URL and offline installer requirements](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msi/upload-app-packages)
- [Distribution paths and signing](https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/choose-distribution-path)
- [Microsoft Store policies](https://learn.microsoft.com/en-us/windows/apps/publish/store-policies)

## Fields on the Properties form

- Privacy: the complete paste-ready text is in `PRIVACY-POLICY.txt`. Alternatively select the URL option and use `https://aimdownloader.pages.dev/privacy/` after deploying and checking that page.
- Support website: `https://github.com/malikali4129/AIM-DOWNLOADER-RELEASE/issues` is public. Do not use the private source repository's Issues URL.
- Support contact and public email: `business.aliimranmalik@gmail.com` matches the website and policy. Use another owned address only if you update the policy and support pages consistently.
- Contact phone/address: provide accurate business contact information where required. This form says these contact details are displayed to customers. Do not use placeholders or unnecessary personal contact details; check each field's requirements.
- Non-Microsoft drivers or NT services: leave unchecked for the reviewed app. External command-line tools are not themselves installed drivers or NT services.
- Tested to meet accessibility guidelines: leave unchecked until the app has specifically passed the relevant accessibility evaluation. A standard WPF interface is not proof of this.
- Pen and ink input: leave unchecked; no dedicated pen/ink functionality was found.
- Generative AI: leave unchecked; downloading and converting media does not generate content with AI. Using AI to develop the app is not an in-app generative-AI feature.

### Notes for certification

AIM Downloader is a Windows x64 desktop application for downloading public videos, playlists, and audio. No account or sign-in is required. Install and launch the app, choose a writable download folder, and complete first-run tool setup. Setup downloads and verifies yt-dlp, FFmpeg/FFprobe, and Deno if needed; internet access is required. These run as user-space processes; the app does not install a custom driver or NT service.

For testing, use a public media URL that you have permission to download. Turn Auto-Download off to review items first, choose a format, add the URL, and start the pending download. Supported formats depend on the source website. Private and sign-in-required links are outside scope.

Clipboard monitoring is optional and off by default. Queue, settings, and completion history are stored locally. The app contacts GitHub for release information and tool providers/media websites for requested operations. Application privacy details are provided in the submission. Please assess first-run tool acquisition as part of the submitted distribution.
