---
name: penetration-test-plan
version: 1.0.0
description: Plan and scope penetration testing engagements including methodology, test cases, and deliverables
tags:
  - security
  - penetration-testing
  - red-team
  - vulnerability-assessment
  - offensive-security
---

# Penetration Test Planning

## Metadata

| Property | Value |
|----------|-------|
| Name | penetration-test-plan |
| Version | 1.0.0 |
| Category | Security |
| Complexity | High |

## Instructions

Plan comprehensive penetration testing engagements covering scope definition, methodology selection, test case development, rules of engagement, and deliverable specifications. This skill helps organizations prepare for both internal and external security assessments.

### Types of Penetration Tests

| Type | Description | Scope |
|------|-------------|-------|
| Black Box | No prior knowledge | External attacker simulation |
| Gray Box | Partial knowledge | Authenticated user perspective |
| White Box | Full knowledge | Code and architecture review |
| External | Internet-facing assets | Perimeter security |
| Internal | Inside network | Insider threat, lateral movement |
| Web Application | Web apps and APIs | OWASP Top 10, business logic |
| Mobile | iOS/Android apps | Client-side, API security |
| Social Engineering | Human element | Phishing, pretexting |
| Physical | Physical security | Access controls, badges |
| Red Team | Full-scope | Objectives-based, realistic |

### Testing Methodologies

| Methodology | Focus | Standard |
|-------------|-------|----------|
| OWASP Testing Guide | Web applications | Industry standard |
| PTES | Full penetration test | Comprehensive framework |
| OSSTMM | Security metrics | Operational security |
| NIST SP 800-115 | Technical testing | Government/compliance |
| CREST | Professional services | UK/International |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| target_description | string | Yes | Description of target systems/applications |
| test_type | string | Yes | Type of penetration test |
| objectives | array | Yes | Primary testing objectives |
| constraints | array | No | Time, budget, or scope constraints |
| compliance | array | No | Compliance requirements driving the test |
| previous_tests | string | No | Results from previous assessments |

## Output Process

### Step 1: Scope Definition

#### In-Scope Assets

```yaml
scope:
  web_applications:
    - https://app.example.com
    - https://api.example.com/v2/*
    - https://admin.example.com (gray box)

  infrastructure:
    - IP range: 203.0.113.0/24
    - Exclude: 203.0.113.100 (production DB)

  mobile_applications:
    - iOS: com.example.app (App Store)
    - Android: com.example.app (Play Store)

  cloud:
    - AWS Account: 123456789012
    - Services: EC2, S3, Lambda, RDS
```

#### Out-of-Scope

```yaml
exclusions:
  - Third-party services not owned by client
  - Physical security testing
  - Social engineering against employees
  - Denial of service attacks
  - Production database (203.0.113.100)
```

### Step 2: Rules of Engagement

```yaml
rules_of_engagement:
  authorized_period:
    start: "2024-03-01 09:00 UTC"
    end: "2024-03-15 18:00 UTC"

  testing_windows:
    - weekdays: "09:00-18:00 UTC"
    - weekends: "Emergency only with approval"

  communication:
    primary_contact:
      name: "Security Manager"
      email: "security@example.com"
      phone: "+1-555-123-4567"
    emergency_contact:
      name: "CTO"
      phone: "+1-555-987-6543"

  escalation:
    critical_finding: "Immediate notification"
    system_impact: "Stop testing, notify contact"

  restrictions:
    - No data exfiltration
    - No persistent backdoors
    - No modification of production data
    - No testing during maintenance windows
```

### Step 3: Methodology and Test Cases

#### Web Application Testing

| Phase | Test Cases | Tools |
|-------|------------|-------|
| **Reconnaissance** | | |
| | Subdomain enumeration | Subfinder, Amass |
| | Technology fingerprinting | Wappalyzer, WhatWeb |
| | Directory discovery | Gobuster, Feroxbuster |
| **Authentication** | | |
| | Brute force protection | Burp Suite, Hydra |
| | Session management | Manual, Burp Suite |
| | Password policy | Manual testing |
| | MFA bypass | Manual testing |
| **Authorization** | | |
| | IDOR testing | Burp Suite, manual |
| | Privilege escalation | Manual testing |
| | Role bypass | Manual testing |
| **Injection** | | |
| | SQL injection | SQLMap, manual |
| | XSS (reflected, stored, DOM) | Burp Suite, XSSHunter |
| | Command injection | Manual testing |
| | SSTI | Tplmap, manual |
| **Business Logic** | | |
| | Workflow bypass | Manual testing |
| | Rate limiting | Manual testing |
| | Price manipulation | Manual testing |

#### Infrastructure Testing

| Phase | Test Cases | Tools |
|-------|------------|-------|
| **Network** | | |
| | Port scanning | Nmap, Masscan |
| | Service enumeration | Nmap scripts |
| | Vulnerability scanning | Nessus, OpenVAS |
| **Services** | | |
| | Default credentials | Hydra, manual |
| | Known vulnerabilities | Metasploit, exploits |
| | Misconfigurations | Manual review |
| **Active Directory** | | |
| | Kerberoasting | Rubeus, Impacket |
| | AS-REP Roasting | Rubeus |
| | DCSync | Mimikatz |
| | BloodHound analysis | BloodHound |

#### API Testing

| Test Category | Test Cases |
|---------------|------------|
| Authentication | Token validation, JWT weaknesses, OAuth flows |
| Authorization | Endpoint access, object-level, function-level |
| Input Validation | Parameter tampering, injection, file upload |
| Rate Limiting | Throttling, quotas, abuse prevention |
| Data Exposure | Verbose errors, sensitive data in responses |

### Step 4: Risk Assessment Framework

#### Finding Severity

| Severity | CVSS | Criteria |
|----------|------|----------|
| Critical | 9.0-10.0 | RCE, auth bypass, data breach |
| High | 7.0-8.9 | Privilege escalation, significant data access |
| Medium | 4.0-6.9 | Limited impact, requires conditions |
| Low | 0.1-3.9 | Minimal impact, best practice |
| Info | N/A | Observation, no direct risk |

#### Business Impact

| Impact | Description |
|--------|-------------|
| Financial | Direct monetary loss potential |
| Reputational | Brand damage, customer trust |
| Regulatory | Compliance violations, fines |
| Operational | Service disruption, availability |
| Legal | Liability, contractual breach |

### Step 5: Deliverables Specification

```yaml
deliverables:
  executive_summary:
    audience: "C-level, management"
    content:
      - Overall risk posture
      - Key findings summary
      - Strategic recommendations
      - Comparison to previous tests

  technical_report:
    audience: "Security team, developers"
    content:
      - Detailed methodology
      - All findings with evidence
      - Reproduction steps
      - Remediation guidance

  finding_details:
    format: "Per-finding documentation"
    content:
      - Vulnerability description
      - CVSS score and vector
      - Proof of concept
      - Screenshots/evidence
      - Remediation steps
      - References

  raw_data:
    content:
      - Tool outputs
      - Scan results
      - Network captures (sanitized)
```

## Output Format

```markdown
## Penetration Test Plan

**Client**: [Client Name]
**Project**: [Project Name]
**Version**: [version]
**Date**: [date]

### 1. Executive Overview

**Objective**: [Primary testing objective]
**Test Type**: [Black Box / Gray Box / White Box]
**Duration**: [Start Date] to [End Date]

### 2. Scope

#### In-Scope Assets

| Asset Type | Target | Access Level |
|------------|--------|--------------|
| Web Application | https://app.example.com | Black box |
| API | https://api.example.com | Gray box |
| Infrastructure | 203.0.113.0/24 | Black box |

#### Out-of-Scope

- [List of exclusions]

#### Credentials Provided (Gray/White Box)

| Role | Purpose | Access Level |
|------|---------|--------------|
| standard_user | Normal user testing | Read |
| admin_user | Admin function testing | Full |

### 3. Rules of Engagement

#### Authorized Testing Period
- **Start**: [Date/Time]
- **End**: [Date/Time]
- **Testing Hours**: [Hours]

#### Contacts
| Role | Name | Contact |
|------|------|---------|
| Primary | [Name] | [Email/Phone] |
| Technical | [Name] | [Email/Phone] |
| Emergency | [Name] | [Phone] |

#### Restrictions
- [List of restrictions]

### 4. Methodology

#### Phase 1: Reconnaissance
- [ ] OSINT gathering
- [ ] DNS enumeration
- [ ] Technology fingerprinting
- [ ] Directory discovery

#### Phase 2: Scanning and Enumeration
- [ ] Port scanning
- [ ] Service identification
- [ ] Vulnerability scanning

#### Phase 3: Exploitation
- [ ] Vulnerability verification
- [ ] Exploit development
- [ ] Post-exploitation

#### Phase 4: Reporting
- [ ] Finding documentation
- [ ] Evidence collection
- [ ] Report generation

### 5. Test Cases

#### Web Application
| ID | Test Case | Priority | Method |
|----|-----------|----------|--------|
| WEB-001 | SQL Injection | High | Automated + Manual |
| WEB-002 | XSS (all types) | High | Manual |
| WEB-003 | Authentication bypass | Critical | Manual |

#### API
| ID | Test Case | Priority | Method |
|----|-----------|----------|--------|
| API-001 | JWT validation | High | Manual |
| API-002 | BOLA/IDOR | Critical | Manual |

#### Infrastructure
| ID | Test Case | Priority | Method |
|----|-----------|----------|--------|
| INF-001 | Default credentials | High | Automated |
| INF-002 | Known CVEs | Critical | Automated |

### 6. Tools

| Category | Tools |
|----------|-------|
| Reconnaissance | Nmap, Subfinder, Amass |
| Web Testing | Burp Suite, OWASP ZAP |
| Exploitation | Metasploit, custom scripts |
| Reporting | [Reporting platform] |

### 7. Deliverables

| Deliverable | Format | Audience | Due Date |
|-------------|--------|----------|----------|
| Executive Summary | PDF | Management | [Date] |
| Technical Report | PDF | Security Team | [Date] |
| Findings Data | JSON/CSV | Dev Team | [Date] |
| Debrief Presentation | Slides | All stakeholders | [Date] |

### 8. Timeline

| Phase | Duration | Dates |
|-------|----------|-------|
| Kickoff | 1 day | [Date] |
| Testing | [X] days | [Date range] |
| Reporting | [X] days | [Date range] |
| Debrief | 1 day | [Date] |

### 9. Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Client Authorized Rep | | | |
| Testing Lead | | | |
```

## Notes

- Always obtain written authorization before testing
- Document all activities with timestamps
- Stop testing immediately if critical production impact
- Protect all findings and evidence as confidential
- Coordinate with incident response teams
- Consider legal implications in different jurisdictions
- Include retesting in scope when possible
- Verify remediation effectiveness
- Maintain chain of custody for evidence
- Follow responsible disclosure principles
