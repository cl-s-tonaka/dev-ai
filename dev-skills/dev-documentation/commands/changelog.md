---
description: Generate a CHANGELOG.md file from git history, commits, or provided release information
argument-hint: "<version number or 'from git'>"
---

# /changelog -- CHANGELOG Generation

Generate a well-structured CHANGELOG.md following the Keep a Changelog format, transforming technical changes into user-friendly descriptions.

## Invocation

```
/changelog v2.1.0
/changelog from git
/changelog Generate changelog for releases between v1.0 and v2.0
/changelog [paste commit messages or release notes]
```

## Workflow

### Step 1: Gather Change Information

Identify the source of changes:

**From Git History:**
```bash
# Get commits since last tag
git log $(git describe --tags --abbrev=0)..HEAD --oneline

# Get commits between versions
git log v1.0.0..v2.0.0 --oneline
```

**From User Input:**
- List of changes or features
- Commit messages
- Jira/Linear tickets
- Release notes draft

**From Files:**
- Uploaded changelog to update
- Exported tickets
- PR descriptions

### Step 2: Categorize Changes

Apply the **changelog-generator** skill to categorize each change:

| Category | Criteria | Prefix in Commits |
|----------|----------|-------------------|
| Added | New features | `feat:`, `feature:` |
| Changed | Modifications to existing features | `refactor:`, `change:` |
| Deprecated | Soon-to-be removed | `deprecate:` |
| Removed | Removed features | `remove:` |
| Fixed | Bug fixes | `fix:`, `bugfix:` |
| Security | Security improvements | `security:` |

### Step 3: Transform Technical to User-Facing

Convert developer-focused descriptions to user-focused benefits:

| Technical | User-Facing |
|-----------|-------------|
| "Implemented Redis caching for dashboard API" | "Dashboards now load up to 3x faster" |
| "Fixed race condition in checkout" | "Fixed an issue where orders could fail during high traffic" |
| "Refactored auth module" | (Omit - internal change) |
| "Added support for OAuth 2.0" | "Sign in with Google, GitHub, or Microsoft accounts" |

### Step 4: Generate CHANGELOG

Create or update the CHANGELOG with this structure:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New feature in development

## [2.1.0] - 2024-03-15

### Added
- **OAuth 2.0 Support**: Sign in with Google, GitHub, or Microsoft accounts. ([#234])
- **PDF Export**: Export reports and dashboards to PDF format.
- **Dark Mode**: New dark theme option in user preferences.

### Changed
- **Performance**: Dashboards load 3x faster with optimized caching.
- **Node.js**: Minimum version is now 18.0.0 (was 16.0.0).

### Deprecated
- **API v1**: Deprecated in favor of v2. Will be removed in 3.0.0.

### Fixed
- Fixed CSV export failing for large datasets (>10MB). ([#456])
- Fixed timezone issues for non-UTC users. ([#423])

### Security
- Updated lodash to patch CVE-2021-23337.

## [2.0.0] - 2024-01-10

### Breaking Changes

> **Migration Required**: See [Migration Guide](docs/migration-2.0.md)

- API responses now use camelCase instead of snake_case
- JWT tokens required for all endpoints (Basic auth removed)

### Added
- Complete dashboard redesign with real-time updates
- GraphQL API alongside REST

### Removed
- Internet Explorer 11 support
- Legacy authentication method

[Unreleased]: https://github.com/owner/repo/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/owner/repo/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/owner/repo/releases/tag/v2.0.0

[#234]: https://github.com/owner/repo/issues/234
[#456]: https://github.com/owner/repo/issues/456
[#423]: https://github.com/owner/repo/issues/423
```

### Step 5: Handle Different Scenarios

**New CHANGELOG (no existing file):**
- Create full structure with header
- Add current version and any historical versions provided
- Include `[Unreleased]` section

**Update Existing CHANGELOG:**
- Read existing file
- Add new version entry below `[Unreleased]`
- Move unreleased changes to new version
- Update comparison links

**Multiple Versions:**
- Generate entries for each version
- Maintain chronological order (newest first)
- Include comparison links between versions

### Step 6: Version Number Guidelines

Help determine appropriate version bump:

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Breaking changes | Major (X.0.0) | 1.0.0 → 2.0.0 |
| New features (backward compatible) | Minor (0.X.0) | 1.0.0 → 1.1.0 |
| Bug fixes | Patch (0.0.X) | 1.0.0 → 1.0.1 |

### Step 7: Finalize and Save

Before saving:
- [ ] All entries are user-focused, not technical
- [ ] Breaking changes are clearly marked
- [ ] Issue/PR references are linked
- [ ] Dates are in ISO format (YYYY-MM-DD)
- [ ] Comparison links are correct

Save as `CHANGELOG.md` in the project root.

### Step 8: Offer Enhancements

After generating, offer:
- "Want me to **update package.json** with the new version?"
- "Should I **create a git tag** for this release?"
- "Want me to **generate release notes** for GitHub?"
- "Should I **create a migration guide** for breaking changes?"

## Git Integration

### Extract Changes from Git

```bash
# Conventional commits to changelog entries
git log --pretty=format:"%s" v1.0.0..HEAD | while read commit; do
  case "$commit" in
    feat*) echo "### Added"; echo "- ${commit#feat: }" ;;
    fix*) echo "### Fixed"; echo "- ${commit#fix: }" ;;
    # etc.
  esac
done
```

### Recommended Git Workflow

1. Use conventional commits during development
2. Run `/changelog from git` before release
3. Review and edit generated changelog
4. Commit changelog update
5. Tag the release

## Notes

- Write for users, not developers
- Group related changes under descriptive sub-headings
- Use bold for feature names to improve scannability
- Always include migration notes for breaking changes
- Link to relevant documentation, issues, and PRs
- Keep an `[Unreleased]` section for ongoing development
- Consider automation with tools like `standard-version` or `semantic-release`
- Include the release date in ISO format
- Thank contributors in major releases
