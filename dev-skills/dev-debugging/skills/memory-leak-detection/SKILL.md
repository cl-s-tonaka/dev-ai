---
name: memory-leak-detection
description: "Detect memory leaks and provide remediation strategies with heap analysis and object lifecycle tracking. Use when debugging OutOfMemoryErrors, investigating growing heap usage, or optimizing memory consumption."
---

# Memory Leak Detection and Remediation

## Purpose

You are a senior engineer investigating memory issues in **$ARGUMENTS**. This skill identifies memory leaks, analyzes heap dumps, and provides remediation strategies to stabilize memory usage.

## Context

Memory leaks occur when objects are allocated but never released, causing memory consumption to grow over time until the application crashes or degrades. Detection involves heap analysis, object lifecycle tracking, and pattern recognition across allocations.

## Instructions

### 1. Identify Memory Leak Symptoms

Look for these indicators:

| Symptom | Indicator | Severity |
|---------|-----------|----------|
| Growing heap | Heap usage increases over time without plateauing | High |
| Frequent GC | GC runs more often, reclaiming less each time | Medium |
| OOM errors | `OutOfMemoryError` crashes | Critical |
| Slow response | Increased latency as heap fills | Medium |
| GC pauses | Long stop-the-world GC pauses | High |

**Memory Health Check**:
```
## Memory Health Assessment

Current State:
- Heap Size: [X] MB / [Y] MB max
- Heap Usage Trend: [Rising / Stable / Falling]
- GC Frequency: [N] collections / minute
- GC Efficiency: [X]% reclaimed per collection
- Time Since Restart: [hours/days]

Health Status: [Healthy / Warning / Critical]
```

### 2. Collect Memory Data

Gather diagnostic information:

**Heap Dump Analysis**:
- Capture heap dumps at intervals (start, after 1hr, after load)
- Compare object counts between dumps
- Identify retained objects and retention paths

**GC Log Analysis**:
- GC pause times and frequency
- Memory reclaimed per collection
- Promotion rates (young → old generation)

**Live Metrics**:
- Heap usage over time
- Object allocation rate
- Memory pool utilization

### 3. Analyze Heap Dump

Identify the top memory consumers:

```
## Heap Dump Analysis

**Dump Time**: [timestamp]
**Heap Used**: [X] MB
**Object Count**: [N] objects

### Top Memory Consumers by Retained Size

| # | Class | Instances | Shallow Size | Retained Size | % Heap |
|---|-------|-----------|--------------|---------------|--------|
| 1 | byte[] | 1,234,567 | 500 MB | 500 MB | 40% |
| 2 | HashMap$Node | 890,123 | 200 MB | 350 MB | 28% |
| 3 | String | 456,789 | 100 MB | 100 MB | 8% |
| 4 | UserSession | 10,000 | 5 MB | 200 MB | 16% |

### Object Growth Analysis (Dump 1 → Dump 2)

| Class | Count Δ | Size Δ | Growth Rate |
|-------|---------|--------|-------------|
| UserSession | +5,000 | +100 MB | 🔴 Suspect |
| HashMap$Node | +50,000 | +50 MB | 🔴 Suspect |
| String | +10,000 | +2 MB | 🟡 Monitor |

### Retention Path to GC Root

**Leaking Object**: UserSession (10,000 instances, 200 MB)

GC Root → [path] → Leaking Object

```
GC Root: Static field SessionManager.sessions
    └── HashMap (capacity: 16384)
        └── HashMap$Node[]
            └── UserSession ← LEAKED
                └── byte[] (user data)
                └── List<Order> (order history)
```

**Problem**: Sessions added to SessionManager.sessions but never removed
```

### 4. Identify Common Leak Patterns

| Pattern | Description | Detection | Fix |
|---------|-------------|-----------|-----|
| **Static Collections** | Objects added to static maps/lists but never removed | Growing static collection size | Use weak references or explicit removal |
| **Event Listeners** | Listeners registered but never unregistered | Listener count grows | Unregister in cleanup/dispose |
| **Caches Unbounded** | Cache grows without eviction policy | Cache size increases indefinitely | Add TTL or size limits |
| **Connection Leaks** | Connections opened but not closed | Connection pool exhaustion | Use try-with-resources |
| **Thread Locals** | ThreadLocal values not cleared | Memory per thread grows | Clear in finally blocks |
| **Inner Class Refs** | Non-static inner classes hold outer references | Unexpected object retention | Use static inner classes |
| **Closeable Not Closed** | Streams, readers, connections not closed | Resource count grows | Always close resources |

### 5. Generate Remediation Plan

```
## Memory Leak Remediation Plan

### Leak Summary

**Root Cause**: [Description of what's leaking and why]
**Impact**: [Memory growth rate, time to OOM]
**Affected Classes**: [List of classes involved]

### Immediate Mitigation

1. **Increase heap size** (temporary)
   - Current: -Xmx2g
   - Recommended: -Xmx4g
   - Buys time: ~[X] hours before OOM

2. **Restart schedule** (temporary)
   - Restart every [X] hours until fix deployed
   - Automate with health check on heap usage > 80%

### Permanent Fix

**Code Change Required**:

```[language]
// Before (leaking)
public class SessionManager {
    private static Map<String, UserSession> sessions = new HashMap<>();

    public void createSession(UserSession session) {
        sessions.put(session.getId(), session);  // Never removed!
    }
}

// After (fixed)
public class SessionManager {
    private static Map<String, UserSession> sessions = new ConcurrentHashMap<>();
    private static final long SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

    public void createSession(UserSession session) {
        sessions.put(session.getId(), session);
        scheduleExpiration(session.getId(), SESSION_TTL_MS);
    }

    public void destroySession(String sessionId) {
        sessions.remove(sessionId);  // Explicit removal
    }

    private void scheduleExpiration(String sessionId, long ttlMs) {
        scheduler.schedule(() -> destroySession(sessionId), ttlMs, TimeUnit.MILLISECONDS);
    }
}
```

**Alternative Approaches**:
- Use `WeakHashMap` for automatic cleanup
- Use cache library (Caffeine, Guava) with eviction
- Implement `Closeable` and ensure cleanup

### Verification

1. Deploy fix to staging
2. Run load test for [X] hours
3. Monitor heap usage — should plateau, not grow
4. Take heap dumps before/after to confirm leak resolved

### Prevention Measures

- [ ] Add heap usage alerting (warn at 70%, page at 85%)
- [ ] Add unit tests for object cleanup
- [ ] Code review checklist: resource cleanup verified
- [ ] Enable leak detection in CI (e.g., JUnit memory assertions)
```

### 6. Memory Optimization Recommendations

Beyond leak fixes:

| Optimization | Benefit | Effort |
|--------------|---------|--------|
| Object pooling | Reduce allocation/GC pressure | Medium |
| Flyweight pattern | Share immutable objects | Medium |
| Primitive collections | Avoid boxing overhead | Low |
| Lazy initialization | Defer allocation until needed | Low |
| Off-heap storage | Reduce GC overhead for large datasets | High |
| String interning | Deduplicate strings | Low |
| Weak/Soft references | Allow GC when memory is tight | Medium |

Save as markdown. Generate heap analysis scripts if needed.

## Notes

- Take multiple heap dumps to identify growth patterns
- Compare heap state before and after operations
- Focus on objects with growing instance counts
- Retention paths show why objects can't be collected
- Test fixes under realistic load conditions

---

### Further Reading

- [Java Memory Management](https://www.oracle.com/technical-resources/articles/java/javamemory.html)
- [Memory Profiling with VisualVM](https://visualvm.github.io/)
- [Hunting Memory Leaks in Python](https://docs.python.org/3/library/tracemalloc.html)
