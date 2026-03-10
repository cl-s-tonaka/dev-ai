---
name: performance-review
description: "Perform performance-focused code review identifying bottlenecks, memory issues, and optimization opportunities. Use when optimizing critical paths, debugging performance issues, or reviewing performance-sensitive code."
---

# Performance Review

## Metadata
- **Name**: performance-review
- **Description**: Performance-focused code review identifying bottlenecks, memory issues, algorithmic inefficiencies, and optimization opportunities
- **Triggers**: performance review, optimization, bottleneck, memory leak, performance issues, slow code

## Instructions

You are a performance engineer reviewing code for $ARGUMENTS.

Your task is to identify performance anti-patterns, suggest optimizations, and ensure code meets performance requirements without sacrificing maintainability.

## Input Requirements
- Code files or functions to analyze
- Programming language and runtime context
- Performance requirements or SLAs (if any)
- Profiling data (if available)
- Specific performance concerns (optional)

## Performance Review Checklist

### 1. Algorithmic Complexity

#### Time Complexity
| Complexity | Name | Example | Concern Level |
|------------|------|---------|---------------|
| O(1) | Constant | Hash lookup | None |
| O(log n) | Logarithmic | Binary search | None |
| O(n) | Linear | Array scan | Low |
| O(n log n) | Linearithmic | Merge sort | Low |
| O(n²) | Quadratic | Nested loops | High |
| O(2ⁿ) | Exponential | Recursive subsets | Critical |

**Detection Checklist:**
- [ ] Nested loops over same data → O(n²) or worse
- [ ] Recursive calls without memoization → potential exponential
- [ ] Linear search when sorted/indexed data available
- [ ] String concatenation in loops → O(n²) in some languages

#### Space Complexity
- [ ] Unbounded data structures
- [ ] Large intermediate collections
- [ ] Recursive call stack depth
- [ ] String builders vs concatenation

---

### 2. Database Performance

#### N+1 Query Problem
**Symptoms:**
```
SELECT * FROM orders WHERE user_id = 1;
SELECT * FROM products WHERE id = 101;  -- For each order
SELECT * FROM products WHERE id = 102;
SELECT * FROM products WHERE id = 103;
-- ... N more queries
```

**Detection Checklist:**
- [ ] Queries inside loops
- [ ] Lazy loading in list iterations
- [ ] Missing eager loading/joins
- [ ] ORM without includes/preload

**Fix:** Use joins, eager loading, or batch queries.

---

#### Missing Indexes
- [ ] Queries on non-indexed columns
- [ ] Composite queries without composite indexes
- [ ] ORDER BY on non-indexed columns
- [ ] Full table scans

---

#### Inefficient Queries
- [ ] SELECT * instead of specific columns
- [ ] Missing LIMIT on unbounded queries
- [ ] Subqueries that could be joins
- [ ] Functions on indexed columns (prevents index use)
- [ ] LIKE '%pattern' (no index usage)

---

### 3. Memory Management

#### Memory Leaks
**Common Causes:**
- [ ] Event listeners not removed
- [ ] Closures capturing large scopes
- [ ] Global/static references
- [ ] Cached data without eviction
- [ ] Uncleared timers/intervals
- [ ] Subscriptions not unsubscribed

---

#### Excessive Allocation
- [ ] Object creation in hot loops
- [ ] String concatenation in loops
- [ ] Unnecessary copying of data
- [ ] Boxing/unboxing primitives
- [ ] Large object graphs for small tasks

---

#### Memory Pressure
- [ ] Loading entire files into memory
- [ ] Unbounded caches
- [ ] Large session storage
- [ ] Image/file processing without streaming

---

### 4. I/O Performance

#### Network
- [ ] Sequential requests that could be parallel
- [ ] Missing request batching
- [ ] No connection pooling
- [ ] Missing timeouts
- [ ] No retry with backoff

#### File System
- [ ] Synchronous file operations
- [ ] Reading entire files when streaming possible
- [ ] No buffering for sequential access
- [ ] Excessive file open/close cycles

---

### 5. Concurrency Issues

#### Thread Safety
- [ ] Race conditions in shared state
- [ ] Missing synchronization
- [ ] Deadlock potential
- [ ] Lock contention

#### Async/Await
- [ ] Sequential awaits that could be parallel
- [ ] Missing Promise.all for independent operations
- [ ] Blocking operations in async context
- [ ] Unhandled promise rejections

---

### 6. Caching Opportunities

- [ ] Repeated expensive computations
- [ ] Repeated identical database queries
- [ ] Repeated API calls with same parameters
- [ ] Static data fetched on every request

**Caching Considerations:**
- Cache invalidation strategy
- TTL (time-to-live) appropriate
- Memory vs disk vs distributed cache
- Cache stampede prevention

---

### 7. Serialization/Parsing

- [ ] Parsing large JSON/XML synchronously
- [ ] Serializing in hot paths
- [ ] Missing streaming parsers for large data
- [ ] Reflection-based serialization overhead

---

### 8. Language-Specific Anti-Patterns

#### JavaScript/TypeScript
- [ ] Blocking event loop
- [ ] Synchronous require in hot paths
- [ ] Large closures
- [ ] Array methods vs for loops (micro-optimization)

#### Python
- [ ] Global Interpreter Lock (GIL) implications
- [ ] List comprehension vs generator
- [ ] String formatting methods
- [ ] Import overhead

#### Java
- [ ] Autoboxing in loops
- [ ] String concatenation with + operator
- [ ] Synchronized on hot paths
- [ ] Stream vs iteration overhead

---

## Output Format

```markdown
## Performance Review: [File/Module Name]

**Date**: [today]
**Language**: [language]
**Review Focus**: [General/Database/Memory/Concurrency]

### Executive Summary
[2-3 sentences on performance health and key findings]

### Performance Metrics (If Available)
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Response Time (p95) | [ms] | [ms] | [status] |
| Memory Usage | [MB] | [MB] | [status] |
| CPU Usage | [%] | [%] | [status] |
| Database Queries | [n/request] | [n] | [status] |

### Critical Issues (High Impact)

#### Issue: [Name]
- **Location**: [file:line]
- **Type**: [Algorithmic/Database/Memory/I-O/Concurrency]
- **Impact**: [Estimated impact on performance]
- **Current Complexity**: [O(n²)]
- **Target Complexity**: [O(n)]

**Problematic Code:**
\`\`\`[language]
[code snippet]
\`\`\`

**Optimized Code:**
\`\`\`[language]
[improved code]
\`\`\`

**Expected Improvement**: [quantified if possible]

---

### High Priority Issues

| Issue | Location | Type | Impact | Fix Effort |
|-------|----------|------|--------|------------|

### Medium Priority Issues

| Issue | Location | Type | Impact | Fix Effort |
|-------|----------|------|--------|------------|

### Optimization Opportunities

| Opportunity | Location | Technique | Expected Gain |
|-------------|----------|-----------|---------------|

### Caching Recommendations

| Data/Operation | Current | Recommended Cache | TTL |
|----------------|---------|-------------------|-----|
| [item] | No cache | Redis/Memory/CDN | [duration] |

### Database Optimization

#### Query Analysis
| Query Pattern | Frequency | Avg Time | Issue | Fix |
|---------------|-----------|----------|-------|-----|

#### Index Recommendations
| Table | Column(s) | Index Type | Reason |
|-------|-----------|------------|--------|

### Memory Analysis

| Concern | Location | Current | Recommendation |
|---------|----------|---------|----------------|

### Concurrency Review

| Pattern | Location | Risk | Recommendation |
|---------|----------|------|----------------|

### Performance Testing Recommendations
1. [Specific load test scenarios]
2. [Profiling recommendations]
3. [Monitoring additions]

### Prioritized Action Plan
| Priority | Issue | Estimated Effort | Expected Impact |
|----------|-------|------------------|-----------------|
| 1 | [issue] | [hours/days] | [high/medium/low] |
| 2 | [issue] | [hours/days] | [high/medium/low] |
```

## Optimization Techniques

### Algorithm Optimization
1. Use appropriate data structures (HashMap vs List)
2. Add early termination conditions
3. Use binary search for sorted data
4. Implement memoization/caching
5. Consider space-time tradeoffs

### Database Optimization
1. Add missing indexes
2. Use batch operations
3. Implement pagination
4. Use read replicas
5. Cache query results

### Memory Optimization
1. Use streaming for large data
2. Implement object pooling
3. Clear references early
4. Use weak references for caches
5. Profile and fix leaks

### I/O Optimization
1. Parallelize independent operations
2. Implement connection pooling
3. Use async/non-blocking I/O
4. Add request batching
5. Implement proper timeouts

## Notes
- Profile before optimizing — measure, don't guess
- Premature optimization is the root of all evil
- Optimize hot paths first (80/20 rule)
- Consider maintainability tradeoffs
- Document performance-critical code
- Add performance tests for critical paths
- Monitor in production, not just development
- Sometimes the best optimization is algorithmic, not code-level
