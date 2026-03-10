---
description: Run a comprehensive security review workflow on code, features, or systems using OWASP Top 10 and secure coding best practices
argument-hint: "<code, file, or feature to review>"
---

# /security -- Security Review Workflow

Execute a thorough security review combining OWASP Top 10 analysis, secure coding review, and vulnerability identification. Produces actionable findings with remediation guidance.

## Invocation

```
/security Review the authentication module for vulnerabilities
/security Check this API endpoint for injection risks
/security [paste code snippet]
/security Analyze the user registration flow
```

## Workflow

### Step 1: Understand the Target

Accept input in various forms:
- Code file or snippet
- Feature or module name
- System component description
- API endpoint specification
- Architecture description

Identify:
- Programming language and framework
- Type of component (API, UI, backend service, etc.)
- Data sensitivity level
- Trust boundaries involved

### Step 2: Gather Context

Ask focused questions to understand security context:

1. **Data handling**: What sensitive data does this process?
2. **Authentication**: How are users authenticated at this point?
3. **Authorization**: What access controls are in place?
4. **External inputs**: What user or external inputs are accepted?
5. **Dependencies**: What external services or libraries are used?
6. **Compliance**: Any specific compliance requirements (PCI, HIPAA)?

If code is provided, analyze it directly and ask only about gaps.

### Step 3: Execute Security Review

Apply the **security-review** skill with OWASP Top 10 checklist:

#### Quick Checklist

**A01 - Broken Access Control**
- [ ] Authorization on all endpoints
- [ ] IDOR protection
- [ ] CORS properly configured

**A02 - Cryptographic Failures**
- [ ] Sensitive data encrypted
- [ ] Strong algorithms used
- [ ] No hardcoded secrets

**A03 - Injection**
- [ ] Parameterized queries
- [ ] Input validation
- [ ] Output encoding

**A04 - Insecure Design**
- [ ] Threat modeling done
- [ ] Security requirements met

**A05 - Security Misconfiguration**
- [ ] Secure defaults
- [ ] Error handling safe

**A06 - Vulnerable Components**
- [ ] Dependencies up to date
- [ ] No known CVEs

**A07 - Authentication Failures**
- [ ] Strong password policy
- [ ] Session management secure

**A08 - Integrity Failures**
- [ ] Input integrity verified
- [ ] CI/CD secured

**A09 - Logging Failures**
- [ ] Security events logged
- [ ] No sensitive data in logs

**A10 - SSRF**
- [ ] URL validation
- [ ] Allowlisting used

### Step 4: Identify Vulnerabilities

For each finding:
1. Classify by OWASP category
2. Determine severity (Critical/High/Medium/Low)
3. Provide evidence (code snippet, example)
4. Explain exploitability
5. Assess business impact

### Step 5: Generate Report

Apply output format from **security-review** skill:

```markdown
## Security Review: [Target Name]

**Reviewed**: [code/feature/system]
**Date**: [today]
**Overall Risk**: [Critical/High/Medium/Low]

### Executive Summary
[2-3 sentences summarizing findings]

### Findings

| ID | Severity | Category | Finding |
|----|----------|----------|---------|
| S01 | Critical | A03 | SQL Injection in search |
| S02 | High | A07 | Weak session tokens |

### Detailed Findings

#### S01: [Finding Title]
**Severity**: [level]
**OWASP Category**: [category]
**Location**: [file:line or component]

**Description**: [What the vulnerability is]

**Vulnerable Code**:
```[language]
// Vulnerable pattern
```

**Remediation**:
```[language]
// Secure pattern
```

**References**: [OWASP, CWE links]

### Recommendations
1. **Immediate**: [Critical fixes]
2. **Short-term**: [High priority items]
3. **Long-term**: [Security improvements]
```

### Step 6: Offer Follow-up Actions

After generating the report, offer:
- "Should I create a **threat model** for this component?"
- "Want me to run a **dependency audit** on this codebase?"
- "Should I design **secure authentication** for this feature?"
- "Need help implementing these **secure coding** patterns?"

## Notes

- Start with the most critical data flows and entry points
- Consider both the specific code and its integration context
- Provide working remediation code, not just descriptions
- Prioritize findings by exploitability and business impact
- Include positive observations where security is done well
- Reference authoritative sources for all recommendations
- Consider automated scanning as a complement, not replacement
- Security review is iterative; offer to review remediations
