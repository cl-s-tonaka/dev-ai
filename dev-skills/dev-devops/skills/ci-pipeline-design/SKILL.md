---
name: ci-pipeline-design
version: 1.0.0
description: Design CI/CD pipelines for various platforms including GitHub Actions, GitLab CI, Jenkins, CircleCI, and Azure DevOps
tags:
  - ci-cd
  - automation
  - pipeline
  - devops
  - continuous-integration
---

# CI/CD Pipeline Design

## Metadata

| Property | Value |
|----------|-------|
| Name | ci-pipeline-design |
| Version | 1.0.0 |
| Category | DevOps |
| Complexity | Medium-High |

## Instructions

Design comprehensive CI/CD pipelines tailored to project requirements, platform constraints, and team workflows. Create efficient, secure, and maintainable pipeline configurations that enable rapid, reliable software delivery.

### Platform Selection Guide

| Platform | Best For | Key Features |
|----------|----------|--------------|
| GitHub Actions | GitHub-hosted projects, open source | Native GitHub integration, marketplace actions, matrix builds |
| GitLab CI | Self-hosted, enterprise, monorepos | Built-in container registry, Auto DevOps, DAG pipelines |
| Jenkins | Complex enterprise workflows | Extensive plugins, declarative & scripted pipelines |
| CircleCI | Fast builds, Docker-first | Orbs ecosystem, resource classes, test splitting |
| Azure DevOps | Microsoft ecosystem | YAML + classic, release gates, deployment groups |

### Pipeline Best Practices

1. **Fast Feedback**: Run quick checks (lint, unit tests) first
2. **Fail Fast**: Stop pipeline on first failure
3. **Parallelization**: Run independent jobs concurrently
4. **Caching**: Cache dependencies, build artifacts, Docker layers
5. **Security Scanning**: Include SAST, DAST, dependency scanning
6. **Environment Parity**: Use consistent images across stages
7. **Secrets Management**: Never hardcode secrets; use vault/secrets manager

### Pipeline Stages Template

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Build     │───▶│    Test     │───▶│   Analyze   │───▶│   Deploy    │───▶│   Verify    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     │                   │                  │                  │                  │
  Compile            Unit Tests         SAST/DAST          Staging           Smoke Tests
  Lint               Integration        Coverage           Production        E2E Tests
  Dependencies       Contract           License            Canary            Health Checks
```

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| platform | string | Yes | CI/CD platform (github-actions, gitlab-ci, jenkins, circleci, azure-devops) |
| language | string | Yes | Primary programming language/framework |
| deployment_targets | array | Yes | Deployment environments (staging, production, etc.) |
| testing_requirements | object | No | Types of tests to run (unit, integration, e2e) |
| security_requirements | array | No | Security scanning requirements |
| artifact_type | string | No | Build artifact type (docker, npm, jar, binary) |
| monorepo | boolean | No | Whether the project is a monorepo |

## Output Process

### Step 1: Analyze Project Requirements

- [ ] Identify language/framework build requirements
- [ ] Determine test types and coverage requirements
- [ ] Map deployment targets and environments
- [ ] Identify security and compliance needs
- [ ] Assess caching opportunities

### Step 2: Design Pipeline Stages

**Build Stage:**
```yaml
# Example: GitHub Actions Build Stage
build:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - uses: actions/upload-artifact@v4
      with:
        name: build
        path: dist/
```

**Test Stage:**
```yaml
test:
  needs: build
  strategy:
    matrix:
      test-type: [unit, integration]
  steps:
    - run: npm run test:${{ matrix.test-type }}
```

**Security Stage:**
```yaml
security:
  needs: build
  steps:
    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
    - name: Run SAST
      uses: github/codeql-action/analyze@v2
```

**Deploy Stage:**
```yaml
deploy-staging:
  needs: [test, security]
  environment: staging
  steps:
    - name: Deploy to staging
      run: ./deploy.sh staging
```

### Step 3: Implement Optimization Strategies

**Caching Strategy:**
| Cache Type | Scope | TTL | Example |
|------------|-------|-----|---------|
| Dependencies | Branch | 7 days | node_modules, .m2, pip cache |
| Build cache | Workflow | 1 day | .next/cache, target/ |
| Docker layers | Repository | 30 days | Docker BuildKit cache |

**Parallelization:**
```yaml
jobs:
  lint: ...        # ┐
  unit-tests: ...  # │ Run in parallel
  type-check: ...  # ┘

  integration:
    needs: [lint, unit-tests, type-check]  # Wait for all
```

### Step 4: Add Security Gates

- [ ] Secret scanning on push
- [ ] Dependency vulnerability scanning
- [ ] Container image scanning
- [ ] SAST/DAST analysis
- [ ] License compliance checks
- [ ] Required approvals for production

## Output Format

```yaml
# CI/CD Pipeline: [Project Name]
# Platform: [Platform Name]
# Generated: [Date]

name: [Pipeline Name]

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  # Global environment variables
  NODE_VERSION: '20'

jobs:
  # Build job
  build:
    # ... configuration

  # Test jobs (parallel)
  test-unit:
    needs: build
    # ...

  test-integration:
    needs: build
    # ...

  # Security scanning
  security:
    needs: build
    # ...

  # Deployment stages
  deploy-staging:
    needs: [test-unit, test-integration, security]
    environment: staging
    # ...

  deploy-production:
    needs: deploy-staging
    environment: production
    # ...
```

## Notes

- Always use specific versions for actions/tools, not `latest`
- Implement branch protection rules alongside pipeline
- Use environment secrets, never repository secrets for sensitive values
- Consider using reusable workflows for monorepos
- Set appropriate timeout limits to prevent hanging jobs
- Use concurrency groups to prevent duplicate runs
- Implement manual approval gates for production deployments
- Keep pipeline configuration in version control
- Document pipeline behavior and troubleshooting steps
