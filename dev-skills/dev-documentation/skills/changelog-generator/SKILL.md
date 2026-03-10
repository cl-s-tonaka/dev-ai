---
name: changelog-generator
version: 1.0.0
description: Generate CHANGELOG.md files following Keep a Changelog format, documenting version history and notable changes
tags:
  - documentation
  - changelog
  - versioning
  - releases
  - semver
---

# Changelog Generator

## Metadata

| Property | Value |
|----------|-------|
| Name | changelog-generator |
| Version | 1.0.0 |
| Category | Documentation |
| Complexity | Medium |

## Instructions

Generate well-structured CHANGELOG.md files following the Keep a Changelog format and Semantic Versioning principles. Transform technical commits and tickets into user-friendly change descriptions organized by impact category.

### Keep a Changelog Principles

1. **For Humans** - Written for users, not machines
2. **Organized by Version** - Newest first, with release dates
3. **Categorized Changes** - Grouped by type of change
4. **Linked References** - Version comparisons and issue links

### Change Categories

| Category | Description | Examples |
|----------|-------------|----------|
| Added | New features | New API endpoint, new command |
| Changed | Changes to existing functionality | UI redesign, API behavior change |
| Deprecated | Soon-to-be removed features | Old API version warning |
| Removed | Removed features | Deleted deprecated methods |
| Fixed | Bug fixes | Crash fix, data corruption fix |
| Security | Security improvements | Vulnerability patches |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| project_name | string | Yes | Name of the project |
| version | string | Yes | Version number being documented |
| changes | array | Yes | List of changes (commits, tickets, or descriptions) |
| previous_version | string | No | Previous version for comparison links |
| release_date | string | No | Release date (defaults to today) |
| git_log | file | No | Git log output to parse |

## Output Process

### Step 1: Gather Change Information

- [ ] Collect commits since last release
- [ ] Identify linked issues and PRs
- [ ] Group changes by category
- [ ] Identify breaking changes

### Step 2: Categorize Changes

- [ ] Classify each change by type
- [ ] Determine user impact level
- [ ] Identify security-related changes
- [ ] Note deprecations and removals

### Step 3: Write User-Friendly Descriptions

- [ ] Convert technical descriptions to user-facing language
- [ ] Focus on benefits and impacts
- [ ] Add context where needed
- [ ] Include migration notes for breaking changes

### Step 4: Format and Link

- [ ] Structure according to Keep a Changelog
- [ ] Add version comparison links
- [ ] Link to issues and PRs
- [ ] Include contributors if applicable

## Output Format

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New feature being developed

## [2.1.0] - 2024-03-15

### Added
- **OAuth 2.0 Support**: Users can now sign in with Google, GitHub, and Microsoft accounts. ([#234])
- **Export to PDF**: Export reports and dashboards directly to PDF format with customizable layouts.
- **Webhook Notifications**: Configure webhooks to receive real-time notifications for key events.
- **Dark Mode**: New dark theme option in user preferences.

### Changed
- **Dashboard Performance**: Dashboards now load 3x faster through optimized data fetching and caching.
- **API Rate Limits**: Increased rate limits from 100 to 500 requests per minute for all plans.
- **Node.js Requirement**: Minimum Node.js version is now 18.0.0 (was 16.0.0).

### Deprecated
- **Legacy API v1**: The v1 API is deprecated and will be removed in version 3.0.0. Please migrate to v2. See [migration guide](docs/migration-v1-to-v2.md).

### Removed
- **IE11 Support**: Internet Explorer 11 is no longer supported. Please use a modern browser.
- **`--legacy-mode` flag**: This CLI flag has been removed. Use `--compatibility=legacy` instead.

### Fixed
- **Data Export Bug**: Fixed an issue where CSV exports would fail for datasets larger than 10MB. ([#456])
- **Timezone Handling**: Resolved incorrect timestamp display for users in non-UTC timezones. ([#423])
- **Memory Leak**: Fixed memory leak in long-running background jobs that could cause performance degradation.

### Security
- **Dependency Updates**: Updated `lodash` to 4.17.21 to address prototype pollution vulnerability (CVE-2021-23337).
- **Session Management**: Sessions now expire after 24 hours of inactivity (was 7 days).

## [2.0.0] - 2024-01-10

### Breaking Changes

> **Migration Required**: This version includes breaking changes. See the [2.0 Migration Guide](docs/migration-2.0.md).

- **API Response Format**: API responses now use `camelCase` instead of `snake_case`. Update your client code accordingly.
- **Authentication**: JWT tokens are now required for all API endpoints. Basic auth has been removed.
- **Database Schema**: New database migrations required. Run `npm run migrate` before starting.

### Added
- Complete rewrite of the dashboard system with real-time updates
- New plugin architecture for custom integrations
- GraphQL API alongside REST API

### Changed
- Redesigned user interface with improved accessibility
- Improved error messages with actionable suggestions

### Removed
- Removed deprecated `legacyMode` configuration option
- Removed support for PostgreSQL 10 (minimum is now 12)

## [1.5.2] - 2023-12-01

### Fixed
- Fixed critical bug causing data loss when saving large documents ([#389])
- Resolved race condition in concurrent API requests

### Security
- Patched XSS vulnerability in user profile fields

## [1.5.1] - 2023-11-15

### Fixed
- Hotfix for login failures affecting SSO users

## [1.5.0] - 2023-11-01

### Added
- Team collaboration features with real-time editing
- Custom branding options for enterprise plans
- Audit log export functionality

### Changed
- Improved search algorithm with fuzzy matching
- Enhanced mobile responsiveness

[Unreleased]: https://github.com/owner/repo/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/owner/repo/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/owner/repo/compare/v1.5.2...v2.0.0
[1.5.2]: https://github.com/owner/repo/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/owner/repo/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/owner/repo/releases/tag/v1.5.0

[#234]: https://github.com/owner/repo/issues/234
[#456]: https://github.com/owner/repo/issues/456
[#423]: https://github.com/owner/repo/issues/423
[#389]: https://github.com/owner/repo/issues/389
```

### Commit Message to Changelog Entry Examples

| Commit Message | Changelog Entry |
|----------------|-----------------|
| `fix: resolve null pointer in user service` | Fixed crash when accessing user profiles with missing data |
| `feat(api): add bulk delete endpoint` | **Bulk Operations**: Delete multiple items in a single API call for improved performance |
| `perf: optimize database queries for reports` | Reports now load up to 5x faster with optimized database queries |
| `chore: update dependencies` | (Usually omitted unless security-related) |
| `BREAKING: remove deprecated auth method` | **Breaking**: Removed legacy authentication. Use OAuth 2.0 instead |

## Notes

- Always include the release date in ISO format (YYYY-MM-DD)
- Write for your users, not developers (unless it's a developer tool)
- Group related changes together under descriptive headings
- Use bold for feature names to improve scannability
- Include migration guides for breaking changes
- Link to relevant issues, PRs, and documentation
- Keep an `[Unreleased]` section for ongoing development
- Consider automation with conventional commits and tools like `standard-version`
- Update the changelog as part of your release process
- Translate technical commits into user benefits
