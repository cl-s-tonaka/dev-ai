---
name: pr-template
version: 1.0.0
description: Generate comprehensive PR templates and descriptions with review checklists
tags:
  - git
  - pull-request
  - code-review
  - collaboration
  - github
---

# PR Template Creation

## Metadata

| Property | Value |
|----------|-------|
| Name | pr-template |
| Version | 1.0.0 |
| Category | Development |
| Complexity | Medium |

## Instructions

Create comprehensive pull request descriptions and templates that facilitate effective code review, clear communication, and proper documentation of changes.

### PR Description Components

1. **Summary**: Brief overview of changes
2. **Motivation**: Why the change is needed
3. **Changes**: What was modified
4. **Testing**: How changes were verified
5. **Checklist**: Pre-merge requirements
6. **Screenshots**: Visual changes (if applicable)
7. **Notes**: Additional context for reviewers

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| changes | string | Yes | Description of what was changed |
| motivation | string | No | Why the change was made |
| issue_ref | string | No | Related issue or ticket |
| pr_type | string | No | Type: feature, bugfix, hotfix, refactor, docs |
| breaking | boolean | No | Whether this includes breaking changes |
| screenshots | boolean | No | Whether to include screenshot section |

## Output Process

### Step 1: Gather Information

- [ ] Identify all files and components changed
- [ ] Determine the type of PR (feature, fix, etc.)
- [ ] List related issues or tickets
- [ ] Note any breaking changes
- [ ] Identify testing requirements
- [ ] Check for documentation needs

### Step 2: Write Summary

**Guidelines:**
- Start with what the PR does (not what you did)
- Keep to 1-3 sentences
- Use present tense
- Be specific about the scope

**Examples:**
- "Adds OAuth2 authentication support for Google accounts"
- "Fixes memory leak in WebSocket connection handler"
- "Refactors database layer to use connection pooling"

### Step 3: Document Changes

**Categorize changes:**
- **Added**: New features or files
- **Changed**: Modifications to existing code
- **Deprecated**: Features marked for removal
- **Removed**: Deleted code or features
- **Fixed**: Bug fixes
- **Security**: Security-related changes

### Step 4: Define Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed
- [ ] Edge cases considered
- [ ] Performance impact assessed

### Step 5: Create Checklist

**Standard checklist items:**
- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added and passing
- [ ] No new warnings generated
- [ ] Dependencies updated in lockfile
- [ ] Breaking changes documented

### Step 6: Add Context

Include relevant information:
- Design decisions made
- Alternative approaches considered
- Performance implications
- Migration requirements
- Deployment considerations

## Output Format

### Standard PR Template

```markdown
## Summary

[Brief description of what this PR does]

## Related Issues

- Fixes #[issue_number]
- Related to #[issue_number]

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test update

## Changes Made

### Added
- [New feature or file]

### Changed
- [Modified functionality]

### Fixed
- [Bug that was fixed]

## Testing

### Test Coverage
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing completed

### Test Instructions
1. [Step to reproduce/test]
2. [Expected result]

## Screenshots (if applicable)

| Before | After |
|--------|-------|
| [screenshot] | [screenshot] |

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Breaking Changes

[Describe any breaking changes and migration path]

## Additional Notes

[Any additional information for reviewers]
```

### Minimal PR Template

```markdown
## What

[What does this PR do?]

## Why

[Why is this change needed?]

## How

[How was this implemented?]

## Testing

[How was this tested?]

## Checklist

- [ ] Tests pass
- [ ] Documentation updated
- [ ] Ready for review
```

### Feature PR Template

```markdown
## Feature: [Feature Name]

### Summary
[Brief description of the feature]

### User Story
As a [user type], I want [goal] so that [benefit].

### Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### Implementation Details
[Technical details about the implementation]

### Dependencies
- [Dependency 1]
- [Dependency 2]

### Testing
- [ ] Unit tests cover new functionality
- [ ] Integration tests added
- [ ] Acceptance criteria verified

### Documentation
- [ ] README updated
- [ ] API docs updated
- [ ] User guide updated

### Rollout Plan
[How will this be deployed/released?]
```

## Notes

- Adapt template complexity to team needs
- Include links to relevant documentation or discussions
- Use task lists for trackable progress
- Keep summaries scannable for quick review
- Tag appropriate reviewers based on changed files
- Consider adding labels for categorization
- Link to deployment previews when available
- Update PR description as changes are made during review
