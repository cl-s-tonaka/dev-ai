---
name: commit-message
version: 1.0.0
description: Create Conventional Commits compliant commit messages with proper type, scope, and description
tags:
  - git
  - commit
  - conventional-commits
  - version-control
  - changelog
---

# Commit Message Creation

## Metadata

| Property | Value |
|----------|-------|
| Name | commit-message |
| Version | 1.0.0 |
| Category | Development |
| Complexity | Low |

## Instructions

Generate commit messages following the Conventional Commits specification. Messages should be clear, consistent, and enable automated changelog generation and semantic versioning.

### Conventional Commits Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | MINOR |
| `fix` | Bug fix | PATCH |
| `docs` | Documentation only | None |
| `style` | Code style (formatting, semicolons) | None |
| `refactor` | Code change that neither fixes nor adds | None |
| `perf` | Performance improvement | PATCH |
| `test` | Adding or correcting tests | None |
| `build` | Build system or dependencies | None |
| `ci` | CI configuration | None |
| `chore` | Other changes (maintenance) | None |
| `revert` | Reverts a previous commit | Varies |

### Breaking Changes

Add `!` after type/scope or include `BREAKING CHANGE:` in footer:
```
feat!: remove deprecated API endpoints
```
or
```
feat: redesign authentication system

BREAKING CHANGE: JWT token format has changed, requiring re-authentication
```

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| changes | string | Yes | Description of what was changed |
| type | string | No | Commit type if known |
| scope | string | No | Component or area affected |
| breaking | boolean | No | Whether this is a breaking change |
| issue_ref | string | No | Issue or ticket reference |

## Output Process

### Step 1: Analyze Changes

- [ ] Identify the primary purpose of the change
- [ ] Determine the appropriate commit type
- [ ] Identify affected components (scope)
- [ ] Check for breaking changes
- [ ] Note any related issues or tickets

### Step 2: Determine Type

**Decision Tree:**
1. Does it add a new feature? → `feat`
2. Does it fix a bug? → `fix`
3. Does it only change documentation? → `docs`
4. Does it improve performance? → `perf`
5. Does it refactor without changing behavior? → `refactor`
6. Does it add or fix tests? → `test`
7. Does it change build/CI? → `build` or `ci`
8. Is it a formatting change? → `style`
9. Other maintenance? → `chore`

### Step 3: Identify Scope (Optional)

Common scopes:
- Component names: `auth`, `api`, `ui`, `db`
- Layers: `controller`, `service`, `model`
- Features: `login`, `dashboard`, `settings`
- Areas: `frontend`, `backend`, `infra`

### Step 4: Write Description

Rules:
- [ ] Use imperative mood ("add" not "added" or "adds")
- [ ] Don't capitalize first letter
- [ ] No period at the end
- [ ] Keep under 50 characters if possible
- [ ] Be specific but concise

### Step 5: Add Body (If Needed)

Include body when:
- Change requires explanation of "why"
- Multiple related changes in one commit
- Complex technical decisions made
- Migration or upgrade instructions needed

### Step 6: Add Footer (If Applicable)

```
Refs: #123
Reviewed-by: @username
Co-authored-by: Name <email@example.com>
BREAKING CHANGE: description
```

## Output Format

### Simple Commit
```
<type>(<scope>): <description>
```

### Detailed Commit
```
<type>(<scope>): <description>

<body - explain what and why, not how>

<footer>
```

### Examples

**Feature:**
```
feat(auth): add OAuth2 support for Google login

Implement OAuth2 flow for Google authentication provider.
Users can now sign in with their Google accounts.

Refs: #456
```

**Bug Fix:**
```
fix(api): handle null response in user endpoint

Return empty object instead of throwing when user
preferences are not set.

Fixes: #789
```

**Breaking Change:**
```
feat(api)!: change response format for pagination

BREAKING CHANGE: Pagination now uses cursor-based format.
The `page` and `limit` parameters are replaced with
`cursor` and `size`. See migration guide in docs.

Refs: #234
```

**Simple Changes:**
```
docs(readme): update installation instructions
```
```
style(components): format with prettier
```
```
test(auth): add unit tests for password validation
```
```
chore(deps): update lodash to 4.17.21
```

## Notes

- One commit should represent one logical change
- If describing changes requires "and", consider splitting commits
- Use present tense, imperative mood consistently
- Reference issues/tickets when applicable
- Breaking changes must be clearly marked
- Consider your team's changelog when writing descriptions
- Automated tools can enforce format via commit-msg hooks
- Use `git commit --amend` to fix the last commit message
