---
description: Design CI/CD pipeline workflows for any platform with best practices
argument-hint: "[platform] <requirements>"
---

# /pipeline -- CI/CD Pipeline Design

Design and generate CI/CD pipeline configurations for GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps, and more.

## Invocation

```
/pipeline GitHub Actions for Node.js API with Docker and Kubernetes deployment
/pipeline GitLab CI for Python monorepo with matrix testing
/pipeline Jenkins declarative pipeline for Java microservices
/pipeline                # asks for platform and requirements
```

## Workflow

---

### Step 1: Gather Pipeline Requirements

Ask for (or extract from context):
- **Platform**: Which CI/CD platform? (GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps)
- **Language/Framework**: Primary tech stack (Node.js, Python, Go, Java, etc.)
- **Build Artifacts**: What gets built? (Docker images, npm packages, JAR files, binaries)
- **Environments**: Deployment targets (dev, staging, production)
- **Testing Needs**: Test types to run (unit, integration, e2e, performance)
- **Security Requirements**: Scanning needs (SAST, DAST, dependency, container)
- **Special Needs**: Monorepo, matrix builds, manual approvals, specific runners

### Step 2: Design Pipeline Architecture

Apply the **ci-pipeline-design** skill:

**Design the pipeline stages:**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Build    │───▶│    Test     │───▶│   Security  │───▶│   Deploy    │───▶│   Verify    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

**Determine job dependencies:**
- Which jobs can run in parallel?
- Which jobs require artifacts from previous jobs?
- Where are the blocking gates?

**Plan caching strategy:**
- Dependencies (node_modules, pip cache, Maven repo)
- Build cache (Docker layers, compiled assets)
- Test artifacts (coverage reports, screenshots)

### Step 3: Generate Pipeline Configuration

**For GitHub Actions:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  test:
    needs: build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        test-type: [unit, integration]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:${{ matrix.test-type }}

  security:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'

  build-image:
    needs: [test, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: build-image
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          kubectl set image deployment/myapp \
            myapp=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: |
          kubectl set image deployment/myapp \
            myapp=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
```

### Step 4: Add Optimizations

**Caching:**
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: npm-${{ runner.os }}-
```

**Parallelization:**
```yaml
jobs:
  lint: ...     # ─┐
  test: ...     # ─┼─ Run in parallel
  typecheck: ...# ─┘

  build:
    needs: [lint, test, typecheck]  # Wait for all
```

**Conditional execution:**
```yaml
deploy-production:
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

### Step 5: Document and Deliver

Generate complete pipeline with:

```markdown
## CI/CD Pipeline: [Project Name]

### Pipeline Overview
[Visual diagram of pipeline stages]

### Jobs and Dependencies
| Job | Depends On | Runs On | Duration |
|-----|------------|---------|----------|
| build | - | ubuntu-latest | ~2 min |
| test | build | ubuntu-latest | ~5 min |
| security | build | ubuntu-latest | ~3 min |
| deploy-staging | test, security | ubuntu-latest | ~2 min |
| deploy-production | deploy-staging | ubuntu-latest | ~2 min |

### Environment Variables
| Variable | Description | Where Set |
|----------|-------------|-----------|
| REGISTRY | Container registry URL | Workflow env |
| IMAGE_NAME | Docker image name | Workflow env |

### Secrets Required
| Secret | Description | Used By |
|--------|-------------|---------|
| GITHUB_TOKEN | GitHub API access | docker/login-action |
| KUBECONFIG | Kubernetes config | Deploy jobs |

### Triggers
- Push to `main` or `develop` branches
- Pull requests to `main`

### Manual Steps
- Production deployment requires manual approval
- Configure environment protection rules in GitHub settings

### Troubleshooting
- **Build fails**: Check Node.js version compatibility
- **Tests timeout**: Increase timeout or check for flaky tests
- **Deploy fails**: Verify KUBECONFIG secret is set correctly
```

## Platform-Specific Tips

### GitHub Actions
- Use reusable workflows for DRY
- Leverage job outputs for passing data
- Use matrix builds for multi-version testing
- Enable GitHub-hosted larger runners for heavy builds

### GitLab CI
- Use DAG (needs) for parallel execution
- Leverage Auto DevOps for standard projects
- Use includes for reusable job templates
- Cache Docker layers with registry

### Jenkins
- Use declarative pipelines over scripted
- Leverage shared libraries for reuse
- Use agent labels for specific runners
- Implement proper credential management

## Notes

- Always pin action/image versions (never use `latest`)
- Fail fast: run quick checks (lint) before slow ones (integration tests)
- Use environment protection rules for production
- Cache everything that doesn't change often
- Set appropriate job timeouts to prevent hung builds
- Use concurrency groups to prevent duplicate runs
- Store secrets in the platform's secret manager, not in code
