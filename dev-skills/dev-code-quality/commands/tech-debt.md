---
description: Technical debt visualization, prioritization, and repayment planning
argument-hint: "<codebase, module, or area to analyze>"
---

# /tech-debt -- Technical Debt Analysis & Planning

Visualize technical debt across your codebase, prioritize by business impact, and create actionable repayment plans.

## Invocation

```
/tech-debt src/
/tech-debt Analyze the payment processing module
/tech-debt What's our tech debt situation in the auth layer?
/tech-debt              # analyzes current directory or prompts for scope
```

## Workflow

### Step 1: Define Scope

Accept input as:
- Directory or module path
- Description of area to analyze
- Specific concern ("we keep having bugs in X")
- Full codebase scan request

If scope is unclear, ask:
- "What area should I focus on?"
- "Any specific concerns driving this analysis?"

### Step 2: Multi-Dimensional Debt Analysis

Apply diagnostic skills across the codebase:

**A. Code Quality Debt**
Apply **code-smell-detection** and **clean-code-check** skills:
- Duplicated code
- Long methods/classes
- Complex conditionals
- Poor naming
- Missing abstractions

**B. Architectural Debt**
Apply **dependency-analysis** skill:
- Circular dependencies
- Layer violations
- Inappropriate coupling
- Missing boundaries
- Monolithic components

**C. Complexity Debt**
Apply **complexity-analysis** skill:
- High cyclomatic complexity
- Deep nesting
- Large files
- Complex conditionals

**D. Test Debt**
- Missing unit tests
- Missing integration tests
- Flaky tests
- Slow test suites
- Untestable code

**E. Documentation Debt**
- Missing API docs
- Outdated comments
- No architecture docs
- Missing runbooks

**F. Dependency Debt**
- Outdated packages
- Security vulnerabilities
- Unmaintained dependencies
- Duplicate dependencies

### Step 3: Generate Debt Inventory

```markdown
## Technical Debt Report: [Scope]

**Analysis Date**: [today]
**Analyzed By**: AI Tech Debt Analyzer
**Total Debt Items**: [count]
**Estimated Effort**: [hours/days/weeks]

---

### Executive Summary

[3-4 sentence overview of debt situation, key risks, and recommended priorities]

---

### Debt Health Score

| Category | Score | Grade | Trend |
|----------|-------|-------|-------|
| Code Quality | [/100] | [A-F] | [up/down/stable] |
| Architecture | [/100] | [A-F] | [up/down/stable] |
| Complexity | [/100] | [A-F] | [up/down/stable] |
| Test Coverage | [/100] | [A-F] | [up/down/stable] |
| Dependencies | [/100] | [A-F] | [up/down/stable] |
| **Overall** | [/100] | [A-F] | [trend] |

---

### Debt by Category

#### Code Quality Debt
| Issue | Location | Severity | Effort | Interest |
|-------|----------|----------|--------|----------|
| Long method (>100 lines) | [file:line] | High | 2h | High |
| Duplicate code block | [files] | Medium | 4h | Medium |

**Subtotal**: [n] items, [effort] estimated

#### Architectural Debt
| Issue | Location | Severity | Effort | Interest |
|-------|----------|----------|--------|----------|
| Circular dependency | [A ↔ B] | Critical | 8h | Critical |
| Layer violation | [file] | Medium | 2h | Low |

**Subtotal**: [n] items, [effort] estimated

#### Complexity Debt
| Issue | Location | Complexity | Effort | Interest |
|-------|----------|------------|--------|----------|
| Complex function | [file:func] | CC=25 | 4h | High |
| Deep nesting (5+) | [file:line] | Depth=6 | 2h | Medium |

**Subtotal**: [n] items, [effort] estimated

#### Test Debt
| Issue | Location | Coverage | Effort | Interest |
|-------|----------|----------|--------|----------|
| No unit tests | [module] | 0% | 8h | Critical |
| Flaky test | [test file] | - | 2h | High |

**Subtotal**: [n] items, [effort] estimated

#### Dependency Debt
| Issue | Package | Current | Latest | Risk |
|-------|---------|---------|--------|------|
| Outdated (major) | [pkg] | 2.x | 5.x | High |
| Security vuln | [pkg] | [ver] | [fix] | Critical |

**Subtotal**: [n] items, [effort] estimated

---

### Debt Distribution Visualization

```
Debt by Severity:
Critical [========] 15%
High     [================] 30%
Medium   [====================] 40%
Low      [========] 15%

Debt by Category:
Code Quality  [==================] 35%
Architecture  [==========] 20%
Complexity    [============] 25%
Tests         [======] 12%
Dependencies  [====] 8%
```

---

### Hotspots (High Debt Concentration)

| File/Module | Debt Items | Severity | Change Frequency |
|-------------|------------|----------|------------------|
| [file] | [n] | Critical | High |
| [file] | [n] | High | Medium |

---

### Interest Analysis

**What is "interest"?** The ongoing cost of NOT fixing the debt:
- Developer time wasted working around issues
- Bug frequency in affected areas
- Onboarding time for new team members
- Velocity reduction

| Debt Item | Principal | Monthly Interest | Break-even |
|-----------|-----------|------------------|------------|
| [item] | 4h to fix | 1h/month wasted | 4 months |
| [item] | 8h to fix | 0.5h/month | 16 months |
```

### Step 4: Prioritization Framework

Apply prioritization using multiple lenses:

**RICE-like Scoring:**
- **Reach**: How much of the codebase/team is affected?
- **Impact**: How painful is this debt daily?
- **Confidence**: How sure are we of the estimate?
- **Effort**: How long will it take to fix?

**Score = (Reach × Impact × Confidence) / Effort**

**Priority Matrix:**

```
                High Impact
                    │
    ┌───────────────┼───────────────┐
    │   Quick Wins  │   Strategic   │
    │   (Do First)  │   (Plan For)  │
Low ├───────────────┼───────────────┤ High
Effort │   Ignore     │   Negotiate   │ Effort
    │   (Backlog)   │   (Careful)   │
    │               │               │
    └───────────────┼───────────────┘
                    │
                Low Impact
```

```markdown
---

### Prioritized Repayment Plan

#### Quick Wins (High Impact, Low Effort)
Do these first — immediate velocity gains.

| # | Item | Effort | Impact | Owner | Sprint |
|---|------|--------|--------|-------|--------|
| 1 | [item] | 2h | High | [TBD] | Next |
| 2 | [item] | 1h | Medium | [TBD] | Next |

#### Strategic Investments (High Impact, High Effort)
Plan these into roadmap — significant long-term gains.

| # | Item | Effort | Impact | Dependencies | Timeline |
|---|------|--------|--------|--------------|----------|
| 1 | [item] | 2w | Critical | [deps] | Q2 |
| 2 | [item] | 1w | High | [deps] | Q3 |

#### Backlog (Low Impact, Low Effort)
Handle opportunistically during related work.

| # | Item | Effort | When to Address |
|---|------|--------|-----------------|
| 1 | [item] | 1h | When touching [file] |

#### Deferred (Low Impact, High Effort)
Not worth addressing now — revisit if situation changes.

| # | Item | Why Deferred |
|---|------|--------------|
| 1 | [item] | Impact doesn't justify effort |

---

### Repayment Strategy

#### Option A: Dedicated Debt Sprints
- Allocate 1 sprint per quarter for debt reduction
- Focus on strategic investments
- **Pros**: Focused progress, visible commitment
- **Cons**: Competes with feature work

#### Option B: Continuous Allocation (20% Rule)
- Reserve 20% of each sprint for debt
- Address quick wins and opportunistic fixes
- **Pros**: Steady progress, less visible
- **Cons**: May lose focus, harder to track

#### Option C: Boy Scout Rule + Quick Wins
- Always leave code better than you found it
- Plus: 2 hours per developer per sprint on quick wins
- **Pros**: Low overhead, cultural change
- **Cons**: Slow progress on strategic items

**Recommendation**: [Based on debt severity and team context]

---

### Implementation Roadmap

#### Month 1: Foundation
- [ ] Address all critical security vulnerabilities
- [ ] Complete quick wins list
- [ ] Add tests to highest-churn untested files

#### Month 2-3: Stabilization
- [ ] Fix circular dependencies
- [ ] Break up top 3 god classes
- [ ] Reduce max complexity to <15

#### Month 4-6: Optimization
- [ ] Address remaining high-priority items
- [ ] Update all outdated dependencies
- [ ] Achieve 70% test coverage on core modules

---

### Tracking & Metrics

| Metric | Current | Target (3mo) | Target (6mo) |
|--------|---------|--------------|--------------|
| Debt Items | [n] | [n] | [n] |
| Avg Complexity | [n] | [n] | [n] |
| Test Coverage | [%] | [%] | [%] |
| Outdated Deps | [n] | [n] | 0 |
| Critical Items | [n] | 0 | 0 |

---

### Prevention Strategies

1. **Quality Gates**: Block PRs with complexity > 10
2. **Dependency Updates**: Monthly automation
3. **Code Review**: Check for new debt introduction
4. **Refactoring Budget**: 20% of each sprint
5. **Debt Retrospectives**: Quarterly debt review
```

### Step 5: Offer Follow-ups

After generating the report, offer:
- "Want me to **create tickets** for the high-priority items?"
- "Should I **generate a refactoring plan** for a specific item?"
- "Want me to **set up quality gates** recommendations for CI/CD?"
- "Should I **analyze a different area** of the codebase?"
- "Want me to **export this as a stakeholder presentation**?"

## Debt Categorization Guide

### Severity Levels
| Level | Definition | Action |
|-------|------------|--------|
| Critical | Blocks development, causes production issues | Fix immediately |
| High | Significant velocity impact, frequent pain | Plan within 1-2 sprints |
| Medium | Noticeable friction, occasional pain | Address within quarter |
| Low | Minor inconvenience, rare impact | Opportunistic fixes |

### Effort Estimates
| Level | Hours | Team Impact |
|-------|-------|-------------|
| Trivial | <1h | Individual task |
| Small | 1-4h | Individual task |
| Medium | 4-16h | 1-2 days focused work |
| Large | 2-5 days | Sprint commitment |
| Epic | >1 week | Roadmap item |

## Notes

- Technical debt is not inherently bad — it's a tool (like financial debt)
- The goal is managing debt, not eliminating it entirely
- Some debt is intentional (speed to market) — document it
- Old debt in stable code may not be worth fixing
- New debt in active code should be prioritized
- Communicate debt status to stakeholders regularly
- Celebrate debt payoffs — visibility encourages good behavior
