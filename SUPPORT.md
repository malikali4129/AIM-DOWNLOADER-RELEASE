# Get help with AIM Downloader

Download the installer or portable ZIP from the [latest release](https://github.com/malikali4129/AIM-DOWNLOADER-RELEASE/releases/latest). GitHub's automatic source archives contain the website, not the desktop application.

## Before reporting a problem

- For portable use, extract the complete ZIP into a writable folder.
- First-run tool setup needs internet access. If it fails, check your connection and retry.
- Use a download folder with enough free space.
- If a source website stops working, check for tool updates inside AIM.
- Public links depend on upstream support. Private and sign-in-required links are outside the current scope.
- If the website cannot load release information, follow its GitHub download link. You can still download from Releases.

## Report a bug or suggest a feature

Open the [issue chooser](https://github.com/malikali4129/AIM-DOWNLOADER-RELEASE/issues/new/choose). For bugs, include your app version, Windows version, installer or portable edition, reproduction steps, and the error message.

Issues are public. Remove sensitive information from logs and screenshots before attaching them.

For private support, email [business.aliimranmalik@gmail.com](mailto:business.aliimranmalik@gmail.com). For vulnerabilities, follow [SECURITY.md](SECURITY.md).

## Verify a download

Download `SHA256SUMS.txt` from the same release as your installer or ZIP. In PowerShell, run the following with your actual file path:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'C:\path\to\downloaded-file.exe'
```

Compare the resulting hash with the entry for that exact filename in `SHA256SUMS.txt`. Matching hashes verify that the file matches the published checksum; they are not a code-signing certificate or malware scan.
