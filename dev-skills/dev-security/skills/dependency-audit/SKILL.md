---
name: dependency-audit
version: 1.0.0
description: Audit project dependencies for known vulnerabilities, outdated packages, and licensing issues
tags:
  - security
  - dependencies
  - vulnerabilities
  - cve
  - supply-chain
---

# Dependency Vulnerability Audit

## Metadata

| Property | Value |
|----------|-------|
| Name | dependency-audit |
| Version | 1.0.0 |
| Category | Security |
| Complexity | Medium |

## Instructions

Perform comprehensive audits of project dependencies to identify known vulnerabilities (CVEs), outdated packages, licensing conflicts, and supply chain risks. This skill covers multiple ecosystems including npm, pip, Maven, NuGet, Go modules, and more.

### Audit Scope

1. **Vulnerability Assessment**
   - Known CVEs in dependencies
   - Security advisories from maintainers
   - Transitive (indirect) dependency risks

2. **Version Analysis**
   - Outdated packages
   - End-of-life dependencies
   - Missing security patches

3. **License Compliance**
   - License compatibility
   - Copyleft implications
   - Commercial use restrictions

4. **Supply Chain Risk**
   - Dependency health indicators
   - Maintainer activity
   - Typosquatting risks

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| project_path | string | Yes | Path to project root or manifest file |
| ecosystem | string | No | Package ecosystem (npm, pip, maven, etc.) |
| include_dev | boolean | No | Include dev dependencies (default: true) |
| severity_threshold | string | No | Minimum severity (critical, high, medium, low) |
| check_licenses | boolean | No | Include license analysis (default: true) |

## Output Process

### Step 1: Dependency Discovery

Identify and parse dependency manifests:

| Ecosystem | Manifest Files |
|-----------|---------------|
| npm/Node.js | package.json, package-lock.json, yarn.lock |
| Python | requirements.txt, Pipfile, pyproject.toml, poetry.lock |
| Java/Maven | pom.xml |
| Java/Gradle | build.gradle, build.gradle.kts |
| .NET | *.csproj, packages.config, Directory.Packages.props |
| Go | go.mod, go.sum |
| Ruby | Gemfile, Gemfile.lock |
| Rust | Cargo.toml, Cargo.lock |
| PHP | composer.json, composer.lock |

### Step 2: Vulnerability Scanning

- [ ] Query vulnerability databases (NVD, GitHub Advisory, OSV)
- [ ] Check ecosystem-specific advisories
- [ ] Identify affected version ranges
- [ ] Map vulnerabilities to project dependencies
- [ ] Include transitive dependencies in analysis

### Step 3: Severity Classification

| Severity | CVSS Range | Response Time |
|----------|------------|---------------|
| Critical | 9.0-10.0 | Immediate (24-48 hours) |
| High | 7.0-8.9 | Urgent (1 week) |
| Medium | 4.0-6.9 | Planned (next sprint) |
| Low | 0.1-3.9 | Backlog |

### Step 4: License Analysis

| License Type | Commercial Use | Copyleft | Attribution |
|--------------|----------------|----------|-------------|
| MIT | Yes | No | Yes |
| Apache-2.0 | Yes | No | Yes |
| BSD-3-Clause | Yes | No | Yes |
| GPL-3.0 | Restricted | Yes | Yes |
| LGPL-3.0 | Yes | Partial | Yes |
| AGPL-3.0 | Restricted | Yes (network) | Yes |
| MPL-2.0 | Yes | File-level | Yes |
| Proprietary | Varies | N/A | Varies |

### Step 5: Supply Chain Assessment

Evaluate dependency health:
- [ ] Last update date
- [ ] Maintainer count
- [ ] Download statistics
- [ ] Open issues/PRs ratio
- [ ] Known security practices

### Step 6: Generate Report

## Output Format

```markdown
## Dependency Audit Report

**Project**: [project name]
**Date**: [audit date]
**Ecosystem**: [npm/pip/maven/etc.]
**Total Dependencies**: [X direct, Y transitive]

### Executive Summary

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Vulnerabilities | X | X | X | X |
| Outdated | - | X | X | X |
| License Issues | - | X | X | X |

**Overall Risk Level**: [Critical/High/Medium/Low]

### Vulnerability Findings

#### CVE-2024-XXXXX: [Vulnerability Name]

**Package**: lodash
**Installed Version**: 4.17.15
**Fixed Version**: 4.17.21
**Severity**: Critical (CVSS: 9.8)

**Description**:
[Description of the vulnerability]

**Attack Vector**:
[How the vulnerability can be exploited]

**Remediation**:
```bash
npm update lodash
# or
npm install lodash@4.17.21
```

**Affected Code Paths**:
- src/utils/data-processing.js
- src/api/transformers.js

---

### Outdated Dependencies

| Package | Current | Latest | Age | Risk |
|---------|---------|--------|-----|------|
| express | 4.17.1 | 4.18.2 | 18 months | Medium |
| axios | 0.21.1 | 1.6.0 | 24 months | High |

### License Summary

| License | Count | Packages | Compliance |
|---------|-------|----------|------------|
| MIT | 145 | lodash, express, ... | Compliant |
| Apache-2.0 | 32 | aws-sdk, ... | Compliant |
| GPL-3.0 | 2 | problematic-pkg | Review Required |

#### License Conflicts

| Package | License | Issue | Recommendation |
|---------|---------|-------|----------------|
| gpl-package | GPL-3.0 | Copyleft in proprietary app | Replace or isolate |

### Supply Chain Risks

| Package | Risk | Indicator | Action |
|---------|------|-----------|--------|
| abandoned-lib | High | No updates in 3 years | Find alternative |
| single-maintainer | Medium | Bus factor = 1 | Monitor |
| typo-squatting | High | Similar name to popular pkg | Verify authenticity |

### Recommendations

#### Immediate Actions (Critical)
1. Update `lodash` to 4.17.21 to fix prototype pollution
2. Replace `vulnerable-xml-parser` with `secure-xml2js`

#### Short-term (High Priority)
1. Update all packages with known high-severity CVEs
2. Review GPL-licensed dependencies for compliance

#### Long-term (Maintenance)
1. Implement automated dependency scanning in CI/CD
2. Create policy for dependency updates
3. Establish approved package list

### Dependency Tree (Vulnerable Paths)

```
project
├── express@4.17.1
│   └── qs@6.7.0 (CVE-2022-24999)
└── webpack@4.44.0
    └── serialize-javascript@4.0.0 (CVE-2020-7660)
```

### Scan Commands Used

```bash
# npm
npm audit --json

# pip
pip-audit --format=json

# maven
mvn dependency-check:check
```
```

## Notes

- Use lockfiles for accurate version detection
- Consider both direct and transitive dependencies
- Automate audits in CI/CD pipelines
- Create exemption process for false positives or accepted risks
- Monitor for new vulnerabilities in existing dependencies
- Consider SBOMs (Software Bill of Materials) for compliance
- Use multiple data sources for comprehensive coverage
- Document remediation decisions and timelines
- Track vulnerability metrics over time
- Consider private registry security
