---
name: trade-off-analysis
description: "Evaluate technology choices and architectural decisions using weighted criteria analysis with pros, cons, risk assessment, and recommendations. Use when selecting technologies, comparing approaches, or making build vs buy decisions."
---

# Trade-off Analysis

## Metadata
- **Name**: trade-off-analysis
- **Description**: Evaluate technology choices using weighted criteria analysis with structured pros/cons and risk assessment.
- **Triggers**: trade-off analysis, technology selection, build vs buy, architecture comparison, decision matrix

## Instructions

You are a technical advisor evaluating trade-offs for $ARGUMENTS.

Your task is to provide a structured, objective analysis of options with clear criteria, scoring, and recommendations.

## Input Requirements
- Decision context and goals
- Options to evaluate
- Stakeholder priorities
- Constraints (budget, timeline, skills)
- Risk tolerance
- Long-term considerations

## Trade-off Analysis Template

### 1. Decision Context

```markdown
**Decision**: [What are we deciding?]
**Background**: [Why is this decision needed now?]
**Scope**: [What does this decision affect?]
**Timeline**: [When must we decide?]
**Stakeholders**: [Who is affected?]
**Decision Maker**: [Who has final authority?]
```

### 2. Evaluation Criteria

**Criteria Definition**
| Criterion | Description | Weight | Priority |
|-----------|-------------|--------|----------|
| Performance | Response time, throughput | 25% | Critical |
| Scalability | Handle 10x growth | 20% | High |
| Cost | TCO over 3 years | 20% | High |
| Maintainability | Ease of updates | 15% | Medium |
| Security | Compliance requirements | 10% | Medium |
| Time to Market | Implementation speed | 10% | Medium |

**Scoring Scale**
| Score | Meaning |
|-------|---------|
| 5 | Excellent - Exceeds requirements |
| 4 | Good - Meets all requirements |
| 3 | Acceptable - Meets most requirements |
| 2 | Poor - Significant gaps |
| 1 | Unacceptable - Does not meet requirements |

### 3. Option Analysis

**Option A: [Name]**
```markdown
Description: [Brief description]

Pros:
+ [Advantage 1]
+ [Advantage 2]
+ [Advantage 3]

Cons:
- [Disadvantage 1]
- [Disadvantage 2]

Unknowns:
? [What we don't know yet]
? [Assumptions to validate]

Risks:
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | Medium | High | [Action] |

Effort: [Low / Medium / High]
Cost: [$X initial + $Y/year]
```

### 4. Decision Matrix

| Criterion | Weight | Option A | Option B | Option C |
|-----------|--------|----------|----------|----------|
| Performance | 25% | 4 (1.00) | 5 (1.25) | 3 (0.75) |
| Scalability | 20% | 5 (1.00) | 4 (0.80) | 3 (0.60) |
| Cost | 20% | 3 (0.60) | 2 (0.40) | 5 (1.00) |
| Maintainability | 15% | 4 (0.60) | 3 (0.45) | 4 (0.60) |
| Security | 10% | 4 (0.40) | 4 (0.40) | 3 (0.30) |
| Time to Market | 10% | 3 (0.30) | 4 (0.40) | 5 (0.50) |
| **Total** | **100%** | **3.90** | **3.70** | **3.75** |

### 5. Cost Analysis

**Total Cost of Ownership (3 Years)**
| Cost Category | Option A | Option B | Option C |
|---------------|----------|----------|----------|
| Initial Implementation | $100K | $150K | $50K |
| Annual License/Hosting | $30K | $20K | $10K |
| Maintenance (FTE) | 0.5 ($60K) | 0.3 ($36K) | 1.0 ($120K) |
| Training | $10K | $20K | $5K |
| **3-Year TCO** | **$280K** | **$278K** | **$185K** |

### 6. Risk Assessment

**Risk Matrix**
```
        Impact
        Low    Medium    High
Prob
High     |  3  |   2   |  1  |
Medium   |  4  |   3   |  2  |
Low      |  5  |   4   |  3  |

1 = Critical (Blocker)
2 = High (Address before decision)
3 = Medium (Monitor and mitigate)
4 = Low (Accept)
5 = Negligible (Ignore)
```

**Risk Comparison**
| Option | Critical | High | Medium | Total Risk Score |
|--------|----------|------|--------|------------------|
| Option A | 0 | 1 | 2 | 4 |
| Option B | 1 | 0 | 3 | 6 |
| Option C | 0 | 2 | 1 | 5 |

### 7. Sensitivity Analysis

**What if priorities change?**

| Scenario | Weight Shift | Winner |
|----------|--------------|--------|
| Cost focus | Cost: 40% | Option C |
| Performance focus | Performance: 40% | Option B |
| Speed focus | Time to Market: 30% | Option C |
| Risk averse | Security: 25% | Option A |

### 8. Build vs Buy Framework

| Factor | Build | Buy | Hybrid |
|--------|-------|-----|--------|
| Time to market | Slow | Fast | Medium |
| Customization | Full | Limited | Partial |
| Initial cost | High | Low | Medium |
| Ongoing cost | Medium | High | Medium |
| Risk | High | Low | Medium |
| Control | Full | Limited | Partial |
| Differentiation | Yes | No | Partial |

**Decision Guidance**
- **Build**: Core differentiator, unique requirements, long-term investment
- **Buy**: Commodity functionality, time pressure, proven solutions
- **Hybrid**: Extend vendor solution with custom integration

### 9. Common Trade-off Patterns

**CAP Theorem (Distributed Systems)**
Choose two:
- **Consistency**: All nodes see same data
- **Availability**: Every request gets response
- **Partition Tolerance**: System works despite network failures

| Database Type | Prioritizes |
|---------------|-------------|
| Traditional RDBMS | CA (single node) |
| MongoDB, Cassandra | AP |
| HBase, Redis Cluster | CP |

**Speed vs Quality**
| Approach | Speed | Quality | Use When |
|----------|-------|---------|----------|
| MVP | Fast | Lower | Validating hypothesis |
| Iterative | Medium | Medium | Continuous improvement |
| Big Bang | Slow | Higher | Regulated industries |

**Coupling vs Autonomy**
| Approach | Coupling | Autonomy | Trade-off |
|----------|----------|----------|-----------|
| Monolith | High | Low | Simple, fast early |
| Microservices | Low | High | Complex, scalable |
| Modular Monolith | Medium | Medium | Balanced |

### 10. Recommendation

```markdown
## Recommendation

**Recommended Option**: [Option X]

**Rationale**:
1. [Primary reason aligned with key criteria]
2. [Secondary reason]
3. [Risk consideration]

**Conditions**:
- This recommendation assumes [assumption 1]
- Contingent on [condition 1]

**Next Steps**:
1. [Action item 1] - Owner: [Name] - By: [Date]
2. [Action item 2] - Owner: [Name] - By: [Date]

**Review Point**:
- Revisit this decision in [timeframe] to validate assumptions
```

## Analysis Techniques

**Pros/Cons List**
Simple enumeration of advantages and disadvantages.

**Decision Matrix**
Weighted scoring across multiple criteria.

**Force Field Analysis**
Map forces driving change vs forces resisting change.

**Six Thinking Hats**
- White: Facts and data
- Red: Emotions and intuition
- Black: Risks and caution
- Yellow: Benefits and optimism
- Green: Creativity and alternatives
- Blue: Process and next steps

## Output Process
1. Define the decision and context
2. Identify evaluation criteria and weights
3. Enumerate options with pros/cons
4. Score options against criteria
5. Perform cost analysis
6. Assess risks for each option
7. Run sensitivity analysis
8. Formulate recommendation
9. Document for future reference

## Notes
- Perfect information is rare; decide with 70% confidence
- Reversibility matters; prefer reversible decisions
- Document the "why" for future reference
- Include dissenting opinions
- Set review checkpoints to validate the decision
- Avoid analysis paralysis; time-box the analysis
- Consider second-order effects
