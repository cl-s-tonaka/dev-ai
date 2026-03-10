---
description: Comprehensive code review covering quality, security, performance, and maintainability
argument-hint: "<file path, code block, or PR description>"
---

# /review -- Comprehensive Code Review

Perform a thorough code review evaluating code quality, security, performance, and maintainability in a single pass.

## Invocation

```
/review src/services/UserService.ts
/review [paste code block]
/review PR #123 - User authentication refactoring
/review              # prompts for code to review
```

## Workflow

### Step 1: Accept Review Input

Accept code in any form:
- File path(s) to review
- Pasted code block
- PR number or description
- Git diff
- Module or directory for broader review

If a file path is provided, read the file. If multiple files, read all.

### Step 2: Understand Context

Before reviewing, establish context:

1. **Purpose**: What does this code do? What problem does it solve?
2. **Scope**: Is this new code, a refactor, a bug fix, or optimization?
3. **Risk**: Is this a critical path (auth, payments, data integrity)?
4. **Standards**: Any team conventions or coding standards to follow?

If context is unclear, ask one focused question.

### Step 3: Multi-Dimensional Review

Apply relevant skills in parallel:

**A. Code Quality (code-review skill)**
- SOLID principles compliance
- Clean code adherence
- Readability and maintainability
- Naming and structure

**B. Security Scan**
- Input validation
- Authentication/authorization checks
- SQL injection, XSS, CSRF risks
- Sensitive data handling
- Secret exposure

**C. Performance Analysis (performance-review skill)**
- Algorithmic complexity
- Database query efficiency (N+1, missing indexes)
- Memory management
- I/O patterns

**D. Complexity Check (complexity-analysis skill)**
- Cyclomatic complexity
- Cognitive complexity
- Nesting depth
- Function/file length

**E. Code Smells (code-smell-detection skill)**
- Bloaters (long methods, large classes)
- Object-orientation abusers
- Change preventers
- Couplers

### Step 4: Generate Review Report

```markdown
## Code Review: [File/Module Name]

**Reviewer**: AI Code Review Assistant
**Date**: [today]
**Verdict**: [Approve | Approve with Comments | Request Changes | Block]

---

### Summary
[2-3 sentence executive summary of code quality]

### Scores
| Dimension | Score | Status |
|-----------|-------|--------|
| Code Quality | [/10] | [emoji] |
| Security | [/10] | [emoji] |
| Performance | [/10] | [emoji] |
| Maintainability | [/10] | [emoji] |
| **Overall** | [/10] | [verdict] |

---

### Must Fix (Blocking)
These issues must be addressed before merge:

#### 1. [Issue Title]
- **Location**: [file:line]
- **Category**: [Security/Performance/Quality]
- **Why**: [Clear explanation of the risk/problem]

**Current:**
```[language]
[problematic code]
```

**Suggested:**
```[language]
[fixed code]
```

---

### Should Fix (High Priority)
Not blocking, but strongly recommended:

| Issue | Location | Category | Impact |
|-------|----------|----------|--------|
| [issue] | [file:line] | [category] | [impact] |

---

### Consider (Nice to Have)
Minor improvements for future:

| Suggestion | Location | Rationale |
|------------|----------|-----------|
| [suggestion] | [file:line] | [why] |

---

### Positive Observations
What's working well:
- [Positive pattern or practice observed]
- [Good design decision]
- [Clean implementation area]

---

### SOLID Compliance
| Principle | Status | Notes |
|-----------|--------|-------|
| Single Responsibility | [Pass/Warn/Fail] | [notes] |
| Open/Closed | [Pass/Warn/Fail] | [notes] |
| Liskov Substitution | [Pass/Warn/Fail] | [notes] |
| Interface Segregation | [Pass/Warn/Fail] | [notes] |
| Dependency Inversion | [Pass/Warn/Fail] | [notes] |

---

### Security Checklist
- [ ] Input validation present
- [ ] No SQL injection risks
- [ ] No XSS vulnerabilities
- [ ] Auth/authz checks in place
- [ ] No hardcoded secrets
- [ ] Sensitive data handled properly

---

### Metrics
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Cyclomatic Complexity (max) | [n] | <10 | [status] |
| Cognitive Complexity (max) | [n] | <15 | [status] |
| Lines of Code | [n] | <300 | [status] |
| Nesting Depth (max) | [n] | <4 | [status] |

---

### Next Steps
1. [Prioritized action item]
2. [Second priority]
3. [Third priority]
```

### Step 5: Offer Follow-ups

After the review, offer:
- "Want me to **fix the blocking issues** and show you the changes?"
- "Should I **generate unit tests** for the reviewed code?"
- "Want a **refactoring plan** for the medium-priority issues?"
- "Should I **check related files** that might be affected?"

## Review Principles

1. **Be constructive**: Suggest solutions, not just problems
2. **Prioritize ruthlessly**: Not everything needs to be perfect
3. **Consider context**: Startup MVP vs. enterprise production code
4. **Focus on patterns**: Address systemic issues, not just symptoms
5. **Acknowledge good work**: Positive feedback matters

## Verdict Guidelines

| Verdict | When to Use |
|---------|-------------|
| **Approve** | No issues, or only trivial suggestions |
| **Approve with Comments** | Minor issues that don't block merge |
| **Request Changes** | Issues that should be fixed before merge |
| **Block** | Security vulnerabilities, critical bugs, or fundamental design problems |

## Notes

- For large PRs, focus on the most impactful changes first
- Security issues always take priority
- Performance matters most in hot paths
- Clean code matters most in frequently-modified areas
- When uncertain about intent, ask before assuming it's wrong
- Save review results as markdown for PR comments or documentation
