---
description: Full system design workflow from requirements gathering to architecture documentation with ADRs and diagrams
argument-hint: "<system or feature to design>"
---

# /design -- System Design Workflow

Create a complete system design from requirements to architecture diagrams. Guides you through gathering requirements, making architectural decisions, documenting ADRs, and generating C4 diagrams.

## Invocation

```
/design real-time notification system for 1M concurrent users
/design e-commerce checkout microservice
/design [upload existing requirements or architecture doc]
```

## Workflow

### Step 1: Understand the System

Accept context from:
- System description ("real-time notification system")
- Requirements document (uploaded)
- Existing architecture to extend or refactor
- Problem statement ("users complain about slow checkout")

Ask clarifying questions:
1. **Purpose**: What problem does this system solve?
2. **Users**: Who uses it? How many concurrent users?
3. **Scale**: Traffic expectations? Data volume?
4. **Constraints**: Timeline, budget, existing infrastructure?
5. **Quality**: Latency requirements? Availability SLA?
6. **Integration**: What systems does it connect to?

### Step 2: Gather Requirements

Apply the **system-design** skill to document:

**Functional Requirements**
| ID | Requirement | Priority |
|----|-------------|----------|
| FR1 | [Capability] | P0/P1/P2 |

**Non-Functional Requirements**
| Category | Requirement | Target |
|----------|-------------|--------|
| Availability | Uptime | 99.9% |
| Latency | P99 response | <200ms |
| Throughput | Requests/sec | 10,000 |
| Storage | Data retention | 90 days |

### Step 3: Design Architecture

Create high-level architecture:

1. **Architectural Style Selection**
   - Evaluate: Monolith vs Microservices vs Serverless
   - Consider: Event-driven, Request-response, Hybrid
   - Apply trade-off analysis

2. **Component Design**
   - Identify major components
   - Define responsibilities
   - Specify interfaces

3. **Data Architecture**
   - Database selection
   - Caching strategy
   - Data partitioning (if needed)

4. **Integration Design**
   - External system integrations
   - API design (REST/GraphQL/gRPC)
   - Event/message patterns

### Step 4: Document Decisions (ADRs)

For each significant decision, apply the **architecture-decision-record** skill:

```markdown
# ADR-001: [Decision Title]

**Status**: Proposed
**Date**: [Today]

## Context
[Why this decision is needed]

## Decision
[What we decided]

## Consequences
[Positive and negative impacts]
```

Create ADRs for:
- Technology selections (database, framework, cloud services)
- Architectural patterns (monolith vs microservices)
- Security approach (authentication, authorization)
- Scaling strategy (horizontal vs vertical)

### Step 5: Generate Architecture Diagrams

Apply the **c4-diagram** skill to create:

**Level 1: System Context Diagram**
```
Show: System + External actors + External systems
Audience: Everyone
```

**Level 2: Container Diagram**
```
Show: Applications, databases, message queues
Audience: Technical stakeholders
```

**Level 3: Component Diagram** (for complex containers)
```
Show: Internal structure of key containers
Audience: Development team
```

Output in PlantUML or Mermaid format.

### Step 6: Generate System Design Document

Compile everything into a structured document:

```markdown
# System Design: [System Name]

**Version**: 1.0
**Date**: [Today]
**Author**: [Name]
**Status**: Draft

## 1. Executive Summary
[2-3 sentences: what, why, key constraints]

## 2. Requirements
### 2.1 Functional Requirements
[Table of functional requirements]

### 2.2 Non-Functional Requirements
[Table of NFRs with targets]

## 3. Architecture Overview
[High-level description + Context diagram]

## 4. Component Design
### 4.1 [Component Name]
- Responsibility
- Technology
- Interfaces
- Scaling approach

[Container diagram]

## 5. Data Architecture
- Data models
- Database selection rationale
- Caching strategy
- Data flow

## 6. API Design
- Endpoints
- Authentication
- Rate limiting

## 7. Security
- Authentication mechanism
- Authorization model
- Data protection

## 8. Infrastructure
- Deployment architecture
- Environments
- CI/CD approach

## 9. Observability
- Logging
- Metrics
- Alerting

## 10. Risks and Mitigations
[Risk table with mitigations]

## 11. Implementation Roadmap
[Phased approach]

## Appendix A: Architecture Decision Records
[List of ADRs with links]

## Appendix B: Diagrams
[C4 diagrams]
```

### Step 7: Review and Iterate

After generating, offer:
- "Want me to **deep dive** on a specific component?"
- "Should I run a **scalability analysis** on this architecture?"
- "Want me to **design the database schema** in detail?"
- "Should I create **API specifications** for the interfaces?"
- "Want me to add a **trade-off analysis** for the key decisions?"

Save the design document as a markdown file.

## Notes

- Start with requirements, not technology choices
- Architecture is about trade-offs; document what you chose NOT to do
- Generate ADRs for decisions that are hard to reverse
- Use diagrams at the right abstraction level for your audience
- Plan for 10x the stated requirements
- Include failure modes and how the system handles them
- Security and observability are not optional; include from the start
