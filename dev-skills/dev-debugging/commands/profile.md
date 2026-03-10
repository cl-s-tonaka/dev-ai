---
description: Profile application performance and generate optimization recommendations
argument-hint: "<endpoint, service, or performance issue description>"
---

# /profile -- Performance Profiling and Optimization

Profile application performance to identify bottlenecks and generate actionable optimization recommendations.

## Invocation

```
/profile /api/orders endpoint is slow (p99 > 2s)
/profile High CPU usage in order-service
/profile Memory keeps growing in the worker pods
/profile [paste performance metrics or flame graph]
/profile                    # asks for performance context
```

## Workflow

### Step 1: Define Performance Context

Gather information about the performance issue:

**Ask if not provided**:
- What is the observed performance problem?
- What is the target/SLA for this metric?
- When did the performance degrade (or has it always been slow)?
- What load/traffic conditions trigger the issue?
- What environment are we profiling (prod, staging, local)?

**Performance Issue Classification**:

| Type | Symptoms | Focus Areas |
|------|----------|-------------|
| **High Latency** | Slow response times | DB queries, external calls, computation |
| **High CPU** | CPU bound, high utilization | Hot methods, inefficient algorithms |
| **High Memory** | Growing heap, OOM risks | Object retention, allocation rate |
| **High I/O** | Disk/network bottlenecks | File operations, network calls |
| **Concurrency** | Lock contention, thread starvation | Synchronization, pool sizing |

### Step 2: Establish Baseline Metrics

Define current state and targets:

```
## Performance Baseline

**Component**: [Service/Endpoint/Function]
**Environment**: [Production / Staging / Local]
**Load Conditions**: [requests/sec, concurrent users]
**Measurement Period**: [start] to [end]

### Current Metrics

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Response Time (p50) | [X]ms | [Y]ms | [diff] |
| Response Time (p95) | [X]ms | [Y]ms | [diff] |
| Response Time (p99) | [X]ms | [Y]ms | [diff] |
| Throughput | [X] req/s | [Y] req/s | [diff] |
| Error Rate | [X]% | [Y]% | [diff] |
| CPU Utilization | [X]% | <[Y]% | [diff] |
| Memory Utilization | [X]% | <[Y]% | [diff] |

### Baseline Conclusion
[Over SLA / At risk / Within SLA] — Primary concern: [metric]
```

### Step 3: Run Profiling Checklist

Apply the **performance-profiling** skill:

```
## Profiling Checklist

### Application Layer
- [ ] CPU profiling (flame graph)
  - Hot methods identified: [list]
  - CPU time breakdown: [summary]

- [ ] Memory profiling
  - Allocation rate: [X] MB/s
  - Heap usage trend: [rising / stable / falling]
  - Top allocating methods: [list]

- [ ] Thread analysis
  - Active threads: [count]
  - Blocked threads: [count]
  - Thread pool utilization: [X]%

- [ ] GC analysis (if applicable)
  - GC frequency: [N] per minute
  - GC pause time: [X]ms average
  - GC overhead: [X]% of CPU

### Database Layer
- [ ] Slow query analysis
  - Queries > 100ms: [count]
  - Slowest query: [query] ([time]ms)

- [ ] Query plan analysis
  - Full table scans: [count]
  - Missing indexes: [list]

- [ ] Connection pool
  - Pool size: [current] / [max]
  - Wait time: [X]ms average

### Network Layer
- [ ] External API calls
  - Slowest dependency: [service] ([time]ms)
  - Timeout rate: [X]%

- [ ] Payload analysis
  - Request size: [X] KB average
  - Response size: [X] KB average

### Infrastructure Layer
- [ ] Resource utilization
  - CPU: [X]% (throttled: [yes/no])
  - Memory: [X]% (swapping: [yes/no])
  - Disk I/O: [X] IOPS

- [ ] Container/pod metrics (if applicable)
  - Restarts: [count]
  - OOMKills: [count]
```

### Step 4: Analyze Bottlenecks

Identify where time is spent:

```
## Request Time Breakdown

**Endpoint**: [path]
**Total Time**: [X]ms (p99)

### Time Distribution

| Component | Time | % | Status |
|-----------|------|---|--------|
| Network/LB | [X]ms | [Y]% | [OK/Investigate] |
| Framework | [X]ms | [Y]% | [OK/Investigate] |
| Business Logic | [X]ms | [Y]% | [OK/Investigate] |
| Database | [X]ms | [Y]% | [OK/Investigate] |
| External APIs | [X]ms | [Y]% | [OK/Investigate] |
| Serialization | [X]ms | [Y]% | [OK/Investigate] |

### Visual Breakdown

```
Total: 2000ms
├── Database Query 1 ██████████████████░░ 900ms (45%)
├── External API Call ████████░░░░░░░░░░░░ 400ms (20%)
├── Database Query 2 ██████░░░░░░░░░░░░░░ 300ms (15%)
├── JSON Serialization ████░░░░░░░░░░░░░░░░ 200ms (10%)
├── Business Logic ██░░░░░░░░░░░░░░░░░░ 150ms (7.5%)
└── Framework Overhead █░░░░░░░░░░░░░░░░░░░ 50ms (2.5%)
```

### Bottleneck Priority

1. **Database Query 1** (45% of time) — Highest impact
2. **External API Call** (20% of time) — High impact
3. **Database Query 2** (15% of time) — Medium impact
```

### Step 5: Generate Optimization Recommendations

```
## Optimization Recommendations

### Quick Wins (Low Effort, High Impact)

| # | Optimization | Expected Gain | Effort | How to Implement |
|---|--------------|---------------|--------|------------------|
| 1 | Add index on `orders.user_id` | -400ms | 1 hour | `CREATE INDEX idx_orders_user_id ON orders(user_id);` |
| 2 | Enable response compression | -50ms | 30 min | Set `server.compression.enabled=true` |
| 3 | Increase connection pool to 20 | -100ms | 15 min | Update `spring.datasource.hikari.maximum-pool-size` |

### Short-term (Medium Effort)

| # | Optimization | Expected Gain | Effort | How to Implement |
|---|--------------|---------------|--------|------------------|
| 4 | Cache user preferences | -200ms | 4 hours | Add Redis cache with 5min TTL |
| 5 | Use projection instead of SELECT * | -100ms | 2 hours | Modify repository queries |
| 6 | Batch external API calls | -150ms | 3 hours | Aggregate requests before calling |

### Long-term (High Effort)

| # | Optimization | Expected Gain | Effort | How to Implement |
|---|--------------|---------------|--------|------------------|
| 7 | Async processing for non-critical work | -300ms | 2 days | Move email/logging to queue |
| 8 | Read replica for reporting queries | -500ms | 1 week | Database architecture change |
| 9 | Switch to faster serializer | -50ms | 3 days | Replace Jackson with DSL-JSON |

### Implementation Priority

**Phase 1 (This Sprint)**: Items 1-3
- Expected improvement: -550ms (28% faster)
- Effort: 2 hours

**Phase 2 (Next Sprint)**: Items 4-6
- Expected improvement: -450ms (additional 22% faster)
- Effort: 1 day

**Phase 3 (This Quarter)**: Items 7-9
- Expected improvement: -850ms (additional 42% faster)
- Effort: 2 weeks
```

### Step 6: Create Profiling Report

```
## Performance Profiling Report

**Service**: [Name]
**Date**: [Analysis date]
**Analyst**: [Name]
**Environment**: [prod/staging/local]
**Load Profile**: [X req/s, Y concurrent users]

---

### Executive Summary

Performance profiling of [component] identified [N] bottlenecks contributing to [current latency]. The primary bottleneck is [top issue] accounting for [X]% of response time. Implementing the recommended optimizations is expected to reduce p99 latency from [current] to [target], a [Y]% improvement.

---

### Current State

[Insert baseline metrics table]

---

### Profiling Results

[Insert request time breakdown]

---

### Bottlenecks Identified

#### Bottleneck #1: [Name]
- **Location**: [File:Line or Component]
- **Impact**: [X]ms ([Y]% of total time)
- **Root Cause**: [Why this is slow]
- **Evidence**: [Profiler output, query plan, etc.]

**Optimization**:
```[language]
// Before
[slow code/query]

// After
[optimized code/query]
```
**Expected Improvement**: -[X]ms

[Repeat for each major bottleneck]

---

### Recommendations

[Insert optimization recommendations table]

---

### Implementation Roadmap

| Phase | Timeline | Optimizations | Expected Gain |
|-------|----------|---------------|---------------|
| 1 | [Week 1] | [Items] | -[X]ms |
| 2 | [Week 2-3] | [Items] | -[X]ms |
| 3 | [Month 2] | [Items] | -[X]ms |

---

### Monitoring Plan

After optimizations, track:
- [ ] p50/p95/p99 latency by endpoint
- [ ] Throughput (requests/second)
- [ ] Error rate
- [ ] Resource utilization (CPU, memory)
- [ ] Database query execution time

**Alerting Thresholds**:
- Warning: p99 > [X]ms
- Critical: p99 > [Y]ms

---

### Next Steps

1. [ ] Review recommendations with team
2. [ ] Implement Phase 1 optimizations
3. [ ] Re-profile to validate improvements
4. [ ] Update SLOs based on new baseline
```

Save as markdown.

### Step 7: Offer Next Steps

- "Should I **implement the quick wins** now?"
- "Want me to **set up continuous profiling** to catch regressions?"
- "Should I **create tickets** for each optimization?"
- "Want me to **analyze another endpoint** with similar patterns?"
- "Should I **profile under different load conditions**?"

## Notes

- **Profile in production-like conditions** — local profiling misses real-world issues
- **Focus on the critical path** — optimize what users actually experience
- **Measure before and after** — prove optimizations work
- **Watch for tradeoffs** — memory vs CPU, latency vs throughput
- **Avoid premature optimization** — profile first, optimize based on data

## Quick Reference: Profiling Tools

| Language | CPU Profiler | Memory Profiler | Tracing |
|----------|--------------|-----------------|---------|
| Java | async-profiler, JFR | VisualVM, MAT | Micrometer, OpenTelemetry |
| Python | py-spy, cProfile | memory_profiler, tracemalloc | OpenTelemetry |
| Node.js | clinic.js, 0x | heapdump, memwatch | OpenTelemetry |
| Go | pprof | pprof | OpenTelemetry |
| .NET | dotTrace | dotMemory | OpenTelemetry |
