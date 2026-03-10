---
name: onboarding-guide
version: 1.0.0
description: Generate new developer onboarding guides with environment setup, codebase overview, and workflow documentation
tags:
  - documentation
  - onboarding
  - developer-experience
  - setup
  - team
---

# Onboarding Guide

## Metadata

| Property | Value |
|----------|-------|
| Name | onboarding-guide |
| Version | 1.0.0 |
| Category | Documentation |
| Complexity | Medium |

## Instructions

Create comprehensive onboarding guides that enable new developers to become productive quickly. The guide should cover environment setup, codebase understanding, team processes, and cultural expectations while being maintainable and accurate.

### Onboarding Guide Components

1. **Welcome & Overview** - Team introduction and project context
2. **Environment Setup** - Development environment configuration
3. **Codebase Guide** - Architecture and navigation
4. **Development Workflow** - Day-to-day processes
5. **Resources & Support** - Where to get help

### Key Principles

- Time to first commit should be < 1 day
- Write for complete beginners to the codebase
- Automate setup where possible
- Keep updated with regular reviews
- Include troubleshooting for common issues

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| project_name | string | Yes | Name of the project/team |
| tech_stack | array | Yes | List of technologies used |
| team_size | number | No | Size of the team |
| prerequisites | array | No | Required prior knowledge |
| repo_url | string | No | Main repository URL |

## Output Process

### Step 1: Gather Information

- [ ] Identify all setup steps required
- [ ] Document team processes
- [ ] List key contacts and resources
- [ ] Collect common FAQs

### Step 2: Create Setup Guide

- [ ] Document prerequisites
- [ ] Write step-by-step setup instructions
- [ ] Include verification steps
- [ ] Add troubleshooting section

### Step 3: Document Codebase

- [ ] Create architecture overview
- [ ] Map important directories
- [ ] Explain key patterns and conventions
- [ ] Link to detailed documentation

### Step 4: Explain Workflows

- [ ] Document development workflow
- [ ] Explain review process
- [ ] Cover deployment procedures
- [ ] Include communication expectations

## Output Format

```markdown
# Welcome to [Team/Project Name]!

Welcome to the team! This guide will help you get up and running quickly. By the end of Day 1, you should have your environment set up and make your first commit.

## Table of Contents

1. [First Day Checklist](#first-day-checklist)
2. [Team Overview](#team-overview)
3. [Environment Setup](#environment-setup)
4. [Codebase Guide](#codebase-guide)
5. [Development Workflow](#development-workflow)
6. [Communication](#communication)
7. [Learning Resources](#learning-resources)
8. [FAQ](#faq)

---

## First Day Checklist

Complete these in order on your first day:

### Access & Accounts
- [ ] Slack workspace access (request from manager)
- [ ] GitHub organization membership
- [ ] Jira/Linear access
- [ ] AWS Console access (if applicable)
- [ ] 1Password/Secrets access

### Environment Setup
- [ ] Clone repositories
- [ ] Install dependencies
- [ ] Run application locally
- [ ] Run tests successfully

### First Contribution
- [ ] Find a "good first issue"
- [ ] Make your first PR
- [ ] Deploy to staging (with mentor)

---

## Team Overview

### Who We Are
[Brief description of the team's mission and what you're building]

### Team Members

| Name | Role | Timezone | Expertise | Fun Fact |
|------|------|----------|-----------|----------|
| Alice | Tech Lead | PST | Architecture, Go | Builds keyboards |
| Bob | Senior Eng | EST | Frontend, React | Coffee enthusiast |
| Carol | Engineer | CST | Backend, Python | Marathon runner |
| Your Name | Engineer | TBD | [Your skills] | [Add yours!] |

### Your Onboarding Buddy
Your onboarding buddy is **[Name]**. They're your go-to person for questions during your first weeks. Don't hesitate to reach out - no question is too small!

### Key Stakeholders

| Role | Name | When to Contact |
|------|------|-----------------|
| Product Manager | [Name] | Product questions, priorities |
| Design | [Name] | UX/UI questions |
| SRE | [Name] | Infrastructure, incidents |

---

## Environment Setup

### Prerequisites

Before starting, ensure you have:

- **macOS** (Ventura 14.0+) or **Ubuntu** (22.04+)
- **Homebrew** (macOS) or **apt** (Linux)
- **Git** (2.40+)
- **Node.js** (20 LTS) via nvm
- **Docker Desktop** (4.25+)

### Automated Setup (Recommended)

We have a setup script that handles most of the configuration:

```bash
# Clone the setup repository
git clone git@github.com:company/dev-setup.git
cd dev-setup

# Run the setup script
./setup.sh

# This will:
# - Install required tools via Homebrew
# - Configure Git with our hooks
# - Set up SSH keys
# - Clone all team repositories
# - Install dependencies
# - Create local database
```

The script takes about 15-20 minutes. Grab a coffee!

### Manual Setup

If you prefer manual setup or the script fails:

#### 1. Install Core Tools

```bash
# Install Homebrew (macOS)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install required packages
brew install git node@20 docker docker-compose postgresql@15 redis

# Start services
brew services start postgresql@15
brew services start redis
```

#### 2. Configure Git

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"

# Configure default branch
git config --global init.defaultBranch main

# Set up GPG signing (recommended)
# See: docs/gpg-setup.md
```

#### 3. Clone Repositories

```bash
# Create workspace directory
mkdir -p ~/code/company
cd ~/code/company

# Clone main repositories
git clone git@github.com:company/main-app.git
git clone git@github.com:company/api-service.git
git clone git@github.com:company/shared-libs.git
```

#### 4. Set Up the Main Application

```bash
cd ~/code/company/main-app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Get secrets from 1Password (ask your buddy for vault access)
# Update .env.local with the values from "Dev Environment" note

# Set up the database
npm run db:setup

# Start the application
npm run dev
```

#### 5. Verify Setup

```bash
# Run tests
npm test

# Run linting
npm run lint

# Access the app
open http://localhost:3000
```

You should see the login page. Use these test credentials:
- Email: `test@example.com`
- Password: `testpassword123`

### Common Setup Issues

<details>
<summary>Node version mismatch</summary>

```bash
# Install nvm and use correct version
nvm install 20
nvm use 20
nvm alias default 20
```
</details>

<details>
<summary>Port already in use</summary>

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```
</details>

<details>
<summary>Database connection failed</summary>

```bash
# Ensure PostgreSQL is running
brew services restart postgresql@15

# Check connection
psql -U postgres -c "SELECT 1"
```
</details>

---

## Codebase Guide

### Repository Overview

| Repository | Description | Tech Stack |
|------------|-------------|------------|
| `main-app` | Frontend web application | React, TypeScript |
| `api-service` | Backend REST API | Node.js, Express |
| `shared-libs` | Shared packages | TypeScript |
| `infrastructure` | IaC and deployment | Terraform, K8s |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Users                                 │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CDN (CloudFront)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼                               ▼
┌───────────────────┐           ┌───────────────────┐
│    Frontend       │           │    API Gateway    │
│    (React SPA)    │──────────▶│    (Kong)         │
└───────────────────┘           └─────────┬─────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    ▼                     ▼                     ▼
          ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
          │  User Service   │   │  Order Service  │   │ Payment Service │
          └────────┬────────┘   └────────┬────────┘   └────────┬────────┘
                   │                     │                     │
                   ▼                     ▼                     ▼
          ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
          │   PostgreSQL    │   │   PostgreSQL    │   │   PostgreSQL    │
          └─────────────────┘   └─────────────────┘   └─────────────────┘
```

### Directory Structure (main-app)

```
main-app/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Buttons, inputs, cards
│   │   └── features/    # Feature-specific components
│   ├── pages/           # Route components (Next.js pages)
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API client and external services
│   ├── stores/          # State management (Zustand)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
├── tests/
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── e2e/             # End-to-end tests (Playwright)
├── public/              # Static assets
└── docs/                # Documentation
```

### Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Application root component |
| `src/services/api.ts` | API client configuration |
| `src/stores/auth.ts` | Authentication state |
| `.env.example` | Environment variables template |
| `jest.config.js` | Test configuration |

### Code Patterns

We follow these patterns consistently:

**Component Pattern**
```typescript
// src/components/features/UserCard/UserCard.tsx
import { FC } from 'react';
import styles from './UserCard.module.css';

interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
}

export const UserCard: FC<UserCardProps> = ({ user, onSelect }) => {
  return (
    <div className={styles.card} onClick={() => onSelect?.(user)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
};
```

**Hook Pattern**
```typescript
// src/hooks/useUser.ts
export const useUser = (userId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getById(userId),
  });

  return { user: data, isLoading, error };
};
```

---

## Development Workflow

### Daily Workflow

```
1. Pull latest changes
   └── git pull origin main

2. Create feature branch
   └── git checkout -b feature/JIRA-123-description

3. Make changes & commit
   └── git commit -m "feat(scope): description"

4. Push and create PR
   └── git push -u origin feature/JIRA-123-description
   └── Open PR via GitHub

5. Address review feedback
   └── Make changes, push updates

6. Merge when approved
   └── Squash and merge via GitHub
```

### Branch Naming

```
feature/JIRA-123-add-user-search
bugfix/JIRA-456-fix-login-redirect
hotfix/JIRA-789-security-patch
chore/update-dependencies
docs/add-api-documentation
```

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add SSO login support
fix(orders): resolve race condition in checkout
docs(readme): update installation instructions
refactor(api): simplify error handling
test(users): add integration tests for user service
chore(deps): update React to v18.2
```

### Code Review Process

1. **Self-review** your PR before requesting reviews
2. **Add context** in the PR description (what, why, how)
3. **Request reviewers** (minimum 1 approval required)
4. **Address feedback** promptly and thoughtfully
5. **Squash and merge** when approved

**What we look for in reviews:**
- Correctness and edge cases
- Test coverage
- Performance implications
- Security considerations
- Code readability

### Deployment

| Environment | Branch | Auto-deploy | URL |
|-------------|--------|-------------|-----|
| Development | `main` | Yes | dev.company.com |
| Staging | `main` (manual) | No | staging.company.com |
| Production | `main` (manual) | No | app.company.com |

To deploy to staging:
```bash
# Via GitHub Actions
# Go to Actions > Deploy > Run workflow > Select "staging"
```

---

## Communication

### Channels

| Channel | Purpose |
|---------|---------|
| `#team-name` | Team discussions, questions |
| `#team-name-alerts` | Automated alerts, deploys |
| `#engineering` | Cross-team engineering discussions |
| `#incidents` | Active incident coordination |
| `#watercooler` | Social, off-topic |

### Meetings

| Meeting | Frequency | Duration | Purpose |
|---------|-----------|----------|---------|
| Daily Standup | Daily | 15 min | Sync and blockers |
| Sprint Planning | Bi-weekly | 1 hour | Plan upcoming work |
| Retro | Bi-weekly | 1 hour | Continuous improvement |
| 1:1 with Manager | Weekly | 30 min | Career, feedback |

### Asking Questions

1. **Search first** - Check Slack history, docs, code
2. **Provide context** - What you tried, what happened
3. **Ask in public channels** - Others may have the same question
4. **Be specific** - Include error messages, screenshots

---

## Learning Resources

### Internal Documentation
- [Architecture Decision Records](./docs/adrs/)
- [API Documentation](https://api-docs.company.com)
- [Runbooks](./docs/runbooks/)
- [Design System](https://design.company.com)

### Recommended Learning
- [ ] Watch: "System Architecture Overview" (30 min) - [Link]
- [ ] Read: "Our Engineering Principles" - [Link]
- [ ] Complete: "Security Training" - [Link]
- [ ] Explore: "Feature Flags Dashboard" - [Link]

### Books & Courses
- *Clean Code* by Robert Martin
- *Designing Data-Intensive Applications* by Martin Kleppmann
- [Company Engineering Blog](https://eng.company.com)

---

## FAQ

<details>
<summary>How do I get access to [service]?</summary>

Most access requests go through your manager. For urgent access:
- **AWS**: #platform-support
- **GitHub**: #engineering
- **Jira**: IT Service Desk
</details>

<details>
<summary>What should I work on first?</summary>

Check with your manager or onboarding buddy. We usually recommend:
1. A "good first issue" to get familiar with the process
2. Bug fixes to learn the codebase
3. Small features after the first week
</details>

<details>
<summary>How do I run only specific tests?</summary>

```bash
# Run single test file
npm test -- src/components/Button/Button.test.tsx

# Run tests matching pattern
npm test -- --grep "should render"

# Run with coverage
npm test -- --coverage
```
</details>

<details>
<summary>Who do I contact for [topic]?</summary>

- **Technical questions**: Your buddy or #team-name
- **HR/Benefits**: your-hr-contact@company.com
- **IT issues**: IT Service Desk
- **Career/Growth**: Your manager
</details>

---

## Feedback

This guide is a living document. If something is unclear, outdated, or missing:

1. Open a PR with your improvements
2. Or let us know in #team-name

Welcome aboard! We're excited to have you! 🎉
```

## Notes

- Test the onboarding guide with new hires and update based on feedback
- Automate as much of the setup as possible
- Include estimated time for each section
- Keep the guide version controlled and reviewed regularly
- Add screenshots for complex UI steps
- Create a "Day 1, Week 1, Month 1" milestone structure
- Include cultural elements alongside technical content
- Make it easy to provide feedback on the guide itself
- Consider creating a checklist version for tracking progress
- Update immediately when processes change
