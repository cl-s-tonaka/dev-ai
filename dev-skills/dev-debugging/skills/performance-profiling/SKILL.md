---
name: performance-profiling
description: "Profile application performance to identify bottlenecks in CPU, memory, I/O, and network. Use when diagnosing slow requests, high resource usage, latency spikes, or capacity planning."
---

# Performance Profiling

## Purpose

You are a performance engineer profiling **$ARGUMENTS**. This skill identifies performance bottlenecks across CPU, memory, I/O, and network dimensions to guide optimization efforts.

## Context

Performance profiling is the systematic measurement and analysis of application behavior to identify bottlenecks. Effective profiling combines metrics collection, hotspot identification, and root cause analysis to prioritize optimization work with the highest impact.

## Instructions

### 1. Define Performance Goals

Establish what "good" looks like:

| Metric | Target | Current | Gap |
|--------|--------|---------|-----|
| Response time (p50) | < 100ms | [measured] | |
| Response time (p99) | < 500ms | [measured] | |
| Throughput | > 1000 req/s | [measured] | |
| Error rate | < 0.1% | [measured] | |
| CPU utilization | < 70% | [measured] | |
| Memory utilization | < 80% | [measured] | |

### 2. Collect Baseline Metrics

Gather data across performance dimensions:

**CPU Profiling**:
- Identify hot methods/functions consuming CPU time
- Look for inefficient algorithms (O(n²) operations)
- Check for excessive GC activity

**Memory Profiling**:
- Heap usage and allocation rate
- Object retention and GC pressure
- Memory leaks (growing heap over time)

**I/O Profiling**:
- Disk read/write latency
- Database query execution time
- File system operations

**Network Profiling**:
- Connection latency
- DNS resolution time
- TLS handshake overhead
- Payload sizes

### 3. Use the Profiling Checklist

```
## Performance Profiling Checklist

### Application Layer
- [ ] Profile CPU hotspots (flame graph)
- [ ] Analyze memory allocation patterns
- [ ] Review GC logs for pause times
- [ ] Check thread pool utilization
- [ ] Identify lock contention
- [ ] Review async/await patterns

### Database Layer
- [ ] Analyze slow query logs
- [ ] Check query execution plans
- [ ] Review index usage
- [ ] Check connection pool sizing
- [ ] Monitor query frequency (N+1 problems)
- [ ] Verify connection timeouts

### Network Layer
- [ ] Measure DNS lookup time
- [ ] Check connection establishment time
- [ ] Review TLS negotiation overhead
- [ ] Analyze payload compression
- [ ] Check for connection reuse
- [ ] Monitor external API latency

### Infrastructure Layer
- [ ] Check CPU throttling (containers)
- [ ] Review memory limits vs usage
- [ ] Analyze disk I/O wait
- [ ] Check network bandwidth saturation
- [ ] Review load balancer distribution
- [ ] Monitor auto-scaling behavior
```

### 4. Analyze Bottlenecks

Categorize findings by impact:

```
## Bottleneck Analysis

### Critical (>50% of latency)

**Bottleneck #1**: Database query in getUserOrders()
- Location: OrderRepository.java:45
- Impact: 450ms average (60% of request time)
- Cause: Missing index on orders.user_id
- Evidence: EXPLAIN shows full table scan

### Significant (20-50% of latency)

**Bottleneck #2**: JSON serialization
- Location: ResponseMapper.java:23
- Impact: 150ms average (20% of request time)
- Cause: Serializing unnecessary nested objects
- Evidence: Flame graph shows Jackson dominating CPU

### Minor (<20% of latency)

**Bottleneck #3**: Logging overhead
- Location: RequestFilter.java:12
- Impact: 50ms average (7% of request time)
- Cause: Synchronous logging to disk
- Evidence: Thread blocking on I/O
```

### 5. Generate Optimization Recommendations

Prioritize by effort vs impact:

| Optimization | Expected Gain | Effort | Priority |
|--------------|---------------|--------|----------|
| Add index on orders.user_id | -400ms | Low | P0 |
| Use projection in query | -100ms | Low | P1 |
| Enable response compression | -50ms | Low | P1 |
| Async logging | -50ms | Medium | P2 |
| Connection pooling tuning | -30ms | Low | P2 |
| Upgrade to faster serializer | -100ms | High | P3 |

### 6. Generate Profiling Report

```
## Performance Profiling Report

**Application**: [Name/Service]
**Environment**: [prod/staging/local]
**Date**: [Analysis date]
**Load Conditions**: [concurrent users, request rate]

### Executive Summary
- **Primary Bottleneck**: [description]
- **Expected Improvement**: [X]ms latency reduction ([Y]% improvement)
- **Quick Wins Identified**: [count]
- **Recommended Investment**: [hours/days]

### Current Performance

| Metric | Baseline | Target | Status |
|--------|----------|--------|--------|
| p50 Latency | [X]ms | [Y]ms | [Over/Under] |
| p99 Latency | [X]ms | [Y]ms | [Over/Under] |
| Throughput | [X] req/s | [Y] req/s | [Over/Under] |
| Error Rate | [X]% | [Y]% | [Over/Under] |

### Request Breakdown

```
Total Request Time: 750ms

┌────────────────────────────────────────────────────────────────┐
│ Database Query (450ms)                    ████████████████░░░░ │ 60%
│ JSON Serialization (150ms)                █████░░░░░░░░░░░░░░░ │ 20%
│ Business Logic (100ms)                    ███░░░░░░░░░░░░░░░░░ │ 13%
│ Network/Framework (50ms)                  █░░░░░░░░░░░░░░░░░░░ │  7%
└────────────────────────────────────────────────────────────────┘
```

### Bottlenecks Identified

#### 1. [Bottleneck Name] — [Impact]ms
**Location**: [File:Line or Component]
**Root Cause**: [Why this is slow]
**Evidence**: [Profiler output, metrics, trace]

**Recommendation**:
```[language]
// Before
[slow code]

// After
[optimized code]
```

**Expected Improvement**: [X]ms ([Y]%)

### Optimization Roadmap

| Phase | Optimizations | Expected Gain | Timeline |
|-------|---------------|---------------|----------|
| Quick Wins | [list] | -[X]ms | 1-2 days |
| Short Term | [list] | -[X]ms | 1-2 weeks |
| Long Term | [list] | -[X]ms | 1+ months |

### Monitoring Recommendations

Track these metrics post-optimization:
- [ ] p50/p95/p99 latency by endpoint
- [ ] Database query execution time
- [ ] GC pause frequency and duration
- [ ] CPU and memory utilization
- [ ] Error rate

### Next Steps

1. [ ] Implement quick wins
2. [ ] Re-profile to validate improvements
3. [ ] Set up continuous profiling
4. [ ] Establish performance regression tests
```

Save as markdown. Generate profiling scripts if needed.

## Notes

- Profile in production-like conditions with realistic data volumes
- Focus on the critical path — optimize what matters to users
- Measure before and after every change
- Watch for optimization side effects (increased memory for CPU savings)
- Set up continuous profiling to catch regressions early

---

### Further Reading

- [Flame Graphs by Brendan Gregg](https://www.brendangregg.com/flamegraphs.html)
- [High Performance Browser Networking](https://hpbn.co/)
- [Performance Optimization Patterns](https://martinfowler.com/articles/patterns-of-legacy-displacement.html)
