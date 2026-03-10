---
name: security-review
version: 1.0.0
description: Perform security-focused code reviews using OWASP Top 10 as a framework to identify vulnerabilities and security weaknesses
tags:
  - security
  - code-review
  - owasp
  - vulnerabilities
  - secure-development
---

# Security Code Review

## Metadata

| Property | Value |
|----------|-------|
| Name | security-review |
| Version | 1.0.0 |
| Category | Security |
| Complexity | High |

## Instructions

Conduct comprehensive security code reviews using the OWASP Top 10 as a foundational framework. Identify vulnerabilities, assess risk levels, and provide actionable remediation guidance.

### OWASP Top 10 (2021) Checklist

#### A01:2021 - Broken Access Control
- [ ] Verify authorization checks on all endpoints
- [ ] Check for IDOR (Insecure Direct Object References)
- [ ] Validate role-based access controls
- [ ] Review path traversal protections
- [ ] Check for privilege escalation vectors
- [ ] Verify CORS configuration

#### A02:2021 - Cryptographic Failures
- [ ] Check for sensitive data exposure in transit
- [ ] Verify TLS configuration and certificate validation
- [ ] Review encryption algorithms (avoid MD5, SHA1, DES)
- [ ] Check for hardcoded encryption keys
- [ ] Validate secure random number generation
- [ ] Review password hashing (use bcrypt, scrypt, Argon2)

#### A03:2021 - Injection
- [ ] SQL Injection: Parameterized queries used
- [ ] NoSQL Injection: Input sanitization applied
- [ ] Command Injection: Shell commands escaped
- [ ] LDAP Injection: Inputs properly encoded
- [ ] XPath Injection: Parameterized XPath used
- [ ] Template Injection: User input not in templates

#### A04:2021 - Insecure Design
- [ ] Security requirements documented
- [ ] Threat modeling performed
- [ ] Secure design patterns applied
- [ ] Defense in depth implemented
- [ ] Business logic flaws addressed

#### A05:2021 - Security Misconfiguration
- [ ] Default credentials changed
- [ ] Unnecessary features disabled
- [ ] Error handling doesn't expose details
- [ ] Security headers configured
- [ ] Directory listing disabled
- [ ] Debug mode disabled in production

#### A06:2021 - Vulnerable Components
- [ ] Dependencies up to date
- [ ] Known CVEs addressed
- [ ] Unused dependencies removed
- [ ] Component versions tracked
- [ ] Security advisories monitored

#### A07:2021 - Identification and Authentication Failures
- [ ] Strong password policy enforced
- [ ] Multi-factor authentication available
- [ ] Session management secure
- [ ] Account lockout implemented
- [ ] Credential recovery secure
- [ ] Session tokens properly invalidated

#### A08:2021 - Software and Data Integrity Failures
- [ ] Code integrity verified (signed commits, releases)
- [ ] CI/CD pipeline secured
- [ ] Dependency integrity checked (checksums, lockfiles)
- [ ] Deserialization inputs validated
- [ ] Update mechanisms secure

#### A09:2021 - Security Logging and Monitoring Failures
- [ ] Security events logged
- [ ] Log injection prevented
- [ ] Sensitive data not logged
- [ ] Logs protected from tampering
- [ ] Alerting configured for attacks
- [ ] Audit trail maintained

#### A10:2021 - Server-Side Request Forgery (SSRF)
- [ ] URL inputs validated and sanitized
- [ ] Allowlist for external services
- [ ] Internal network access restricted
- [ ] Response handling doesn't leak data

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| code | string/file | Yes | Code to review (file, directory, or code snippet) |
| language | string | No | Programming language of the code |
| focus_areas | array | No | Specific OWASP categories to focus on |
| context | string | No | Application context (web, API, mobile backend) |
| severity_threshold | string | No | Minimum severity to report (critical, high, medium, low) |

## Output Process

### Step 1: Code Analysis

- [ ] Identify the programming language and framework
- [ ] Map code components to OWASP categories
- [ ] Identify entry points (APIs, user inputs, file uploads)
- [ ] Trace data flow through the application
- [ ] Identify trust boundaries

### Step 2: Vulnerability Assessment

For each OWASP category:
1. Review relevant code patterns
2. Identify potential vulnerabilities
3. Verify exploitability
4. Assess business impact
5. Determine risk rating

### Step 3: Risk Classification

| Severity | CVSS Range | Description |
|----------|------------|-------------|
| Critical | 9.0-10.0 | Immediate exploitation risk, data breach likely |
| High | 7.0-8.9 | Significant vulnerability, exploitation probable |
| Medium | 4.0-6.9 | Moderate risk, exploitation requires conditions |
| Low | 0.1-3.9 | Minor issue, limited impact |
| Info | N/A | Best practice recommendation |

### Step 4: Generate Report

## Output Format

```markdown
## Security Code Review Report

**Reviewed**: [code/file/component]
**Date**: [review date]
**Reviewer**: [name]
**Overall Risk**: [Critical/High/Medium/Low]

### Executive Summary

[2-3 sentence overview of findings and overall security posture]

### Findings Summary

| ID | Severity | OWASP Category | Finding | Status |
|----|----------|----------------|---------|--------|
| F01 | Critical | A03 Injection | SQL Injection in login | Open |
| F02 | High | A07 Auth | Weak session management | Open |

### Detailed Findings

#### F01: SQL Injection in Login Handler

**Severity**: Critical
**OWASP Category**: A03:2021 - Injection
**Location**: `src/auth/login.js:45`

**Description**:
[Detailed description of the vulnerability]

**Vulnerable Code**:
```javascript
// Example vulnerable code
const query = `SELECT * FROM users WHERE username = '${username}'`;
```

**Proof of Concept**:
[How the vulnerability could be exploited]

**Remediation**:
```javascript
// Fixed code
const query = 'SELECT * FROM users WHERE username = ?';
const results = await db.query(query, [username]);
```

**References**:
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)

### Recommendations

1. **Immediate**: [Critical items to fix now]
2. **Short-term**: [Items to address within sprint]
3. **Long-term**: [Architectural improvements]

### Positive Observations

[Security controls that are working well]
```

## Notes

- Always provide working remediation code examples
- Consider the development context when suggesting fixes
- Prioritize findings by both severity and ease of exploitation
- Include false positive analysis when relevant
- Reference authoritative sources (OWASP, CWE, CVE)
- Consider automated scanning as a complement, not replacement
- Review security-sensitive code paths more thoroughly
- Check for security regressions in code changes
