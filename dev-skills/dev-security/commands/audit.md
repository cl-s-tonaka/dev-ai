---
description: Perform comprehensive dependency and code vulnerability audits to identify security risks in project dependencies and codebase
argument-hint: "<project path, repository, or specific area to audit>"
---

# /audit -- Dependency and Code Vulnerability Audit

Execute a comprehensive security audit covering dependency vulnerabilities (CVEs), outdated packages, license compliance, and code-level security issues.

## Invocation

```
/audit Check all npm dependencies for known CVEs
/audit Scan this Python project for vulnerabilities
/audit Review dependency security for the backend services
/audit Full security audit of the monorepo
```

## Workflow

### Step 1: Identify Audit Scope

Accept audit targets in various forms:
- Project path or repository
- Specific package ecosystem (npm, pip, maven, etc.)
- Component or service name
- Manifest files (package.json, requirements.txt, etc.)

Determine:
- Package ecosystems in use
- Direct vs. transitive dependency analysis
- Development vs. production dependencies
- License compliance requirements

### Step 2: Gather Context

Ask relevant questions to scope the audit:

1. **Ecosystem**: What package managers are in use?
2. **Environment**: Development, staging, or production analysis?
3. **Severity threshold**: What's the minimum severity to report?
4. **License restrictions**: Any prohibited licenses?
5. **Compliance**: SOC2, PCI-DSS, HIPAA requirements?
6. **Previous audits**: Any known accepted risks?

For provided project paths, auto-detect ecosystems and ask about gaps.

### Step 3: Dependency Discovery

Identify and analyze dependency manifests:

| Ecosystem | Files to Analyze |
|-----------|-----------------|
| Node.js/npm | package.json, package-lock.json, yarn.lock |
| Python | requirements.txt, Pipfile.lock, pyproject.toml |
| Java/Maven | pom.xml |
| Java/Gradle | build.gradle, gradle.lockfile |
| .NET | *.csproj, packages.config |
| Go | go.mod, go.sum |
| Ruby | Gemfile.lock |
| Rust | Cargo.lock |
| PHP | composer.lock |

Generate dependency tree analysis:
```
project
├── direct dependencies: X
├── transitive dependencies: Y
└── total packages: Z
```

### Step 4: Vulnerability Scanning

Apply the **dependency-audit** skill to:

1. **Query vulnerability databases**:
   - National Vulnerability Database (NVD)
   - GitHub Advisory Database
   - OSV (Open Source Vulnerabilities)
   - Ecosystem-specific advisories

2. **Classify findings by severity**:
   | Severity | CVSS | Response Time |
   |----------|------|---------------|
   | Critical | 9.0-10.0 | Immediate |
   | High | 7.0-8.9 | 1 week |
   | Medium | 4.0-6.9 | Next sprint |
   | Low | 0.1-3.9 | Backlog |

3. **Identify vulnerability paths**:
   ```
   project → package-a → package-b (CVE-2024-XXXXX)
   ```

### Step 5: License Analysis

Check license compatibility:

| License | Commercial OK | Copyleft | Review |
|---------|--------------|----------|--------|
| MIT | Yes | No | Safe |
| Apache-2.0 | Yes | No | Safe |
| BSD-3 | Yes | No | Safe |
| GPL-3.0 | Restricted | Yes | Required |
| LGPL-3.0 | Yes | Partial | Review |
| AGPL-3.0 | Restricted | Network | Required |
| Unknown | Review | Unknown | Required |

Flag:
- [ ] License conflicts with project license
- [ ] Copyleft in proprietary codebase
- [ ] Unknown or missing licenses
- [ ] Multi-licensed packages needing decision

### Step 6: Supply Chain Assessment

Evaluate dependency health:
- [ ] Maintenance status (last update, active maintainers)
- [ ] Security practices (security policy, responsible disclosure)
- [ ] Community health (stars, contributors, issues)
- [ ] Typosquatting risks (similar names to popular packages)
- [ ] Dependency depth (deep chains = more risk)

### Step 7: Code Security Scan

If code is in scope, apply **secure-coding** and **security-review** skills:
- [ ] Hardcoded secrets or credentials
- [ ] Insecure coding patterns
- [ ] Security misconfigurations
- [ ] Sensitive data exposure

### Step 8: Generate Audit Report

```markdown
## Security Audit Report

**Project**: [Project Name]
**Date**: [Audit Date]
**Scope**: [Dependencies / Code / Full]

### Executive Summary

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Vulnerabilities | X | X | X | X |
| Outdated | - | X | X | X |
| License Issues | - | X | X | - |
| Code Issues | X | X | X | X |

**Overall Risk**: [Critical/High/Medium/Low]
**Recommended Actions**: [X] findings require immediate attention

### Dependency Overview

| Ecosystem | Direct | Transitive | Total |
|-----------|--------|------------|-------|
| npm | X | Y | Z |
| pip | X | Y | Z |

### Critical & High Vulnerabilities

#### CVE-2024-XXXXX: [Vulnerability Name]

**Package**: [package@version]
**Severity**: Critical (CVSS: 9.8)
**Fixed In**: [version]

**Description**:
[What the vulnerability allows]

**Affected Path**:
```
project → dep-a → vulnerable-pkg
```

**Remediation**:
```bash
npm update package-name
# or
npm install package-name@fixed-version
```

**Workaround** (if no fix available):
[Temporary mitigation steps]

---

### Outdated Dependencies

| Package | Current | Latest | Age | CVEs | Priority |
|---------|---------|--------|-----|------|----------|
| lodash | 4.17.15 | 4.17.21 | 2y | 3 | High |
| axios | 0.21.1 | 1.6.0 | 3y | 5 | Critical |

### License Summary

| License | Count | Status |
|---------|-------|--------|
| MIT | 145 | OK |
| Apache-2.0 | 32 | OK |
| GPL-3.0 | 2 | Review Required |
| Unknown | 5 | Investigation Required |

#### License Issues

| Package | License | Issue |
|---------|---------|-------|
| gpl-lib | GPL-3.0 | Copyleft incompatibility |

### Code Security Findings

| ID | Severity | Finding | Location |
|----|----------|---------|----------|
| C01 | High | Hardcoded API key | config.js:15 |
| C02 | Medium | SQL without parameters | db.js:42 |

### Recommendations

#### Immediate (24-48 hours)
1. Update `vulnerable-package` to fix CVE-2024-XXXXX
2. Remove hardcoded credentials from config.js

#### Short-term (This Sprint)
1. Update all packages with high-severity CVEs
2. Implement automated dependency scanning in CI

#### Long-term (Roadmap)
1. Establish dependency update policy
2. Create approved package list
3. Implement SBOM generation

### Next Steps

- [ ] Address critical findings
- [ ] Schedule follow-up audit in 30 days
- [ ] Implement continuous scanning
```

### Step 9: Offer Follow-up Actions

After generating the audit report, offer:
- "Should I generate **remediation scripts** for the critical issues?"
- "Want me to create a **dependency update plan**?"
- "Need a **security review** of the affected code paths?"
- "Should I help set up **automated scanning** in CI/CD?"
- "Want me to create an **SBOM** (Software Bill of Materials)?"

## Notes

- Use lockfiles for accurate version detection
- Consider both direct and transitive dependencies
- Differentiate production vs. development dependencies
- Document accepted risks with justification and expiration
- Automate audits in CI/CD pipelines
- Track vulnerability metrics over time
- Consider multiple data sources for comprehensive coverage
- SBOM generation helps with compliance and incident response
- Regular audits catch issues before they become incidents
- Include audit results in security dashboards
