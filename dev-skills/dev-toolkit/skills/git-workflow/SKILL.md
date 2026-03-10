---
name: git-workflow
version: 1.0.0
description: Design and implement Git branching strategies including GitFlow, GitHub Flow, and Trunk-based development
tags:
  - git
  - workflow
  - branching
  - version-control
  - collaboration
---

# Git Workflow Design

## Metadata

| Property | Value |
|----------|-------|
| Name | git-workflow |
| Version | 1.0.0 |
| Category | Development |
| Complexity | Medium |

## Instructions

Design and implement appropriate Git branching strategies based on team size, release cadence, and project requirements. Provide guidance on branch naming, merge strategies, and workflow best practices.

### Workflow Selection Criteria

1. **GitFlow** - Best for:
   - Scheduled release cycles
   - Multiple versions in production
   - Larger teams with QA processes
   - Projects requiring hotfix capabilities

2. **GitHub Flow** - Best for:
   - Continuous deployment
   - Single production version
   - Smaller teams
   - Web applications with frequent releases

3. **Trunk-Based Development** - Best for:
   - High-performing teams
   - Continuous integration maturity
   - Feature flags infrastructure
   - Rapid iteration cycles

### Branch Naming Conventions

```
feature/    - New features (feature/user-authentication)
bugfix/     - Bug fixes (bugfix/login-redirect-issue)
hotfix/     - Production hotfixes (hotfix/security-patch-2.1.1)
release/    - Release preparation (release/v2.0.0)
docs/       - Documentation (docs/api-reference)
refactor/   - Code refactoring (refactor/database-layer)
test/       - Test additions (test/integration-suite)
chore/      - Maintenance (chore/update-dependencies)
```

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| team_size | number | Yes | Number of developers on the team |
| release_cadence | string | Yes | How often releases occur (daily, weekly, monthly, quarterly) |
| deployment_type | string | Yes | Deployment model (continuous, scheduled, manual) |
| project_type | string | No | Type of project (web, mobile, library, microservice) |
| current_workflow | string | No | Existing workflow if migrating |

## Output Process

### Step 1: Assess Requirements

- [ ] Determine team size and structure
- [ ] Identify release frequency and deployment model
- [ ] Evaluate current pain points (if any)
- [ ] Consider infrastructure constraints

### Step 2: Select Workflow

**GitFlow Structure:**
```
main (production)
├── develop (integration)
│   ├── feature/feature-a
│   ├── feature/feature-b
│   └── bugfix/issue-123
├── release/v1.2.0
└── hotfix/critical-fix
```

**GitHub Flow Structure:**
```
main (production)
├── feature/feature-a
├── feature/feature-b
└── bugfix/issue-123
```

**Trunk-Based Structure:**
```
main (trunk)
├── short-lived-branch-1 (< 2 days)
└── short-lived-branch-2 (< 2 days)
```

### Step 3: Define Branch Policies

| Branch | Protection Rules | Merge Strategy |
|--------|-----------------|----------------|
| main | Require PR, require reviews, require CI pass | Squash or merge commit |
| develop | Require PR, require CI pass | Merge commit |
| release/* | Require PR, require reviews | Merge commit |
| feature/* | None | Squash merge to develop/main |

### Step 4: Establish Merge Strategies

1. **Squash Merge**: Combine all commits into one (feature branches)
2. **Merge Commit**: Preserve history (release/hotfix to main)
3. **Rebase**: Linear history (personal preference, avoid on shared branches)

### Step 5: Document Workflow

Provide team documentation including:
- [ ] Visual workflow diagram
- [ ] Branch naming conventions
- [ ] Commit message standards
- [ ] PR requirements
- [ ] Release process
- [ ] Hotfix procedures

## Output Format

```markdown
## Recommended Git Workflow: [Workflow Name]

### Overview
[Brief description of why this workflow fits the requirements]

### Branch Structure
[Visual representation of branches]

### Branch Types and Purposes
| Branch Type | Purpose | Lifetime | Merges To |
|-------------|---------|----------|-----------|
| ... | ... | ... | ... |

### Workflow Steps

#### Starting New Work
1. [Step-by-step instructions]

#### Completing Work
1. [Step-by-step instructions]

#### Releasing
1. [Step-by-step instructions]

#### Hotfixes
1. [Step-by-step instructions]

### Branch Protection Rules
[Configuration for repository settings]

### Common Commands
```bash
# Commands for common operations
```
```

## Notes

- Always consider team experience when selecting workflow complexity
- Simpler workflows often lead to better adoption
- Feature flags can reduce branch complexity in any workflow
- Document exceptions and edge cases clearly
- Regular workflow retrospectives help identify improvements
- Consider CI/CD pipeline requirements when designing workflow
- Enforce conventions through branch protection and automation
