# Smart Hub handoff

Start by reading `README.md`, `docs/RESTANT.md` and, for hardware work, `docs/CADRE-WINDOWS.md`. The user wants to copy this project to a Windows tower with USB-A, then finish setup on their own AiMOR frame.

- The UI is a working browser prototype, not a proven on-device installation. No physical ADB access was obtained during the initial Mac session. Never infer deployment from a successful browser test.
- Read the current Git status/history/remotes before changing or publishing. GitHub creation was deferred until the user reviews the first UI. Keep human-readable English commits and logical semantic versions based on existing history.
- Preserve user data. `.env`, `.data`, firmware backups, diagnostic dumps, account credentials and private device identifiers must stay out of Git. Never log OAuth tokens or API secrets.
- Device IP and MAC changed on reboot. Re-read the current IP; historic values are not defaults. Port 8086 is the AiMOR file service, not ADB.
- Start with the USB and network read-only checks, and stop if identity differs from the documented device. Verify backups before device writes. Do not flash boot/system or disable the only working launcher/access path as a routine setup step.
- ADB, a screenshot or an injected tap does not prove that physical touch or a recovery path works. Have the user verify the real touchscreen and access to Android Settings before replacing the launcher.
- Target Chrome/WebView 106+. Avoid CSS nesting, `color-mix()`, `oklch()` and `:has()` for required behavior. Native View Transitions are an optional enhancement with a color-transition fallback.
- Preserve reduced-motion behavior and keyboard focus. Keep motion short and event-driven; no perpetual render loops. Clocks update by minute, timers by second only when active, and synchronization sleeps when hidden.
- Run `npm run check`, `npm test`, then verify affected UI at 1280 × 800 and relevant narrow sizes. Test real integrations separately; never present sample data as connected data.
- Track completed and remaining work in `docs/RESTANT.md`, distinguishing local code, Git publication, service authorization and hardware installation.
