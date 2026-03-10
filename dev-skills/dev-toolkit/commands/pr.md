---
name: pr
version: 1.0.0
description: Create a pull request with description and review checklist
argument-hint: "[feature or changes description]"
arguments:
  - name: description
    description: Description of the feature or changes
    required: true
  - name: type
    description: "PR type: feature, bugfix, hotfix, refactor, docs"
    required: false
examples:
  - "/pr Implemented user dashboard with analytics"
  - "/pr Fixed authentication token refresh issue"
  - "/pr Refactored database connection pooling"
---

# /pr

Create a comprehensive pull request with description, changes summary, and review checklist.

## Metadata

| Property | Value |
|----------|-------|
| Command | /pr |
| Skill | [pr-template](../skills/pr-template/SKILL.md) |
| Category | Development |

## Instructions

When the user invokes `/pr`, analyze the provided feature or changes description and generate a complete pull request with:

1. **Summary** - Clear overview of the changes
2. **Related Issues** - Linked issues or tickets
3. **Type of Change** - Classification of the PR
4. **Changes Made** - Detailed breakdown of modifications
5. **Testing** - How changes were verified
6. **Checklist** - Pre-merge requirements

### Process

1. **Understand the scope** of changes from the description
2. **Identify the PR type** (feature, bugfix, hotfix, refactor, docs)
3. **Extract key changes** that should be highlighted
4. **Generate testing suggestions** based on the changes
5. **Create appropriate checklist items** for review

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| description | string | Yes | Description of feature or changes |
| type | string | No | PR type (feature, bugfix, hotfix, refactor, docs) |
| issue | string | No | Related issue number |

## Output Format

```markdown
## Summary

[1-3 sentence description of what this PR does]

## Related Issues

- Fixes #[issue_number]
- Related to #[issue_number]

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [x] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Changes Made

### Added
- [New feature or functionality]

### Changed
- [Modified behavior or component]

### Fixed
- [Bug that was resolved]

## Testing

### Test Coverage
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

### How to Test
1. [Step-by-step testing instructions]
2. [Expected behavior]

## Screenshots (if applicable)

[Include before/after screenshots for UI changes]

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added and passing
- [ ] No new warnings generated

## Additional Notes

[Any additional context for reviewers]
```

## Examples

### Input
```
/pr Implemented user dashboard with real-time analytics
```

### Output
```markdown
## Summary

Adds a new user dashboard page featuring real-time analytics widgets, activity charts, and performance metrics. Users can now monitor their key statistics at a glance.

## Related Issues

- Implements #234
- Related to #220 (analytics API)

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [x] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Changes Made

### Added
- Dashboard page component with responsive layout
- Real-time analytics widgets using WebSocket connections
- Activity chart with D3.js visualization
- Performance metrics cards
- Date range filter for historical data

### Changed
- Updated navigation to include dashboard link
- Modified user service to include analytics endpoints

## Testing

### Test Coverage
- [x] Unit tests for dashboard components
- [x] Integration tests for analytics API
- [ ] Manual testing completed

### How to Test
1. Log in as any user
2. Navigate to Dashboard from the sidebar
3. Verify widgets display current data
4. Change date range and confirm chart updates
5. Check responsive behavior on mobile

## Screenshots

| Desktop | Mobile |
|---------|--------|
| [screenshot] | [screenshot] |

## Checklist

- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [ ] Documentation updated
- [x] Tests added and passing
- [x] No new warnings generated

## Additional Notes

- WebSocket connection handles reconnection automatically
- Analytics data is cached for 5 minutes to reduce API load
- Consider adding loading skeletons in future iteration
```

---

### Input
```
/pr Fixed authentication token refresh causing logout
```

### Output
```markdown
## Summary

Fixes an issue where users were being unexpectedly logged out due to a race condition in the token refresh mechanism. The refresh now properly queues concurrent requests.

## Related Issues

- Fixes #567
- Related to #540 (original auth implementation)

## Type of Change

- [x] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Changes Made

### Fixed
- Race condition in token refresh when multiple API calls trigger refresh simultaneously
- Token expiry calculation off-by-one error
- Memory leak from uncleared refresh timeout

### Changed
- Refactored token refresh to use a request queue
- Added mutex lock for concurrent refresh attempts

## Testing

### Test Coverage
- [x] Unit tests for token refresh logic
- [x] Integration tests for auth flow
- [x] Manual testing completed

### How to Test
1. Log in and wait for token to near expiration (5 minutes)
2. Rapidly trigger multiple API calls
3. Verify user remains logged in
4. Check console for any auth errors

## Checklist

- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Documentation updated
- [x] Tests added and passing
- [x] No new warnings generated

## Additional Notes

- Root cause was identified through production logs
- Fix has been verified in staging environment for 24 hours
- No breaking changes to auth API
```

## Notes

- Adjust checklist items based on project requirements
- Include screenshots for any UI changes
- Link to relevant documentation or design specs
- Tag appropriate reviewers based on changed files
- Keep summary concise but informative
- Update PR description as changes evolve during review
