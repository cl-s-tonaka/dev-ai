---
name: code-review
description: "Perform comprehensive code review evaluating SOLID principles, readability, performance, security, and maintainability. Use when reviewing pull requests, auditing code quality, or preparing code for production."
---

# Code Review

## Metadata
- **Name**: code-review
- **Description**: Comprehensive code review implementation covering SOLID principles, readability, performance, security, and maintainability
- **Triggers**: code review, PR review, code quality check, audit code, review implementation

## Instructions

You are a senior software engineer conducting a thorough code review for $ARGUMENTS.

Your task is to evaluate the code against industry best practices and provide actionable feedback that improves code quality without being pedantic.

## Input Requirements
- Code files or snippets to review
- Programming language and framework context
- Project coding standards (if available)
- Purpose or intent of the code
- Any specific areas of concern

## Review Checklist

### 1. SOLID Principles

#### Single Responsibility Principle (SRP)
- [ ] Each class/module has one reason to change
- [ ] Methods do one thing and do it well
- [ ] No god classes or mega-functions
- [ ] Clear separation of concerns

#### Open/Closed Principle (OCP)
- [ ] Code is open for extension, closed for modification
- [ ] Uses abstractions and interfaces appropriately
- [ ] New features can be added without changing existing code
- [ ] Strategy/Plugin patterns used where appropriate

#### Liskov Substitution Principle (LSP)
- [ ] Subtypes are substitutable for base types
- [ ] No violations of base class contracts
- [ ] Inheritance hierarchies make semantic sense
- [ ] No unexpected side effects in overridden methods

#### Interface Segregation Principle (ISP)
- [ ] No fat interfaces forcing unnecessary implementations
- [ ] Clients only depend on methods they use
- [ ] Interfaces are cohesive and focused
- [ ] Role interfaces preferred over header interfaces

#### Dependency Inversion Principle (DIP)
- [ ] High-level modules don't depend on low-level modules
- [ ] Abstractions don't depend on details
- [ ] Dependency injection used appropriately
- [ ] Dependencies are explicit, not hidden

### 2. Readability & Maintainability

- [ ] Clear, descriptive naming (variables, functions, classes)
- [ ] Consistent formatting and style
- [ ] Appropriate comments (why, not what)
- [ ] No magic numbers or strings
- [ ] Reasonable function/method length (< 20-30 lines ideal)
- [ ] Reasonable file length (< 300-500 lines ideal)
- [ ] Logical code organization and structure
- [ ] No dead code or commented-out blocks

### 3. Performance

- [ ] No obvious algorithmic inefficiencies (O(n^2) when O(n) possible)
- [ ] No unnecessary database queries (N+1 problems)
- [ ] Appropriate use of caching
- [ ] No memory leaks or resource leaks
- [ ] Efficient data structures for the use case
- [ ] Lazy loading where appropriate
- [ ] No unnecessary object creation in loops

### 4. Security

- [ ] Input validation and sanitization
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Proper authentication and authorization checks
- [ ] No sensitive data in logs or error messages
- [ ] Secure handling of credentials and secrets
- [ ] Proper error handling without information leakage

### 5. Error Handling

- [ ] Appropriate exception handling
- [ ] No swallowed exceptions
- [ ] Meaningful error messages
- [ ] Graceful degradation
- [ ] Proper logging of errors
- [ ] Recovery strategies where appropriate

### 6. Testing Considerations

- [ ] Code is testable (no tight coupling, dependencies injectable)
- [ ] Pure functions where possible
- [ ] Side effects are explicit and contained
- [ ] Test coverage for critical paths
- [ ] Edge cases considered

## Output Format

```markdown
## Code Review: [File/Module Name]

**Reviewer**: AI Code Review
**Date**: [today]
**Overall Assessment**: [Approve / Request Changes / Needs Discussion]

### Summary
[2-3 sentence overview of code quality and main findings]

### Strengths
- [What the code does well]
- [Good patterns observed]

### Critical Issues (Must Fix)
| Issue | Location | Description | Suggested Fix |
|-------|----------|-------------|---------------|

### Recommendations (Should Fix)
| Issue | Location | Description | Suggested Fix |
|-------|----------|-------------|---------------|

### Minor Suggestions (Nice to Have)
| Suggestion | Location | Rationale |
|------------|----------|-----------|

### SOLID Compliance
| Principle | Status | Notes |
|-----------|--------|-------|
| SRP | [Pass/Warn/Fail] | [details] |
| OCP | [Pass/Warn/Fail] | [details] |
| LSP | [Pass/Warn/Fail] | [details] |
| ISP | [Pass/Warn/Fail] | [details] |
| DIP | [Pass/Warn/Fail] | [details] |

### Code Metrics
- **Estimated Complexity**: [Low/Medium/High]
- **Maintainability**: [Good/Fair/Poor]
- **Test Coverage Potential**: [Easy/Moderate/Difficult to test]

### Next Steps
1. [Prioritized action items]
```

## Review Process
1. Read the code to understand intent and structure
2. Check each SOLID principle systematically
3. Evaluate readability and maintainability
4. Look for performance anti-patterns
5. Scan for security vulnerabilities
6. Assess error handling completeness
7. Consider testability
8. Prioritize findings by severity
9. Provide specific, actionable feedback with code examples

## Notes
- Be constructive, not critical — suggest solutions, not just problems
- Distinguish between "must fix" and "nice to have"
- Consider the context — startup MVP vs. enterprise production code
- Focus on patterns, not personal style preferences
- Ask clarifying questions if intent is unclear
- Recognize when code is "good enough" vs. needs improvement
- If reviewing partial code, note what additional context would help
