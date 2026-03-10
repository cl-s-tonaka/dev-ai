---
name: commit
version: 1.0.0
description: Generate a Conventional Commits compliant commit message
argument-hint: "[changes description]"
arguments:
  - name: changes
    description: Description of the changes made
    required: true
examples:
  - "/commit Added user authentication with JWT"
  - "/commit Fixed login redirect issue"
  - "/commit Updated dependencies to latest versions"
---

# /commit

Generate a Conventional Commits compliant commit message based on the provided changes description.

## Metadata

| Property | Value |
|----------|-------|
| Command | /commit |
| Skill | [commit-message](../skills/commit-message/SKILL.md) |
| Category | Development |

## Instructions

When the user invokes `/commit`, analyze the provided changes description and generate a properly formatted commit message following the Conventional Commits specification.

### Process

1. **Parse the changes description** to understand what was modified
2. **Determine the commit type** (feat, fix, docs, style, refactor, perf, test, build, ci, chore)
3. **Identify the scope** if a specific component or area is affected
4. **Check for breaking changes** that would require a major version bump
5. **Generate the commit message** with proper formatting

### Commit Type Selection

| Type | When to Use |
|------|-------------|
| `feat` | New feature for users |
| `fix` | Bug fix for users |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons (no code change) |
| `refactor` | Code restructuring without behavior change |
| `perf` | Performance improvements |
| `test` | Adding or fixing tests |
| `build` | Build system or dependencies |
| `ci` | CI/CD configuration changes |
| `chore` | Maintenance tasks |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| changes | string | Yes | Description of changes made |

## Output Format

### Simple Commit (one line)
```
<type>(<scope>): <description>
```

### Detailed Commit (with body)
```
<type>(<scope>): <description>

<body explaining the what and why>

<footer with references>
```

## Examples

### Input
```
/commit Added user authentication with JWT tokens
```

### Output
```
feat(auth): add JWT-based user authentication

Implement JSON Web Token authentication for user sessions.
Includes token generation, validation, and refresh mechanisms.

Refs: #123
```

---

### Input
```
/commit Fixed the bug where login redirects to wrong page
```

### Output
```
fix(auth): correct login redirect destination

Resolve issue where successful login redirected users to
the home page instead of their intended destination.

Fixes: #456
```

---

### Input
```
/commit Updated React to version 18, breaking change in concurrent mode
```

### Output
```
feat(deps)!: upgrade React to v18 with concurrent mode

BREAKING CHANGE: Components using legacy lifecycle methods
will need to be updated. See migration guide for details.

Refs: #789
```

## Notes

- Always use imperative mood ("add" not "added")
- Keep the first line under 72 characters
- Use the body to explain "what" and "why", not "how"
- Reference relevant issues or tickets in the footer
- Mark breaking changes with `!` after type/scope or in footer
- One commit should represent one logical change
