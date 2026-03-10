---
name: dockerfile-review
version: 1.0.0
description: Review and optimize Dockerfiles for image size, build performance, security, and best practices
tags:
  - docker
  - containers
  - optimization
  - security
  - devops
---

# Dockerfile Optimization Review

## Metadata

| Property | Value |
|----------|-------|
| Name | dockerfile-review |
| Version | 1.0.0 |
| Category | DevOps |
| Complexity | Medium |

## Instructions

Review and optimize Dockerfiles to produce smaller, more secure, and faster-building container images. Apply industry best practices for multi-stage builds, layer caching, security hardening, and runtime efficiency.

### Optimization Checklist

| Category | Check | Impact |
|----------|-------|--------|
| Base Image | Use minimal base (alpine, distroless, slim) | High |
| Multi-stage | Separate build and runtime stages | High |
| Layer Caching | Order instructions by change frequency | High |
| Dependencies | Install only production dependencies | Medium |
| Security | Run as non-root user | High |
| Security | No secrets in image | Critical |
| Cleanup | Remove package manager cache | Medium |
| .dockerignore | Exclude unnecessary files | Medium |

### Base Image Selection Guide

| Use Case | Recommended Base | Size |
|----------|------------------|------|
| Production (Go, Rust) | `gcr.io/distroless/static` | ~2MB |
| Production (Node.js) | `node:20-alpine` | ~130MB |
| Production (Python) | `python:3.12-slim` | ~150MB |
| Production (Java) | `eclipse-temurin:21-jre-alpine` | ~180MB |
| Build stage | Full image (debian, ubuntu) | ~200-800MB |
| Security-focused | `chainguard/static` | ~2MB |

### Layer Optimization Strategy

```dockerfile
# BAD: Invalidates cache on any code change
COPY . .
RUN npm install

# GOOD: Dependencies cached separately from code
COPY package*.json ./
RUN npm ci --only=production
COPY . .
```

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| dockerfile | string | Yes | The Dockerfile content to review |
| language | string | Yes | Primary language (node, python, go, java, etc.) |
| use_case | string | No | Production, development, or CI |
| size_target | string | No | Target image size (minimal, balanced, full) |
| security_level | string | No | Security requirements (standard, strict, compliance) |

## Output Process

### Step 1: Analyze Current Dockerfile

Review the Dockerfile for:
- [ ] Base image selection
- [ ] Layer ordering and caching efficiency
- [ ] Multi-stage build usage
- [ ] Security vulnerabilities
- [ ] Build-time vs runtime dependencies
- [ ] Unnecessary files or packages

### Step 2: Identify Optimization Opportunities

**Image Size Optimization:**
```dockerfile
# Before: 1.2GB
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]

# After: 180MB (85% reduction)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
USER nodejs
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Step 3: Apply Security Hardening

**Security Best Practices:**
```dockerfile
# 1. Run as non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup
USER appuser

# 2. Use specific image digests for reproducibility
FROM node:20-alpine@sha256:abc123...

# 3. Don't store secrets - use runtime injection
# BAD: ENV API_KEY=secret123
# GOOD: Use Docker secrets or environment variables at runtime

# 4. Minimize installed packages
RUN apk add --no-cache --virtual .build-deps \
    build-base python3 && \
    npm ci && \
    apk del .build-deps

# 5. Use read-only filesystem
# docker run --read-only --tmpfs /tmp myimage

# 6. Scan for vulnerabilities
# docker scan myimage:latest
```

### Step 4: Optimize Build Performance

**Caching Strategies:**
```dockerfile
# Use BuildKit cache mounts
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production

# Parallel downloads with BuildKit
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && apt-get install -y --no-install-recommends \
    package1 package2 package3
```

### Step 5: Generate Optimized Dockerfile

## Output Format

```markdown
## Dockerfile Review Report

### Summary
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Image Size | 1.2GB | 180MB | -85% |
| Layers | 12 | 6 | -50% |
| Build Time | 120s | 45s | -62% |
| Security Issues | 3 | 0 | Fixed |

### Issues Found

#### Critical
- [ ] **Secrets in image**: API key found in ENV instruction
  - Line 15: `ENV API_KEY=sk-xxxxx`
  - Fix: Use runtime environment variables or Docker secrets

#### High
- [ ] **Running as root**: No USER instruction found
  - Fix: Add non-root user and switch to it

#### Medium
- [ ] **Large base image**: Using `node:20` (900MB)
  - Fix: Switch to `node:20-alpine` (130MB)

#### Low
- [ ] **Inefficient layer caching**: COPY . before npm install
  - Fix: Copy package*.json first, then install, then copy source

### Optimized Dockerfile

```dockerfile
# [Optimized Dockerfile here]
```

### Build Commands

```bash
# Build with BuildKit
DOCKER_BUILDKIT=1 docker build -t myapp:latest .

# Build with cache
docker build --cache-from myapp:latest -t myapp:latest .

# Scan for vulnerabilities
docker scout cves myapp:latest
```

### Recommended .dockerignore

```
node_modules
.git
.gitignore
*.md
.env*
Dockerfile*
docker-compose*
.dockerignore
coverage
.nyc_output
tests
```
```

## Notes

- Always use `.dockerignore` to reduce build context size
- Use BuildKit (`DOCKER_BUILDKIT=1`) for better caching and security features
- Pin base image versions with digests for reproducible builds
- Combine RUN commands to reduce layers: `RUN cmd1 && cmd2 && cmd3`
- Remove package manager caches in the same layer as install
- Use `--no-install-recommends` for apt to minimize package bloat
- Consider using Dive (`dive image:tag`) to analyze image layers
- Regularly update base images for security patches
- Use multi-stage builds even for interpreted languages to exclude dev dependencies
