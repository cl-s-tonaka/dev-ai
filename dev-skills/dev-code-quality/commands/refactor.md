---
description: Refactoring workflow — analyze, plan, execute, and verify code improvements safely
argument-hint: "<module, file, or code area to refactor>"
---

# /refactor -- Safe Refactoring Workflow

A structured approach to refactoring: analyze the current state, create a plan, execute incrementally, and verify the results.

## Invocation

```
/refactor src/services/PaymentService.ts
/refactor The authentication module is getting hard to maintain
/refactor [paste complex code that needs cleanup]
/refactor              # prompts for what to refactor
```

## Workflow

### Phase 1: Analysis

**Step 1.1: Understand the Target**

Accept input in any form:
- Specific file or module path
- Problem description ("X is getting hard to maintain")
- Code snippet that needs improvement
- A class or function that's grown too complex

If a path is provided, read the file(s).

**Step 1.2: Assess Current State**

Apply diagnostic skills:

1. **Complexity Analysis** (complexity-analysis skill)
   - Measure cyclomatic and cognitive complexity
   - Identify most complex functions
   - Check nesting depth and file length

2. **Code Smell Detection** (code-smell-detection skill)
   - Identify bloaters, OO abusers, couplers
   - Map out duplicate code
   - Find change preventers

3. **Dependency Analysis** (dependency-analysis skill)
   - Check for circular dependencies
   - Assess coupling metrics
   - Identify hidden dependencies

4. **Clean Code Check** (clean-code-check skill)
   - Naming quality
   - Function/class size
   - SOLID compliance

**Step 1.3: Document Current State**

```markdown
## Refactoring Analysis: [Target Name]

### Current State Summary
[2-3 sentences describing the main issues]

### Metrics (Before)
| Metric | Value | Target | Gap |
|--------|-------|--------|-----|
| Cyclomatic Complexity (max) | [n] | <10 | [gap] |
| Cognitive Complexity (max) | [n] | <15 | [gap] |
| Lines of Code | [n] | <200 | [gap] |
| Code Smells | [n] | 0 | [gap] |
| Test Coverage | [%] | >80% | [gap] |

### Technical Debt Inventory
| Category | Issue | Severity | Location |
|----------|-------|----------|----------|
| [type] | [issue] | [1-5] | [file:line] |

### Root Causes
1. [Why the code became problematic]
2. [Contributing factors]

### Impact of Current State
- [Development velocity impact]
- [Bug frequency]
- [Onboarding difficulty]
```

---

### Phase 2: Planning

**Step 2.1: Define Goals**

Establish clear refactoring objectives:
- What specific improvements are needed?
- What metrics should change?
- What's the definition of done?

**Step 2.2: Choose Refactoring Strategy**

Based on the analysis, recommend approach:

| Situation | Strategy |
|-----------|----------|
| High complexity functions | Extract Method, Decompose Conditional |
| Large class | Extract Class, Move Method |
| Duplicate code | Extract Method, Pull Up Method |
| Long parameter lists | Introduce Parameter Object |
| Feature envy | Move Method to appropriate class |
| Circular dependencies | Extract interface, dependency injection |
| Switch statements | Replace Conditional with Polymorphism |
| Deep nesting | Guard clauses, early returns |

**Step 2.3: Create Execution Plan**

Apply the **refactoring-plan** skill:

```markdown
## Refactoring Plan

### Goals
1. [Measurable goal]
2. [Measurable goal]

### Prerequisites
- [ ] Tests exist for affected code
- [ ] CI/CD pipeline is green
- [ ] Team is aware of refactoring
- [ ] No critical deployments pending

### Execution Steps

#### Phase A: Preparation
| Step | Action | Risk | Time |
|------|--------|------|------|
| A.1 | Add tests for [uncovered paths] | Low | [est] |
| A.2 | Document current behavior | Low | [est] |

#### Phase B: Core Refactoring
| Step | Action | Technique | Risk | Time |
|------|--------|-----------|------|------|
| B.1 | [action] | [technique] | [risk] | [est] |
| B.2 | [action] | [technique] | [risk] | [est] |

#### Phase C: Cleanup
| Step | Action | Risk | Time |
|------|--------|------|------|
| C.1 | Remove dead code | Low | [est] |
| C.2 | Update documentation | Low | [est] |

### Commit Strategy
- Commit after each step
- Each commit should leave code in working state
- Use clear commit messages: "refactor: [what was done]"

### Rollback Plan
[How to safely revert if issues arise]

### Success Criteria
- [ ] All tests pass
- [ ] Complexity reduced to target
- [ ] No new code smells introduced
- [ ] Code review approved
```

**Step 2.4: Confirm with User**

Before executing, confirm:
- "Here's the refactoring plan. Should I proceed with execution?"
- "Would you like to adjust the scope or priorities?"
- "Any tests or documentation I should add first?"

---

### Phase 3: Execution

**Step 3.1: Pre-flight Checks**
- Verify tests pass
- Create feature branch (if not already on one)
- Ensure clean working directory

**Step 3.2: Execute Incrementally**

For each refactoring step:

1. **Show the change** before applying:
   ```
   // Before
   [original code]

   // After
   [refactored code]
   ```

2. **Apply the change** (with user confirmation if substantial)

3. **Verify**:
   - Does the code still work?
   - Do tests pass?
   - Is complexity reduced?

4. **Commit** with clear message:
   ```
   refactor(payment): extract calculateDiscount method

   - Reduces cyclomatic complexity of processPayment from 12 to 6
   - Improves testability of discount logic
   ```

**Step 3.3: Handle Issues**

If a step fails:
- Stop and assess
- Offer to rollback to last good state
- Adjust plan if needed

---

### Phase 4: Verification

**Step 4.1: Validate Results**

```markdown
## Refactoring Results

### Metrics Comparison
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Cyclomatic Complexity | [n] | [n] | [delta] |
| Cognitive Complexity | [n] | [n] | [delta] |
| Lines of Code | [n] | [n] | [delta] |
| Code Smells | [n] | [n] | [delta] |
| Test Coverage | [%] | [%] | [delta] |

### Goals Achievement
| Goal | Status | Notes |
|------|--------|-------|
| [goal 1] | [achieved/partial/missed] | [notes] |

### Code Quality Improvements
- [Specific improvement 1]
- [Specific improvement 2]

### Changes Made
| Commit | Description |
|--------|-------------|
| [hash] | [description] |

### Remaining Items (if any)
- [Items deferred to future work]
```

**Step 4.2: Post-Refactoring Actions**

Offer follow-ups:
- "Want me to **run a final code review** on the refactored code?"
- "Should I **add more tests** for the new structure?"
- "Want me to **update documentation** to reflect the changes?"
- "Should I **create a PR** with these changes?"

## Safety Principles

1. **Always have tests first** — if no tests exist, add them before refactoring
2. **Small steps** — each change should be reversible
3. **Run tests after each step** — never batch risky changes
4. **Commit frequently** — preserve working states
5. **Don't mix refactoring and features** — keep them separate

## Notes

- Refactoring should not change external behavior
- If you find bugs during refactoring, fix them in separate commits
- Large refactorings may span multiple sessions — save progress
- Prefer automated refactoring tools when available (IDE support)
- Document "why" in commit messages, not just "what"
- Consider the team — communicate large refactorings before starting
