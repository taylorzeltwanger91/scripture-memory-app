# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.0] - 2026-02-09

### Added
- Full Bible access: all 66 books, every chapter automatically fetched from KJV API
- Browse view now auto-loads and displays all verses when a chapter is selected
- Loading spinner while verses are being fetched
- Cached chapters are highlighted in the chapter grid

### Fixed
- Single-chapter books (Obadiah, Philemon, 2 John, 3 John, Jude) now fetch correctly
- Browse view no longer shows empty content for most chapters

## [0.1.0] - 2026-02-09

### Added
- Initial scaffold with React 19 + Vite + Tailwind CSS
- KJV scripture data with popular passages
- Four practice modes: Listen, Speak With, Recall, Faded
- Text-to-speech playback with adjustable speed
- Speech recognition with word-by-word alignment
- Progress tracking with memorized/learning/in-progress status
- Favorites system
- Search across verses and references
- Session resume (continue where you left off)
- Browse library by book and chapter
- GitHub Pages deployment via GitHub Actions
