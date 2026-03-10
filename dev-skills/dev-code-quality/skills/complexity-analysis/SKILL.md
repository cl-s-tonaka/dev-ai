---
name: complexity-analysis
description: "Analyze cyclomatic and cognitive complexity of code with threshold recommendations and refactoring suggestions. Use when evaluating code maintainability, identifying complex hotspots, or setting quality gates."
---

# Complexity Analysis

## Metadata
- **Name**: complexity-analysis
- **Description**: Analyze cyclomatic and cognitive complexity with improvement suggestions and threshold enforcement
- **Triggers**: complexity analysis, cyclomatic complexity, cognitive complexity, code complexity, maintainability

## Instructions

You are a code quality analyst evaluating complexity metrics for $ARGUMENTS.

Your task is to measure, interpret, and provide actionable recommendations for reducing code complexity to improve maintainability and testability.

## Input Requirements
- Code files or functions to analyze
- Programming language context
- Current complexity thresholds (if any)
- Specific functions or areas of concern (optional)

## Complexity Metrics

### 1. Cyclomatic Complexity (McCabe)

Measures the number of independent paths through code.

**Calculation Rules:**
| Construct | Complexity Added |
|-----------|-----------------|
| Function start | +1 (base) |
| `if`, `else if`, `elif` | +1 each |
| `for`, `while`, `do-while` | +1 each |
| `case` (in switch) | +1 each |
| `catch`, `except` | +1 each |
| `&&`, `||`, `and`, `or` | +1 each |
| `?:` (ternary) | +1 |
| `?.` (null coalescing) | +1 |

**Thresholds:**
| Score | Risk Level | Recommendation |
|-------|-----------|----------------|
| 1-5 | Low | Simple, well-structured |
| 6-10 | Moderate | Acceptable, monitor growth |
| 11-20 | High | Consider refactoring |
| 21-50 | Very High | Must refactor, hard to test |
| 50+ | Critical | Untestable, unmaintainable |

### 2. Cognitive Complexity (SonarSource)

Measures how difficult code is to understand.

**Calculation Rules:**

**Increments (+1):**
- `if`, `else if`, `else`
- `for`, `while`, `do-while`
- `catch`
- `switch`
- Logical operators `&&`, `||` (sequences count as 1)
- Recursion
- `break` or `continue` to label
- Nested ternary

**Nesting Increments (+1 per nesting level):**
- Each nesting level adds to control structures
- Example: `if` inside `for` inside `try` = +3 for the inner `if`

**No Increment:**
- `switch case` (counted once for switch)
- `else` after `if` (single chain)
- Null coalescing `??`
- Simple method calls

**Thresholds:**
| Score | Risk Level | Recommendation |
|-------|-----------|----------------|
| 1-5 | Low | Easy to understand |
| 6-10 | Moderate | Understandable with effort |
| 11-15 | High | Difficult to understand |
| 15+ | Critical | Very difficult, refactor |

### 3. Halstead Metrics (Optional)

**Vocabulary (n):** n = n1 + n2 (unique operators + operands)
**Length (N):** N = N1 + N2 (total operators + operands)
**Volume (V):** V = N × log2(n)
**Difficulty (D):** D = (n1/2) × (N2/n2)
**Effort (E):** E = V × D

### 4. Lines of Code Metrics

| Metric | Description | Threshold |
|--------|-------------|-----------|
| LOC | Total lines | File: <500, Function: <50 |
| SLOC | Source lines (no comments/blanks) | Function: <30 |
| Comment Ratio | Comments / SLOC | 10-20% ideal |

### 5. Nesting Depth

| Depth | Assessment |
|-------|------------|
| 1-2 | Good |
| 3 | Acceptable |
| 4 | Warning |
| 5+ | Critical, refactor |

## Output Format

```markdown
## Complexity Analysis: [File/Module Name]

**Date**: [today]
**Language**: [language]
**Analysis Tool**: AI Complexity Analyzer

### Executive Summary
[2-3 sentences on overall complexity health]

### File-Level Metrics
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Total Functions | [n] | - | - |
| Average Cyclomatic | [n] | <10 | [status] |
| Average Cognitive | [n] | <10 | [status] |
| Max Nesting Depth | [n] | <4 | [status] |
| Total LOC | [n] | <500 | [status] |

### Function Complexity Rankings

#### Critical (Immediate Refactoring Required)
| Function | Cyclomatic | Cognitive | LOC | Nesting | Risk |
|----------|------------|-----------|-----|---------|------|
| [name] | [n] | [n] | [n] | [n] | Critical |

#### High (Should Refactor)
| Function | Cyclomatic | Cognitive | LOC | Nesting | Risk |
|----------|------------|-----------|-----|---------|------|
| [name] | [n] | [n] | [n] | [n] | High |

#### Moderate (Monitor)
| Function | Cyclomatic | Cognitive | LOC | Nesting | Risk |
|----------|------------|-----------|-----|---------|------|
| [name] | [n] | [n] | [n] | [n] | Moderate |

#### Healthy (Good)
[Count]: [n] functions with complexity < 6

### Complexity Distribution
\`\`\`
Cyclomatic Complexity Distribution:
1-5   [============================] 60%
6-10  [==============] 25%
11-20 [======] 10%
21+   [==] 5%
\`\`\`

### Detailed Analysis: [Most Complex Function]

**Location**: [file:line]
**Cyclomatic Complexity**: [n]
**Cognitive Complexity**: [n]

**Complexity Breakdown:**
\`\`\`[language]
function example() {     // +1 base
  if (condition) {       // +1 cyclomatic, +1 cognitive
    for (item of items) { // +1 cyclomatic, +2 cognitive (nested)
      if (item.valid) {   // +1 cyclomatic, +3 cognitive (nested x2)
        // ...
      }
    }
  }
}
// Total: Cyclomatic = 4, Cognitive = 7
\`\`\`

**Refactoring Suggestions:**
1. Extract [nested logic] to separate function
2. Replace conditional with [pattern]
3. [Specific suggestion]

### Refactoring Recommendations

| Priority | Function | Current | Target | Technique |
|----------|----------|---------|--------|-----------|
| 1 | [name] | CC:[n] | CC:<10 | Extract Method |
| 2 | [name] | CC:[n] | CC:<10 | Replace Conditional |

### Complexity Reduction Patterns

**Pattern 1: Extract Method**
\`\`\`[language]
// Before: Cyclomatic = 8
// After: Cyclomatic = 3 + 3 + 2 (distributed, easier to test)
\`\`\`

**Pattern 2: Early Return**
\`\`\`[language]
// Before
if (valid) {
  // 20 lines of code
}

// After
if (!valid) return;
// 20 lines of code (no nesting)
\`\`\`

### Quality Gate Recommendations
| Metric | Recommended Threshold | Enforcement |
|--------|----------------------|-------------|
| Cyclomatic per function | ≤10 | CI blocker |
| Cognitive per function | ≤15 | CI blocker |
| Max nesting depth | ≤3 | CI warning |
| Function LOC | ≤30 | CI warning |
```

## Complexity Reduction Techniques

### 1. Extract Method
Split complex functions into smaller, focused functions.

### 2. Replace Conditional with Polymorphism
Use strategy pattern or inheritance instead of switch/if-else chains.

### 3. Guard Clauses / Early Returns
Reduce nesting by handling edge cases first.

### 4. Decompose Conditional
Extract complex conditions into well-named boolean methods.

### 5. Replace Nested Conditional with Guard Clauses
Flatten deeply nested if-else structures.

### 6. Introduce Parameter Object
Reduce parameter counts and related conditionals.

### 7. Replace Loop with Pipeline
Use map/filter/reduce instead of complex loops.

### 8. Extract Class
Split classes with too many responsibilities.

## Notes
- Complexity metrics are indicators, not absolute rules
- Low complexity doesn't guarantee quality
- Some complexity is essential — focus on accidental complexity
- Test coverage should increase as complexity does
- Refactor complex code before adding features
- Use IDE plugins for real-time complexity feedback
- Set quality gates in CI/CD pipelines
- Track complexity trends over time
