---
name: architecture-decision-record
description: "Create an Architecture Decision Record (ADR) documenting the context, decision, consequences, and alternatives for significant technical decisions. Use when making technology choices, architectural changes, or establishing technical standards."
---

# Architecture Decision Record (ADR)

## Metadata
- **Name**: architecture-decision-record
- **Description**: Document architectural decisions with context, rationale, consequences, and alternatives using the ADR format.
- **Triggers**: ADR, architecture decision, technical decision, RFC, design decision

## Instructions

You are a software architect documenting an Architecture Decision Record for $ARGUMENTS.

Your task is to create a clear, comprehensive record that captures the decision context, rationale, and implications for future reference and team alignment.

## Input Requirements
- Decision topic or question to be addressed
- Current system context and constraints
- Stakeholders affected by the decision
- Timeline or urgency factors
- Previous related decisions (if any)
- Options being considered

## ADR Template

```markdown
# ADR-[NUMBER]: [TITLE]

**Status**: [Proposed | Accepted | Deprecated | Superseded by ADR-XXX]
**Date**: [YYYY-MM-DD]
**Decision Makers**: [Names and roles]
**Consulted**: [Names and roles]
**Informed**: [Teams or individuals]

## Context

[Describe the issue motivating this decision. What is the current situation? What forces are at play? Include:]

- Business context and drivers
- Technical context and constraints
- Timeline pressures
- Related decisions or dependencies
- Relevant metrics or data

## Decision Drivers

[List the key factors influencing this decision:]

- [Driver 1]: [Description and importance]
- [Driver 2]: [Description and importance]
- [Driver 3]: [Description and importance]

## Considered Options

### Option 1: [Name]
**Description**: [Brief description of this option]

**Pros**:
- [Advantage 1]
- [Advantage 2]

**Cons**:
- [Disadvantage 1]
- [Disadvantage 2]

**Effort**: [Low | Medium | High]
**Risk**: [Low | Medium | High]

### Option 2: [Name]
[Same structure as Option 1]

### Option 3: [Name]
[Same structure as Option 1]

## Decision

[State the decision clearly and unambiguously]

We will [do X] because [primary reason].

### Rationale

[Explain why this option was chosen over others:]

1. [Reason 1 with supporting evidence]
2. [Reason 2 with supporting evidence]
3. [Reason 3 with supporting evidence]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

### Negative
- [Drawback 1 and mitigation strategy]
- [Drawback 2 and mitigation strategy]

### Neutral
- [Side effect that is neither positive nor negative]

## Implementation

### Action Items
| Action | Owner | Deadline |
|--------|-------|----------|
| [Task 1] | [Name] | [Date] |
| [Task 2] | [Name] | [Date] |

### Validation Criteria
- [How we'll know if this decision was correct]
- [Metrics to track]
- [Review checkpoint]

## Related Decisions

- [ADR-XXX]: [Brief description of relationship]
- [ADR-YYY]: [Brief description of relationship]

## References

- [Link to relevant documentation]
- [Link to research or benchmarks]
- [Link to external resources]

## Notes

[Any additional context, caveats, or future considerations]
```

## ADR Lifecycle States

| State | Meaning |
|-------|---------|
| **Proposed** | Under discussion, not yet approved |
| **Accepted** | Approved and in effect |
| **Deprecated** | No longer recommended but not replaced |
| **Superseded** | Replaced by a newer ADR |

## Output Process
1. Identify the decision to be documented
2. Gather context from stakeholders
3. List all viable options with honest pros/cons
4. Facilitate decision-making discussion
5. Document the chosen option and rationale
6. Identify consequences (positive, negative, neutral)
7. Define implementation actions
8. Set review checkpoints
9. Store in version control with the codebase

## Best Practices

### Writing Style
- Use active voice and clear language
- Be specific about trade-offs
- Include quantitative data when available
- Avoid jargon without explanation
- Write for someone joining the team in 6 months

### Decision Criteria
- Reversibility: Can we change this later?
- Impact: How many systems/teams affected?
- Cost: Implementation and ongoing
- Risk: What could go wrong?
- Alignment: Fits with existing architecture?

### Common ADR Topics
- Technology selection (database, framework, language)
- Architectural patterns (monolith vs microservices)
- API design decisions (REST vs GraphQL)
- Authentication mechanisms
- Data storage strategies
- Integration patterns
- Testing strategies
- Deployment approaches

## Notes
- ADRs are immutable records; create new ADRs to supersede old ones
- Store ADRs alongside the code they affect (e.g., `docs/adr/`)
- Number ADRs sequentially for easy reference
- Link related ADRs to build a decision history
- Review ADRs periodically to verify they still apply
- Include failed options to prevent re-evaluation
