---
description: Create an Architecture Decision Record with context, decision rationale, consequences, and alternatives
argument-hint: "<decision topic>"
---

# /adr -- Architecture Decision Record

Create a well-structured Architecture Decision Record (ADR) that documents the context, decision, rationale, alternatives considered, and consequences for significant technical decisions.

## Invocation

```
/adr PostgreSQL vs MongoDB for user data
/adr authentication mechanism for public API
/adr monolith to microservices migration strategy
/adr                    # asks about the decision
```

## Workflow

### Step 1: Understand the Decision

Accept context from:
- Decision question ("Should we use PostgreSQL or MongoDB?")
- Problem statement ("Users need to authenticate via multiple providers")
- Options to evaluate ("Kafka vs RabbitMQ vs SQS")
- Existing ADR to update or supersede

Ask clarifying questions:
1. **Decision**: What specific decision needs to be made?
2. **Context**: What prompted this decision? Why now?
3. **Stakeholders**: Who is affected by this decision?
4. **Constraints**: Timeline, budget, existing systems?
5. **Options**: What alternatives are being considered?
6. **Criteria**: What matters most (cost, performance, simplicity)?

### Step 2: Gather Options

For each option, identify:
- What is this option?
- How would it work?
- What are the pros?
- What are the cons?
- What is the effort to implement?
- What are the risks?

Apply the **trade-off-analysis** skill if comparing multiple technologies.

### Step 3: Generate the ADR

Apply the **architecture-decision-record** skill:

```markdown
# ADR-[NUMBER]: [TITLE]

**Status**: Proposed
**Date**: [YYYY-MM-DD]
**Decision Makers**: [Names and roles]
**Consulted**: [Names and roles]
**Informed**: [Teams or individuals]

## Context

[Describe the situation that requires a decision:]

- What is the current state?
- What business or technical drivers are pushing for change?
- What constraints exist (timeline, budget, skills)?
- What related decisions have been made?

## Decision Drivers

The key factors influencing this decision:

1. **[Driver 1]**: [Description and importance]
2. **[Driver 2]**: [Description and importance]
3. **[Driver 3]**: [Description and importance]

## Considered Options

### Option 1: [Name]

**Description**: [How this option works]

**Pros**:
- [Advantage with supporting evidence]
- [Advantage with supporting evidence]

**Cons**:
- [Disadvantage with impact assessment]
- [Disadvantage with impact assessment]

**Effort**: [Low | Medium | High]
**Risk**: [Low | Medium | High]

### Option 2: [Name]
[Same structure]

### Option 3: [Name]
[Same structure]

## Decision

**We will [chosen option] because [primary reason].**

### Rationale

1. [Why this option best addresses Driver 1]
2. [Why this option best addresses Driver 2]
3. [Why the downsides are acceptable]

### What We Are NOT Doing

- [Alternative we explicitly rejected and why]

## Consequences

### Positive

- [Benefit 1]
- [Benefit 2]

### Negative

- [Drawback 1] — **Mitigation**: [How we'll address it]
- [Drawback 2] — **Mitigation**: [How we'll address it]

### Neutral

- [Side effect that is neither positive nor negative]

## Implementation

### Action Items

| Action | Owner | Deadline |
|--------|-------|----------|
| [Task 1] | [Name] | [Date] |
| [Task 2] | [Name] | [Date] |

### Validation Criteria

How we'll know if this decision was correct:
- [Metric or checkpoint 1]
- [Metric or checkpoint 2]

### Review Schedule

- **Initial review**: [Date] — Validate assumptions
- **Follow-up**: [Date] — Assess outcomes

## Related Decisions

- [ADR-XXX: Related Decision](link)
- [ADR-YYY: Superseded Decision](link)

## References

- [Link to relevant documentation]
- [Link to benchmarks or research]
```

### Step 4: Determine ADR Number and Storage

**Numbering**:
- Sequential: ADR-001, ADR-002, ADR-003
- If updating existing: Check for next available number

**Storage Location**:
```
docs/
  adr/
    ADR-001-database-selection.md
    ADR-002-authentication-approach.md
    ADR-003-api-versioning-strategy.md
    index.md  (list of all ADRs)
```

### Step 5: Review and Finalize

After generating, offer:
- "Want me to **add more detail** to the options analysis?"
- "Should I **create a comparison matrix** for the options?"
- "Want me to **identify related ADRs** that should be linked?"
- "Should I **draft the implementation plan** in more detail?"
- "Want me to **generate a summary** for stakeholder communication?"

Save the ADR as a markdown file.

## ADR Templates by Decision Type

### Technology Selection ADR
Focus on: Performance benchmarks, team skills, ecosystem, cost

### Architectural Pattern ADR
Focus on: Trade-offs, scalability, maintainability, team structure

### Security Decision ADR
Focus on: Threat model, compliance, attack vectors, audit requirements

### Integration ADR
Focus on: API contracts, versioning, failure modes, SLAs

### Migration ADR
Focus on: Rollback plan, data migration, feature parity, timeline

## Common ADR Topics

| Category | Examples |
|----------|----------|
| Database | PostgreSQL vs MongoDB, sharding strategy |
| API | REST vs GraphQL, versioning approach |
| Auth | OAuth2 vs SAML, JWT vs sessions |
| Messaging | Kafka vs RabbitMQ, sync vs async |
| Infrastructure | Kubernetes vs ECS, multi-region strategy |
| Architecture | Monolith vs microservices, serverless |
| Testing | Testing strategy, coverage requirements |
| Security | Encryption approach, secrets management |

## Notes

- Write for someone joining the team in 6 months
- Include the options you rejected; it prevents re-evaluation
- Be honest about trade-offs; every decision has downsides
- Status should start as "Proposed" until reviewed
- ADRs are immutable; create new ones to supersede old decisions
- Link related ADRs to build a decision history
- Include quantitative data when available (benchmarks, costs)
- Set review dates to validate the decision was correct
