---
description: Execute threat modeling analysis using STRIDE methodology to identify and mitigate security threats in system design
argument-hint: "<system, feature, or architecture to analyze>"
---

# /threat-model -- Threat Modeling Execution

Conduct systematic threat modeling using STRIDE methodology to identify potential security threats, assess their likelihood and impact, and design appropriate mitigations.

## Invocation

```
/threat-model Analyze the payment processing system
/threat-model Model threats for the user authentication flow
/threat-model [paste architecture diagram or description]
/threat-model Review the API gateway security
```

## Workflow

### Step 1: Understand the System

Accept system description in various forms:
- Architecture diagram
- System description
- Feature specification
- Data flow narrative
- API documentation

Identify:
- System purpose and scope
- Key components and services
- Data types processed
- External interfaces
- User types and roles

### Step 2: Gather Context

Ask targeted questions to build a complete picture:

1. **System boundaries**: What's in scope for this model?
2. **Data sensitivity**: What data classifications are involved?
3. **Users/actors**: Who interacts with this system?
4. **External dependencies**: What third-party services are used?
5. **Existing controls**: What security measures are already in place?
6. **Compliance**: Any regulatory requirements?

For provided diagrams or descriptions, extract what's available and ask only about gaps.

### Step 3: Decompose the System

Create or refine the system decomposition:

```
System: [Name]
├── Component 1
│   ├── Entry points
│   └── Data stores
├── Component 2
│   └── External services
└── Trust Boundaries
    ├── Internet → DMZ
    ├── DMZ → Internal
    └── App → Database
```

Identify:
- [ ] All entry points (APIs, UIs, file uploads, etc.)
- [ ] Data flows (including sensitive data)
- [ ] Trust boundaries
- [ ] Assets to protect
- [ ] Threat actors to consider

### Step 4: Apply STRIDE Analysis

For each component crossing trust boundaries:

| Category | Question | Threats to Consider |
|----------|----------|---------------------|
| **S**poofing | Can identity be faked? | Credential theft, session hijacking, impersonation |
| **T**ampering | Can data be modified? | MITM attacks, parameter tampering, data corruption |
| **R**epudiation | Can actions be denied? | Missing logs, unsigned transactions |
| **I**nformation Disclosure | Can data leak? | Data breaches, verbose errors, side channels |
| **D**enial of Service | Can service be disrupted? | Resource exhaustion, amplification attacks |
| **E**levation of Privilege | Can access be gained? | Privilege escalation, authorization bypass |

### Step 5: Risk Assessment

For each identified threat, calculate risk:

**DREAD Scoring**:
- **D**amage: How bad if exploited? (1-10)
- **R**eproducibility: How easy to reproduce? (1-10)
- **E**xploitability: How easy to exploit? (1-10)
- **A**ffected Users: How many impacted? (1-10)
- **D**iscoverability: How easy to find? (1-10)

Risk = (D + R + E + A + D) / 5

| Score | Risk Level |
|-------|------------|
| 7-10 | Critical |
| 5-7 | High |
| 3-5 | Medium |
| 1-3 | Low |

### Step 6: Design Mitigations

For each threat, identify countermeasures:

| Mitigation Type | Description |
|----------------|-------------|
| Preventive | Stops the attack |
| Detective | Identifies when attack occurs |
| Corrective | Responds to attack |
| Deterrent | Discourages attackers |

### Step 7: Generate Threat Model Document

Apply the **threat-modeling** skill output format:

```markdown
## Threat Model: [System Name]

**Version**: 1.0
**Date**: [today]
**Status**: Draft

### 1. System Overview

[Description and architecture diagram]

### 2. Assets

| Asset | Sensitivity | Owner |
|-------|-------------|-------|

### 3. Threat Actors

| Actor | Motivation | Capability |
|-------|------------|------------|

### 4. Trust Boundaries

[Diagram and descriptions]

### 5. Threats and Mitigations

#### TM-001: [Threat Name]
**STRIDE**: [Category]
**Component**: [Affected component]
**Attack Scenario**: [How attack works]
**DREAD Score**: [X.X] - [Risk Level]

**Mitigations**:
| Control | Type | Status |
|---------|------|--------|

### 6. Risk Summary

| Level | Count | Threats |
|-------|-------|---------|
| Critical | X | TM-001 |
| High | X | TM-002, TM-003 |

### 7. Recommendations

**Immediate**: [Critical mitigations]
**Short-term**: [High priority items]
**Long-term**: [Architectural changes]

### 8. Accepted Risks

| Risk | Justification | Approver |
|------|---------------|----------|
```

### Step 8: Review and Iterate

After generating the threat model, offer:
- "Want me to deep-dive on any specific threat?"
- "Should I create **security requirements** from these threats?"
- "Need a **security review** of the implementation?"
- "Should I design **secure authentication** for this system?"
- "Want me to create a **penetration test plan** based on this model?"

## Notes

- Threat modeling should happen early in design, not just before launch
- Include developers and architects in the modeling process
- Focus on high-value assets and data first
- Document assumptions explicitly
- Link threats to specific, measurable mitigations
- Update the model when architecture changes
- Use diagrams to communicate complex systems
- Consider both insider and external threats
- Residual risk should be formally accepted
- Schedule regular threat model reviews
