---
name: git
version: 1.0.0
description: Git workflow guidance and command assistance
argument-hint: "[workflow question or task]"
arguments:
  - name: query
    description: Git workflow question or task to accomplish
    required: true
examples:
  - "/git How do I set up GitFlow for my project?"
  - "/git What's the best branching strategy for a small team?"
  - "/git How do I recover a deleted branch?"
---

# /git

Provide Git workflow guidance, branching strategies, and command assistance.

## Metadata

| Property | Value |
|----------|-------|
| Command | /git |
| Skill | [git-workflow](../skills/git-workflow/SKILL.md) |
| Category | Development |

## Instructions

When the user invokes `/git`, provide expert guidance on Git workflows, branching strategies, and commands. This includes:

1. **Workflow Design** - GitFlow, GitHub Flow, Trunk-based development
2. **Branch Management** - Creating, merging, rebasing branches
3. **Problem Solving** - Recovering from mistakes, resolving conflicts
4. **Best Practices** - Naming conventions, commit strategies

### Topics Covered

| Topic | Description |
|-------|-------------|
| Workflows | GitFlow, GitHub Flow, Trunk-based, custom workflows |
| Branching | Branch creation, naming, lifecycle management |
| Merging | Merge strategies, conflict resolution |
| History | Rebase, cherry-pick, amend, revert |
| Recovery | Reflog, reset, stash recovery |
| Collaboration | Remote management, pull requests |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| query | string | Yes | Git-related question or task |

## Output Format

### For Workflow Questions
```markdown
## Recommended Workflow: [Name]

### Overview
[Why this workflow fits your needs]

### Branch Structure
```
main
├── develop
│   ├── feature/...
│   └── bugfix/...
├── release/...
└── hotfix/...
```

### Implementation Steps
1. [Step-by-step setup]

### Common Commands
```bash
# Relevant git commands
```

### Best Practices
- [Practice 1]
- [Practice 2]
```

### For Command Questions
```markdown
## Solution

### Command
```bash
git command [options]
```

### Explanation
[What this command does]

### Example
```bash
# Example with real values
```

### Caution
[Any warnings or considerations]
```

## Examples

### Input
```
/git How do I set up GitFlow for a new project?
```

### Output
```markdown
## Setting Up GitFlow

### Initial Setup

```bash
# Initialize GitFlow in your repository
git flow init

# Or manually create the branch structure
git checkout -b develop main
git push -u origin develop
```

### Branch Structure
```
main (production-ready)
└── develop (integration)
    ├── feature/* (new features)
    ├── bugfix/* (bug fixes)
    ├── release/* (release prep)
    └── hotfix/* (production fixes)
```

### Working with Features

```bash
# Start a new feature
git flow feature start user-authentication
# Or: git checkout -b feature/user-authentication develop

# Finish a feature
git flow feature finish user-authentication
# Or: git checkout develop && git merge feature/user-authentication

# Push feature for review
git flow feature publish user-authentication
```

### Creating Releases

```bash
# Start a release
git flow release start 1.2.0

# Finish a release (merges to main and develop, tags)
git flow release finish 1.2.0
git push origin main develop --tags
```

### Hotfixes

```bash
# Start hotfix from main
git flow hotfix start security-patch

# Finish hotfix (merges to both main and develop)
git flow hotfix finish security-patch
```

### Branch Protection Rules

Configure in your repository settings:
- `main`: Require PR, require reviews, require CI
- `develop`: Require PR, require CI
- `release/*`: Require PR, require reviews

### Best Practices
- Keep feature branches short-lived (1-2 weeks max)
- Always branch from develop for features
- Use semantic versioning for releases
- Delete branches after merging
```

---

### Input
```
/git How do I recover a branch I accidentally deleted?
```

### Output
```markdown
## Recovering a Deleted Branch

### If Deleted Locally

```bash
# Find the commit hash from reflog
git reflog

# Look for entries like:
# abc1234 HEAD@{2}: checkout: moving from deleted-branch to main

# Recreate the branch at that commit
git checkout -b deleted-branch abc1234
```

### If Deleted Remotely

```bash
# Check if you still have it locally
git branch -a | grep branch-name

# If local copy exists, push it back
git push origin branch-name

# If no local copy, check GitHub/GitLab UI
# They often retain deleted branches temporarily
```

### Using Git Reflog

```bash
# View full reflog
git reflog show --all

# Find the last commit on the deleted branch
git log --walk-reflogs --grep="branch-name"

# Once you find the commit SHA
git checkout -b branch-name <commit-sha>
```

### Preventive Measures

```bash
# Before deleting, ensure it's merged
git branch --merged main | grep branch-name

# Use safe delete (fails if not merged)
git branch -d branch-name  # safe
git branch -D branch-name  # force (be careful)
```

### Caution
- Reflog entries expire (default 90 days for reachable, 30 for unreachable)
- Act quickly after accidental deletion
- Consider backing up before major branch operations
```

---

### Input
```
/git What branching strategy works best for a 3-person team with weekly releases?
```

### Output
```markdown
## Recommended: GitHub Flow

For a small team with frequent releases, GitHub Flow provides simplicity and speed.

### Why GitHub Flow?

| Factor | GitHub Flow Advantage |
|--------|----------------------|
| Team Size (3) | Simple enough for everyone to follow |
| Weekly Releases | Supports continuous deployment |
| Complexity | Minimal overhead and ceremony |

### Branch Structure

```
main (always deployable)
├── feature/user-auth
├── feature/dashboard
└── bugfix/login-issue
```

### Workflow

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. Work on feature with regular commits
git add .
git commit -m "feat: add feature component"

# 3. Push and create PR
git push -u origin feature/new-feature
# Create PR on GitHub/GitLab

# 4. After review, merge to main
# Use squash merge for clean history

# 5. Deploy from main
# Automated via CI/CD
```

### Weekly Release Process

```bash
# Tag releases for tracking
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release v1.2.0 - Week 24"
git push origin v1.2.0
```

### Best Practices for Small Teams

1. **Short-lived branches** - Merge within 1-2 days
2. **Small PRs** - Easier to review quickly
3. **Trunk-based mindset** - Main should always be deployable
4. **Feature flags** - Deploy incomplete features safely
5. **Automated tests** - Confidence to merge frequently

### Branch Protection

```yaml
main:
  - Require pull request (1 reviewer)
  - Require status checks
  - Auto-delete head branches
```

This keeps process lightweight while maintaining quality.
```

## Notes

- Adapt recommendations to team experience level
- Consider CI/CD pipeline when suggesting workflows
- Provide both git-flow CLI and manual git commands
- Include safety warnings for destructive operations
- Reference official Git documentation when appropriate
