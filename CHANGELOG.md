# Changelog

## 0.1.6

Released: 2026-04-02

No breaking changes.

### Added

- direct mode now embeds the live site directly inside the page body while keeping the header menu available to exit

### Changed

- the home URL bar now uses the full header width without the old top/right whitespace
- direct mode now replaces the parsed page body instead of stacking an extra wrapper card above it

### Notes

- sites that block iframe embedding may still require opening the real page externally
- this release depends on `even-toolkit` 1.6.2


## 0.1.5

Released: 2026-04-02

No breaking changes.

### Added

- multi-language coverage for auth, search, page actions, direct mode, and settings flows
- expanded display settings for read mode, lines per page, page numbers, font size, language, and history clearing

### Changed

- the settings screen is rebuilt into clearer display, language, data, and about sections
- page titles, direct mode messaging, and auth dialog copy are now consistent with the translated app surface

### Notes

- existing bookmarks, history, and saved page data remain compatible with this release
