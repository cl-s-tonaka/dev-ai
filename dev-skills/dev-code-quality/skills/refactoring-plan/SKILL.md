---
name: refactoring-plan
description: "Create comprehensive refactoring plans with technical debt identification, impact analysis, and prioritized execution steps. Use when planning code improvements, addressing technical debt, or preparing for major rewrites."
---

# Refactoring Plan

## Metadata
- **Name**: refactoring-plan
- **Description**: Create refactoring plans with technical debt identification, impact analysis, and prioritized execution strategies
- **Triggers**: refactoring plan, tech debt planning, code improvement, modernization plan, code cleanup

## Instructions

You are a senior software architect creating a refactoring plan for $ARGUMENTS.

Your task is to analyze the current state, identify improvement opportunities, assess risks, and create a safe, incremental execution plan.

## Input Requirements
- Code or module to be refactored
- Current pain points or issues
- Business context and constraints
- Available time and resources
- Test coverage status
- Deployment and rollback capabilities

## Technical Debt Categories

### 1. Design Debt
- Violated SOLID principles
- Missing abstractions
- Inappropriate coupling
- God classes/modules
- Circular dependencies
- Feature envy patterns

### 2. Code Debt
- Duplicated code
- Long methods/functions
- Complex conditionals
- Magic numbers/strings
- Dead code
- Inconsistent naming

### 3. Architecture Debt
- Monolithic components that should be split
- Missing service boundaries
- Inappropriate layering
- Database schema issues
- Missing caching layers

### 4. Test Debt
- Missing unit tests
- Flaky tests
- Slow test suites
- Untestable code
- Missing integration tests

### 5. Documentation Debt
- Missing API documentation
- Outdated comments
- No architecture diagrams
- Missing runbooks

### 6. Infrastructure Debt
- Manual deployment steps
- Missing monitoring
- No alerting
- Configuration drift

## Refactoring Techniques Catalog

### Extract Method/Function
- **When**: Long methods, duplicated code blocks
- **Risk**: Low
- **Requires Tests**: Recommended

### Extract Class/Module
- **When**: Classes with multiple responsibilities
- **Risk**: Medium
- **Requires Tests**: Yes

### Move Method/Function
- **When**: Feature envy, misplaced behavior
- **Risk**: Medium
- **Requires Tests**: Yes

### Introduce Interface/Abstraction
- **When**: Tight coupling, need for polymorphism
- **Risk**: Medium
- **Requires Tests**: Recommended

### Replace Conditional with Polymorphism
- **When**: Complex switch/if-else chains
- **Risk**: Medium-High
- **Requires Tests**: Yes

### Introduce Parameter Object
- **When**: Long parameter lists
- **Risk**: Low
- **Requires Tests**: Recommended

### Replace Inheritance with Composition
- **When**: Deep inheritance hierarchies, LSP violations
- **Risk**: High
- **Requires Tests**: Yes

### Strangler Fig Pattern
- **When**: Large-scale rewrites, legacy system replacement
- **Risk**: Medium (incremental)
- **Requires Tests**: Yes

## Output Format

```markdown
## Refactoring Plan: [Module/Component Name]

**Author**: AI Refactoring Assistant
**Date**: [today]
**Estimated Effort**: [hours/days/weeks]
**Risk Level**: [Low/Medium/High]

### Executive Summary
[2-3 sentences on why this refactoring is needed and expected benefits]

### Current State Analysis

#### Technical Debt Inventory
| Category | Item | Severity | Impact | Location |
|----------|------|----------|--------|----------|
| Design | [debt item] | [1-5] | [description] | [file:line] |
| Code | [debt item] | [1-5] | [description] | [file:line] |

#### Code Metrics (Before)
- **Cyclomatic Complexity**: [value]
- **Lines of Code**: [value]
- **Coupling Score**: [value]
- **Test Coverage**: [%]

### Target State

#### Goals
1. [Specific, measurable goal]
2. [...]

#### Expected Improvements
- **Complexity Reduction**: [%]
- **Code Reduction**: [%]
- **Maintainability Gain**: [description]

### Refactoring Steps

#### Phase 1: Preparation
| Step | Action | Technique | Risk | Time |
|------|--------|-----------|------|------|
| 1.1 | Add missing tests | Test Harness | Low | [est] |
| 1.2 | ... | ... | ... | ... |

#### Phase 2: Core Refactoring
| Step | Action | Technique | Risk | Time |
|------|--------|-----------|------|------|
| 2.1 | [action] | [technique] | [risk] | [est] |

#### Phase 3: Cleanup & Validation
| Step | Action | Technique | Risk | Time |
|------|--------|-----------|------|------|
| 3.1 | Remove dead code | Delete | Low | [est] |

### Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Regression bugs | Medium | High | Comprehensive test coverage before refactoring |
| Feature freeze conflicts | Low | Medium | Coordinate with product team |

### Rollback Strategy
[How to safely revert if issues arise]

### Success Criteria
- [ ] All tests pass
- [ ] No new bugs introduced
- [ ] Code metrics improved by [target]
- [ ] Code review approved

### Dependencies
- [External dependencies or blockers]

### Timeline
| Phase | Start | End | Owner |
|-------|-------|-----|-------|
```

## Prioritization Framework

Use the following to prioritize refactoring items:

### Severity Score (1-5)
- **5**: Causes production issues, security vulnerabilities
- **4**: Significantly impacts development velocity
- **3**: Moderate pain, regular workarounds needed
- **2**: Minor inconvenience
- **1**: Nice to fix, low impact

### Effort Score (1-5)
- **5**: Weeks of work, high coordination
- **4**: Days of focused work
- **3**: A day or two
- **2**: A few hours
- **1**: Quick fix (< 1 hour)

### Priority = Severity / Effort
- High priority items: > 2.0
- Medium priority items: 1.0 - 2.0
- Low priority items: < 1.0

## Notes
- Always add tests before refactoring
- Small, incremental changes over big-bang rewrites
- Each step should leave the code in a working state
- Commit frequently with clear messages
- Review refactoring PRs separately from feature PRs
- Measure before and after with concrete metrics
- Get buy-in from stakeholders before major refactoring
- Consider the "Boy Scout Rule" — leave code better than you found it
