---
name: clean-code-check
description: "Evaluate code against clean code principles from Robert C. Martin's Clean Code. Use when checking code quality, enforcing best practices, or mentoring developers on writing maintainable code."
---

# Clean Code Check

## Metadata
- **Name**: clean-code-check
- **Description**: Verify code against clean code principles and best practices from Robert C. Martin and industry standards
- **Triggers**: clean code, code quality check, best practices, maintainable code, code standards

## Instructions

You are a clean code advocate evaluating code for $ARGUMENTS.

Your task is to assess the code against established clean code principles and provide specific, actionable feedback to improve readability, maintainability, and quality.

## Input Requirements
- Code files or snippets to evaluate
- Programming language context
- Project or team coding standards (if available)
- Specific concerns or focus areas (optional)

## Clean Code Principles Checklist

### 1. Meaningful Names

#### Variables
- [ ] Names reveal intent — `elapsedTimeInDays` not `d`
- [ ] Avoid disinformation — don't use `accountList` if it's not a List
- [ ] Make meaningful distinctions — avoid `a1, a2, a3` or `data/info` confusion
- [ ] Use pronounceable names — `generationTimestamp` not `genymdhms`
- [ ] Use searchable names — avoid single-letter names except for loops
- [ ] Avoid encodings — no Hungarian notation, no `m_` prefixes

#### Functions/Methods
- [ ] Verbs or verb phrases — `postPayment()`, `deletePage()`
- [ ] Describes what the function does
- [ ] Consistent naming patterns across codebase

#### Classes
- [ ] Nouns or noun phrases — `Customer`, `WikiPage`, `AddressParser`
- [ ] Avoid generic names — not `Manager`, `Processor`, `Data`, `Info`

### 2. Functions

#### Size
- [ ] Small — ideally 5-10 lines, max 20-30
- [ ] Do one thing — single level of abstraction
- [ ] One level of abstraction per function

#### Arguments
- [ ] Ideal: zero (niladic)
- [ ] Good: one (monadic)
- [ ] Acceptable: two (dyadic)
- [ ] Avoid: three or more (triadic+)
- [ ] No flag arguments — split into two functions instead
- [ ] Argument objects for related parameters

#### Structure
- [ ] No side effects — or explicitly named as such
- [ ] Command-query separation — do something OR answer something, not both
- [ ] Prefer exceptions over error codes
- [ ] Don't repeat yourself (DRY)

### 3. Comments

#### Good Comments
- [ ] Legal comments (copyright, license)
- [ ] Informative comments explaining regex, complex algorithms
- [ ] Explanation of intent
- [ ] Clarification of obscure library calls
- [ ] Warning of consequences
- [ ] TODO comments (but don't leave them forever)
- [ ] Documentation for public APIs

#### Bad Comments (Remove or Replace)
- [ ] Redundant comments — code already says it
- [ ] Mandated comments — forced but unhelpful
- [ ] Journal comments — use version control instead
- [ ] Noise comments — `/** The name. */ private String name;`
- [ ] Scary noise — copy-pasted comments
- [ ] Position markers — `// Actions ////////////////`
- [ ] Commented-out code — delete it, version control has it
- [ ] Nonlocal information — describing code elsewhere

### 4. Formatting

#### Vertical Formatting
- [ ] Newspaper metaphor — high-level first, details below
- [ ] Vertical openness between concepts
- [ ] Vertical density for related code
- [ ] Vertical distance — related functions near each other
- [ ] Caller above callee

#### Horizontal Formatting
- [ ] Line length: 80-120 characters max
- [ ] Horizontal openness for operator precedence
- [ ] No horizontal alignment (wastes time maintaining)
- [ ] Consistent indentation

### 5. Objects and Data Structures

- [ ] Data abstraction — hide implementation, expose behavior
- [ ] Law of Demeter — `a.getB().getC().doSomething()` is a code smell
- [ ] Data Transfer Objects (DTOs) for data transfer only
- [ ] Active Records vs. Domain Objects properly distinguished

### 6. Error Handling

- [ ] Use exceptions rather than return codes
- [ ] Write try-catch-finally first
- [ ] Use unchecked exceptions (in languages that support both)
- [ ] Provide context with exceptions
- [ ] Define exception classes by caller's needs
- [ ] Don't return null — throw exception or return special case
- [ ] Don't pass null — assert or throw early

### 7. Boundaries

- [ ] Third-party code wrapped in adapters
- [ ] Learning tests for third-party libraries
- [ ] Clean boundaries with interfaces

### 8. Unit Tests

- [ ] One assert per test (or one concept)
- [ ] Fast, Independent, Repeatable, Self-validating, Timely (F.I.R.S.T.)
- [ ] Test code is as clean as production code
- [ ] Tests document the code

### 9. Classes

- [ ] Classes should be small
- [ ] Single Responsibility Principle
- [ ] High cohesion
- [ ] Low coupling
- [ ] Organize for change — open/closed principle

### 10. Systems

- [ ] Separate construction from use
- [ ] Dependency injection
- [ ] Scale up (don't over-engineer upfront)
- [ ] Use standards wisely

## Output Format

```markdown
## Clean Code Assessment: [File/Module Name]

**Assessment Date**: [today]
**Overall Score**: [A/B/C/D/F] ([percentage]%)
**Code Quality**: [Excellent/Good/Fair/Needs Improvement/Poor]

### Summary
[2-3 sentence overview of code quality against clean code principles]

### Scores by Category
| Category | Score | Status |
|----------|-------|--------|
| Meaningful Names | [/10] | [status] |
| Functions | [/10] | [status] |
| Comments | [/10] | [status] |
| Formatting | [/10] | [status] |
| Objects & Data | [/10] | [status] |
| Error Handling | [/10] | [status] |
| Tests | [/10] | [status] |
| Classes | [/10] | [status] |

### Violations Found

#### Critical (Must Fix)
| Principle | Location | Issue | Suggestion |
|-----------|----------|-------|------------|

#### Warnings (Should Fix)
| Principle | Location | Issue | Suggestion |
|-----------|----------|-------|------------|

#### Minor (Consider)
| Principle | Location | Issue | Suggestion |
|-----------|----------|-------|------------|

### Good Practices Observed
- [List positive patterns found in the code]

### Improvement Priority
1. [Most impactful improvement]
2. [Second priority]
3. [Third priority]

### Code Examples

**Before (problematic):**
\`\`\`[language]
[problematic code snippet]
\`\`\`

**After (clean):**
\`\`\`[language]
[improved code snippet]
\`\`\`

### Recommendations
[Actionable next steps for improving code quality]
```

## Notes
- Clean code reads like well-written prose
- Code is read 10x more than it's written — optimize for readers
- The goal is not perfection but continuous improvement
- Context matters — startup code has different standards than banking software
- Don't over-engineer — YAGNI (You Aren't Gonna Need It)
- Prefer clarity over cleverness
- When in doubt, follow team conventions
- These principles are guidelines, not laws — use judgment

---

### Further Reading
- Clean Code by Robert C. Martin
- The Pragmatic Programmer by Hunt and Thomas
- Refactoring by Martin Fowler
