---
name: technical-spec
version: 1.0.0
description: Create technical specification documents including architecture decisions, system design, and implementation details
tags:
  - documentation
  - technical-spec
  - architecture
  - design
  - rfc
---

# Technical Specification

## Metadata

| Property | Value |
|----------|-------|
| Name | technical-spec |
| Version | 1.0.0 |
| Category | Documentation |
| Complexity | High |

## Instructions

Create comprehensive technical specification documents that communicate system design decisions, architecture choices, and implementation details. Technical specs serve as blueprints for engineering work and historical records of decision-making.

### Document Types

1. **Design Document** - High-level system design
2. **RFC (Request for Comments)** - Proposal for review
3. **ADR (Architecture Decision Record)** - Single decision documentation
4. **Technical Spec** - Detailed implementation guide
5. **API Contract** - Interface specifications

### Key Principles

- Write for your audience (engineers, stakeholders)
- Be explicit about trade-offs
- Document alternatives considered
- Include diagrams for complex systems
- Keep it living and updated

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Title of the technical specification |
| problem_statement | string | Yes | Problem being solved |
| scope | string | Yes | What's in and out of scope |
| author | string | No | Author(s) of the spec |
| reviewers | array | No | List of reviewers |
| related_docs | array | No | Links to related documentation |

## Output Process

### Step 1: Define the Problem

- [ ] Clearly state the problem being solved
- [ ] Identify stakeholders and their needs
- [ ] Define success criteria
- [ ] Establish constraints and requirements

### Step 2: Explore Solutions

- [ ] Research existing solutions
- [ ] Brainstorm possible approaches
- [ ] Evaluate trade-offs
- [ ] Select preferred approach

### Step 3: Design the Solution

- [ ] Create system architecture
- [ ] Define data models
- [ ] Specify interfaces and APIs
- [ ] Plan for scalability and reliability

### Step 4: Document Implementation

- [ ] Break down into milestones
- [ ] Identify dependencies
- [ ] Plan migration strategy
- [ ] Define rollout approach

### Step 5: Review and Finalize

- [ ] Get feedback from reviewers
- [ ] Address concerns
- [ ] Update based on feedback
- [ ] Obtain approvals

## Output Format

```markdown
# Technical Specification: [Title]

**Status**: Draft | In Review | Approved | Implemented | Deprecated
**Author(s)**: [Names]
**Reviewers**: [Names]
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD

## Table of Contents

1. [Overview](#overview)
2. [Background](#background)
3. [Goals and Non-Goals](#goals-and-non-goals)
4. [Proposed Solution](#proposed-solution)
5. [System Design](#system-design)
6. [Data Model](#data-model)
7. [API Design](#api-design)
8. [Alternatives Considered](#alternatives-considered)
9. [Security Considerations](#security-considerations)
10. [Testing Strategy](#testing-strategy)
11. [Rollout Plan](#rollout-plan)
12. [Monitoring and Alerting](#monitoring-and-alerting)
13. [Open Questions](#open-questions)
14. [Appendix](#appendix)

---

## Overview

[2-3 sentence summary of what this spec proposes and why it matters]

## Background

### Context
[Explain the current state and what led to this proposal]

### Problem Statement
[Clear description of the problem being solved]

### Requirements
| Requirement | Priority | Description |
|------------|----------|-------------|
| REQ-001 | P0 | Must support X |
| REQ-002 | P1 | Should enable Y |
| REQ-003 | P2 | Nice to have Z |

## Goals and Non-Goals

### Goals
- [ ] Goal 1: [Specific, measurable outcome]
- [ ] Goal 2: [Specific, measurable outcome]
- [ ] Goal 3: [Specific, measurable outcome]

### Non-Goals
- Non-goal 1: [What we're explicitly not doing and why]
- Non-goal 2: [What we're explicitly not doing and why]

### Success Metrics
| Metric | Current | Target | Measurement Method |
|--------|---------|--------|-------------------|
| Latency p99 | 500ms | 100ms | DataDog APM |
| Error rate | 2% | 0.1% | Error tracking |
| Throughput | 1K/s | 10K/s | Load testing |

## Proposed Solution

### High-Level Approach
[Describe the solution at a high level]

### Key Design Decisions

#### Decision 1: [Title]
**Context**: [Why this decision needed to be made]
**Decision**: [What was decided]
**Rationale**: [Why this option was chosen]
**Consequences**: [Positive and negative impacts]

#### Decision 2: [Title]
...

## System Design

### Architecture Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   API GW    │────▶│   Service   │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                           ┌───────────────────┼───────────────────┐
                           ▼                   ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │   Cache     │     │  Database   │     │   Queue     │
                    │   (Redis)   │     │  (Postgres) │     │   (SQS)     │
                    └─────────────┘     └─────────────┘     └─────────────┘
```

### Component Descriptions

| Component | Responsibility | Technology | Owner |
|-----------|---------------|------------|-------|
| API Gateway | Rate limiting, auth | Kong | Platform |
| Service | Business logic | Go | Team A |
| Database | Data persistence | PostgreSQL | DBA |
| Cache | Performance | Redis | Platform |

### Sequence Diagram

```
Client          API           Service        Database
  │               │               │               │
  │──── Request ──▶│               │               │
  │               │──── Auth ─────▶│               │
  │               │◀─── Token ─────│               │
  │               │──── Process ──▶│               │
  │               │               │──── Query ───▶│
  │               │               │◀─── Data ─────│
  │◀── Response ──│◀─── Result ───│               │
  │               │               │               │
```

## Data Model

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐
│    User      │       │    Order     │
├──────────────┤       ├──────────────┤
│ id (PK)      │◀──────│ user_id (FK) │
│ email        │       │ id (PK)      │
│ created_at   │       │ status       │
└──────────────┘       │ total        │
                       │ created_at   │
                       └──────────────┘
```

### Schema Definition

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

## API Design

### Endpoints

#### POST /api/v2/orders

Create a new order.

**Request:**
```json
{
  "items": [
    {"product_id": "prod_123", "quantity": 2}
  ],
  "shipping_address_id": "addr_456"
}
```

**Response (201):**
```json
{
  "id": "ord_789",
  "status": "pending",
  "total": "99.99",
  "created_at": "2024-03-15T10:30:00Z"
}
```

**Error Responses:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_REQUEST | Missing required fields |
| 404 | PRODUCT_NOT_FOUND | Product doesn't exist |
| 409 | OUT_OF_STOCK | Insufficient inventory |

## Alternatives Considered

### Option A: [Name]
**Description**: [Brief description]
**Pros**:
- Pro 1
- Pro 2

**Cons**:
- Con 1
- Con 2

**Why not chosen**: [Explanation]

### Option B: [Name]
...

## Security Considerations

### Threat Model

| Threat | Impact | Likelihood | Mitigation |
|--------|--------|------------|------------|
| SQL Injection | High | Low | Parameterized queries |
| Data breach | Critical | Medium | Encryption at rest |
| DDoS | High | Medium | Rate limiting, CDN |

### Security Controls
- [ ] Authentication: OAuth 2.0 with JWT
- [ ] Authorization: RBAC with fine-grained permissions
- [ ] Encryption: TLS 1.3 in transit, AES-256 at rest
- [ ] Audit logging: All mutations logged with user context

## Testing Strategy

### Test Levels

| Level | Coverage Target | Tools |
|-------|----------------|-------|
| Unit | 80% | Jest, Go testing |
| Integration | Critical paths | Testcontainers |
| E2E | Happy paths | Cypress |
| Load | 10x expected | k6 |

### Test Scenarios
- [ ] Happy path order creation
- [ ] Invalid product handling
- [ ] Concurrent order creation
- [ ] Database failure recovery

## Rollout Plan

### Phases

| Phase | Description | Duration | Success Criteria |
|-------|-------------|----------|-----------------|
| 1. Canary | 1% traffic | 1 week | No errors, p99 < 200ms |
| 2. Limited | 10% traffic | 1 week | Error rate < 0.1% |
| 3. Gradual | 25% → 50% → 100% | 2 weeks | All metrics green |

### Rollback Plan
1. Automated rollback if error rate > 1%
2. Manual rollback via feature flag
3. Database rollback script ready

### Feature Flags
| Flag | Purpose | Default |
|------|---------|---------|
| `new_order_system` | Enable new flow | false |
| `async_processing` | Enable async | false |

## Monitoring and Alerting

### Key Metrics
- `order.created.count` - Orders created per minute
- `order.latency.p99` - 99th percentile latency
- `order.error.rate` - Error rate percentage

### Dashboards
- [Order Service Dashboard](link)
- [Business Metrics Dashboard](link)

### Alerts
| Alert | Condition | Severity | Runbook |
|-------|-----------|----------|---------|
| High Error Rate | > 1% for 5 min | P1 | [Link] |
| High Latency | p99 > 500ms | P2 | [Link] |
| Low Throughput | < 50% baseline | P2 | [Link] |

## Open Questions

| Question | Owner | Deadline | Status |
|----------|-------|----------|--------|
| Should we support batch orders? | @engineer | 2024-03-20 | Open |
| What's the data retention policy? | @pm | 2024-03-18 | Resolved: 7 years |

## Appendix

### Glossary
- **Term**: Definition

### References
- [Link to related spec]
- [External documentation]

### Revision History
| Date | Author | Changes |
|------|--------|---------|
| 2024-03-15 | @author | Initial draft |
| 2024-03-18 | @author | Added security section |
```

## Notes

- Start with the problem, not the solution
- Be explicit about what's out of scope
- Include diagrams - a picture is worth a thousand words
- Document alternatives to show due diligence
- Keep specs updated as implementation progresses
- Use consistent terminology throughout
- Get feedback early and iterate
- Archive outdated specs rather than deleting
- Link to code implementations when complete
- Consider using ADRs for individual decisions
