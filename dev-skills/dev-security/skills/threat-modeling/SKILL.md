---
name: threat-modeling
version: 1.0.0
description: Conduct threat modeling using STRIDE methodology to identify and mitigate security threats in system design
tags:
  - security
  - threat-modeling
  - stride
  - risk-assessment
  - architecture
---

# Threat Modeling

## Metadata

| Property | Value |
|----------|-------|
| Name | threat-modeling |
| Version | 1.0.0 |
| Category | Security |
| Complexity | High |

## Instructions

Perform systematic threat modeling using the STRIDE methodology to identify potential security threats, assess their impact, and design appropriate mitigations. This should be done early in the design phase and updated as the system evolves.

### STRIDE Categories

| Category | Description | Security Property Violated |
|----------|-------------|---------------------------|
| **S**poofing | Pretending to be someone/something else | Authentication |
| **T**ampering | Modifying data or code without authorization | Integrity |
| **R**epudiation | Denying having performed an action | Non-repudiation |
| **I**nformation Disclosure | Exposing information to unauthorized parties | Confidentiality |
| **D**enial of Service | Denying or degrading service to users | Availability |
| **E**levation of Privilege | Gaining capabilities without authorization | Authorization |

### Threat Modeling Process

1. **Decompose the Application**
   - Identify entry points
   - Map trust boundaries
   - Document data flows
   - List assets and their sensitivity

2. **Determine Threats**
   - Apply STRIDE to each component
   - Consider attack vectors
   - Identify threat actors

3. **Determine Countermeasures**
   - Design mitigations
   - Prioritize by risk
   - Document accepted risks

4. **Rate Threats**
   - Use DREAD or similar scoring
   - Consider likelihood and impact

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| system_description | string | Yes | Description of the system or feature to model |
| architecture_diagram | file | No | System architecture diagram or DFD |
| assets | array | No | List of assets to protect |
| threat_actors | array | No | Relevant threat actors to consider |
| existing_controls | array | No | Security controls already in place |

## Output Process

### Step 1: System Decomposition

- [ ] Create or review system architecture diagram
- [ ] Identify all components and their functions
- [ ] Map external dependencies
- [ ] Document data flows (including sensitive data)
- [ ] Mark trust boundaries

### Step 2: Asset Identification

| Asset | Classification | Location | Owner |
|-------|---------------|----------|-------|
| User credentials | Confidential | Database, Transit | Auth Service |
| Payment data | PCI-DSS | Payment Gateway | Payments Team |
| Session tokens | Sensitive | Memory, Cookies | Auth Service |

### Step 3: Trust Boundary Analysis

Trust boundaries exist where:
- Data crosses network segments
- Different privilege levels interact
- External systems connect
- User input enters the system
- Data leaves the system

### Step 4: STRIDE Analysis Per Component

For each component crossing trust boundaries:

**Spoofing Threats**
- Can an attacker impersonate a user?
- Can an attacker impersonate a service?
- How is identity verified?

**Tampering Threats**
- Can data be modified in transit?
- Can data be modified at rest?
- Can code or configuration be altered?

**Repudiation Threats**
- Can actions be performed anonymously?
- Is there an audit trail?
- Can logs be trusted?

**Information Disclosure Threats**
- Can sensitive data leak?
- Are error messages revealing?
- Is data encrypted appropriately?

**Denial of Service Threats**
- Can the service be overwhelmed?
- Are there resource limits?
- What's the impact of component failure?

**Elevation of Privilege Threats**
- Can users gain admin access?
- Are permissions properly enforced?
- Can services be exploited for higher access?

### Step 5: Risk Rating (DREAD)

| Factor | Description | Score (1-10) |
|--------|-------------|--------------|
| **D**amage | How much damage if exploited? | |
| **R**eproducibility | How easy to reproduce? | |
| **E**xploitability | How easy to exploit? | |
| **A**ffected Users | How many users impacted? | |
| **D**iscoverability | How easy to discover? | |

**Risk Score** = (D + R + E + A + D) / 5

### Step 6: Mitigation Design

For each threat:
1. Identify applicable countermeasures
2. Assess feasibility and cost
3. Document residual risk
4. Assign ownership

## Output Format

```markdown
## Threat Model: [System/Feature Name]

**Version**: [version]
**Date**: [date]
**Authors**: [names]
**Status**: Draft | In Review | Approved

### 1. System Overview

#### Description
[Brief description of the system being modeled]

#### Architecture Diagram
```
[ASCII or reference to diagram]
```

#### Components
| Component | Purpose | Technology | Trust Level |
|-----------|---------|------------|-------------|

#### Data Flows
| ID | Source | Destination | Data | Classification |
|----|--------|-------------|------|----------------|

### 2. Trust Boundaries

[Diagram showing trust boundaries]

| Boundary | Description | Controls |
|----------|-------------|----------|

### 3. Assets

| Asset | Sensitivity | Location | Threats |
|-------|-------------|----------|---------|

### 4. Threat Actors

| Actor | Motivation | Capability | Target Assets |
|-------|------------|------------|---------------|
| External Attacker | Financial gain | Medium | User data, credentials |
| Malicious Insider | Revenge, profit | High | All internal assets |
| Automated Bot | Mass exploitation | Low-Medium | Known vulnerabilities |

### 5. Threats and Mitigations

#### TM-001: [Threat Name]

**STRIDE Category**: [S/T/R/I/D/E]
**Component**: [Affected component]
**Description**: [Detailed threat description]

**Attack Scenario**:
1. Attacker does X
2. System responds with Y
3. Attacker achieves Z

**DREAD Score**: [X.X] (High/Medium/Low)
- Damage: X
- Reproducibility: X
- Exploitability: X
- Affected Users: X
- Discoverability: X

**Mitigations**:
| Mitigation | Type | Status | Owner |
|------------|------|--------|-------|
| Implement input validation | Preventive | Planned | Dev Team |
| Add rate limiting | Detective | In Progress | Platform |

**Residual Risk**: [Description of remaining risk after mitigations]

### 6. Risk Summary

| Risk Level | Count | Examples |
|------------|-------|----------|
| Critical | X | TM-001, TM-005 |
| High | X | TM-002, TM-007 |
| Medium | X | TM-003, TM-004 |
| Low | X | TM-006 |

### 7. Recommendations

**Immediate Actions**:
1. [Critical items]

**Short-term**:
1. [Items for next sprint]

**Long-term**:
1. [Architectural changes]

### 8. Accepted Risks

| Risk | Justification | Approver | Review Date |
|------|---------------|----------|-------------|

### 9. Review Schedule

- Next review: [date]
- Trigger events: [architecture changes, new features, incidents]
```

## Notes

- Threat modeling should be iterative, not a one-time activity
- Involve developers, architects, and security teams in the process
- Focus on high-value assets and critical data flows first
- Document assumptions and constraints
- Use data flow diagrams (DFD) for complex systems
- Consider both technical and business impacts
- Update threat models when architecture changes
- Link threats to specific mitigations for traceability
- Use threat modeling tools (Microsoft TMT, OWASP Threat Dragon) for complex systems
