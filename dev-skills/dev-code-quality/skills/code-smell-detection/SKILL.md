---
name: code-smell-detection
description: "Detect code smells and anti-patterns with categorized severity and specific refactoring recommendations. Use when auditing code quality, planning refactoring, or identifying maintenance risks."
---

# Code Smell Detection

## Metadata
- **Name**: code-smell-detection
- **Description**: Detect code smells and anti-patterns with improvement suggestions based on Martin Fowler's refactoring catalog
- **Triggers**: code smells, anti-patterns, code quality, refactoring opportunities, technical debt

## Instructions

You are a code quality specialist detecting code smells for $ARGUMENTS.

Your task is to identify code smells, categorize them by severity, and provide specific refactoring recommendations using established patterns.

## Input Requirements
- Code files or modules to analyze
- Programming language context
- Project context (startup vs enterprise, etc.)
- Areas of concern (optional)

## Code Smell Categories

### 1. Bloaters (Too Much Code)

#### Long Method
**Symptoms:**
- Method > 20-30 lines
- Multiple levels of abstraction
- Comments explaining sections of code

**Detection Checklist:**
- [ ] Function exceeds 30 lines
- [ ] Contains commented section dividers
- [ ] Has multiple unrelated responsibilities
- [ ] Difficult to name concisely

**Refactoring:** Extract Method, Decompose Conditional

---

#### Large Class (God Class)
**Symptoms:**
- Class > 200-300 lines
- Too many instance variables
- Too many methods
- Multiple responsibilities

**Detection Checklist:**
- [ ] Class > 300 lines
- [ ] > 20 methods
- [ ] > 10 instance variables
- [ ] Methods operate on different subsets of fields

**Refactoring:** Extract Class, Extract Interface

---

#### Long Parameter List
**Symptoms:**
- More than 3-4 parameters
- Related parameters passed together
- Boolean flags

**Detection Checklist:**
- [ ] > 4 parameters
- [ ] Parameters often change together
- [ ] Multiple boolean flags

**Refactoring:** Introduce Parameter Object, Replace Parameter with Method

---

#### Data Clumps
**Symptoms:**
- Same group of variables appears together
- Fields that are always used together
- Parameters that travel in packs

**Detection Checklist:**
- [ ] Same 3+ fields in multiple classes
- [ ] Same 3+ parameters in multiple methods
- [ ] Parallel arrays or maps

**Refactoring:** Extract Class, Introduce Parameter Object

---

#### Primitive Obsession
**Symptoms:**
- Primitives used for domain concepts
- String constants for types
- Arrays for structured data

**Detection Checklist:**
- [ ] Strings for money, dates, IDs
- [ ] Integers for status codes
- [ ] Type codes instead of subclasses

**Refactoring:** Replace Primitive with Object, Replace Type Code with Class

---

### 2. Object-Orientation Abusers

#### Switch Statements
**Symptoms:**
- Complex switch/case or if-else chains
- Same switch on same field in multiple places
- Type codes driving behavior

**Detection Checklist:**
- [ ] Switch on type code
- [ ] Similar switch in multiple methods
- [ ] > 5 cases

**Refactoring:** Replace Conditional with Polymorphism, Replace Type Code with Strategy

---

#### Parallel Inheritance Hierarchies
**Symptoms:**
- Creating a subclass requires creating another
- Matching prefixes in class names
- Duplicated hierarchies

**Detection Checklist:**
- [ ] Matching class prefixes
- [ ] 1:1 correspondence between hierarchies
- [ ] Changes require updates in both

**Refactoring:** Move Method, Move Field to consolidate

---

#### Refused Bequest
**Symptoms:**
- Subclass doesn't use inherited methods/data
- Empty or throwing implementations
- Inheritance for code reuse only

**Detection Checklist:**
- [ ] Overridden methods throw UnsupportedOperationException
- [ ] Large portions of parent unused
- [ ] Subclass does something completely different

**Refactoring:** Replace Inheritance with Delegation

---

#### Temporary Field
**Symptoms:**
- Fields only set/used in certain scenarios
- Null checks before field access
- Instance variables for temporary state

**Detection Checklist:**
- [ ] Fields null in many states
- [ ] Complex initialization logic
- [ ] Fields only used by some methods

**Refactoring:** Extract Class, Introduce Null Object

---

### 3. Change Preventers

#### Divergent Change
**Symptoms:**
- One class changed for multiple reasons
- Different types of changes affect same class
- Class is a "catch-all"

**Detection Checklist:**
- [ ] Changes for unrelated features touch same class
- [ ] Class name includes "Manager" or "Handler"
- [ ] Multiple developers often edit same file

**Refactoring:** Extract Class (one per responsibility)

---

#### Shotgun Surgery
**Symptoms:**
- One change requires many small changes
- Related code scattered across system
- Feature scattered across classes

**Detection Checklist:**
- [ ] Single logical change = many file changes
- [ ] Related methods in different classes
- [ ] Copy-paste patterns

**Refactoring:** Move Method, Move Field, Inline Class

---

#### Feature Envy
**Symptoms:**
- Method uses more from other class
- Excessive calls to another object
- Accessor method chains

**Detection Checklist:**
- [ ] Method calls another object > 3 times
- [ ] More lines reference other class
- [ ] Could logically belong to other class

**Refactoring:** Move Method

---

### 4. Dispensables (Unnecessary Code)

#### Comments (Deodorant)
**Symptoms:**
- Comments explaining what code does
- Comments apologizing for code
- Disabled code in comments

**Detection Checklist:**
- [ ] "This does..." comments
- [ ] TODO comments > 6 months old
- [ ] Commented-out code blocks

**Refactoring:** Extract Method (with good name), Rename

---

#### Duplicate Code
**Symptoms:**
- Same code structure in multiple places
- Same expressions repeated
- Similar algorithms

**Detection Checklist:**
- [ ] Exact duplicate blocks
- [ ] Same pattern, different data
- [ ] Copy-paste evidence

**Refactoring:** Extract Method, Extract Class, Pull Up Method

---

#### Dead Code
**Symptoms:**
- Unreachable code
- Unused variables, parameters, methods
- Commented-out code

**Detection Checklist:**
- [ ] IDE shows unused warnings
- [ ] No test coverage and no callers
- [ ] Obsolete feature code

**Refactoring:** Remove Dead Code

---

#### Speculative Generality
**Symptoms:**
- Unused abstractions "for future use"
- Empty subclasses or interfaces
- Parameters that are never varied

**Detection Checklist:**
- [ ] Abstract class with one implementation
- [ ] Parameters always passed same value
- [ ] Hooks never hooked

**Refactoring:** Collapse Hierarchy, Inline Class, Remove Parameter

---

#### Lazy Class
**Symptoms:**
- Class that doesn't do enough
- Class created for potential future use
- Delegating class with no added value

**Detection Checklist:**
- [ ] < 5 methods
- [ ] Only getters/setters
- [ ] All methods delegate to another class

**Refactoring:** Inline Class, Collapse Hierarchy

---

### 5. Couplers (Excessive Coupling)

#### Message Chains
**Symptoms:**
- `a.getB().getC().getD().doSomething()`
- Navigation through object structure
- Law of Demeter violations

**Detection Checklist:**
- [ ] > 2 chained method calls
- [ ] Navigating object graph
- [ ] Fragile to structure changes

**Refactoring:** Hide Delegate, Extract Method

---

#### Middle Man
**Symptoms:**
- Class only delegates to another
- Most methods are pass-through
- No added logic or value

**Detection Checklist:**
- [ ] > 50% methods just delegate
- [ ] Class name ends in "Manager", "Wrapper"
- [ ] No business logic

**Refactoring:** Remove Middle Man, Inline Method

---

#### Inappropriate Intimacy
**Symptoms:**
- Classes too dependent on each other's internals
- Excessive use of friend/internal access
- Bidirectional dependencies

**Detection Checklist:**
- [ ] Access to private fields
- [ ] Knowledge of internal implementation
- [ ] Circular dependencies

**Refactoring:** Move Method, Change Bidirectional to Unidirectional

---

## Output Format

```markdown
## Code Smell Analysis: [File/Module Name]

**Date**: [today]
**Language**: [language]
**Overall Health**: [Healthy/Moderate Issues/Needs Attention/Critical]

### Summary
[2-3 sentence overview of code smell findings]

### Smell Distribution
| Category | Count | Severity |
|----------|-------|----------|
| Bloaters | [n] | [severity] |
| OO Abusers | [n] | [severity] |
| Change Preventers | [n] | [severity] |
| Dispensables | [n] | [severity] |
| Couplers | [n] | [severity] |

### Critical Smells (Immediate Action)

#### [Smell Name]
- **Location**: [file:line]
- **Severity**: Critical
- **Impact**: [What problems this causes]
- **Evidence**: [Specific code indicators]
- **Refactoring**: [Recommended technique]

\`\`\`[language]
// Problematic code
[code snippet]
\`\`\`

\`\`\`[language]
// Suggested improvement
[improved code]
\`\`\`

### High Priority Smells

| Smell | Location | Category | Refactoring |
|-------|----------|----------|-------------|

### Medium Priority Smells

| Smell | Location | Category | Refactoring |
|-------|----------|----------|-------------|

### Low Priority Smells

| Smell | Location | Category | Refactoring |
|-------|----------|----------|-------------|

### Clean Code Areas
[Positive examples in the codebase]

### Refactoring Roadmap
1. [First priority action]
2. [Second priority action]
3. [Third priority action]

### Metrics Impact
| Metric | Current | After Refactoring |
|--------|---------|-------------------|
| Cyclomatic Complexity | [n] | [n] (estimated) |
| Lines of Code | [n] | [n] (estimated) |
| Test Coverage | [%] | [%] (potential) |
```

## Notes
- Code smells are hints, not definitive problems
- Context matters — some "smells" are acceptable tradeoffs
- Fix smells incrementally, not all at once
- Add tests before refactoring
- Not all code needs to be perfect — prioritize high-traffic code
- Some smells indicate missing domain concepts
- Team alignment on smell tolerance is important

---

### Further Reading
- Refactoring by Martin Fowler
- Clean Code by Robert C. Martin
- Working Effectively with Legacy Code by Michael Feathers
