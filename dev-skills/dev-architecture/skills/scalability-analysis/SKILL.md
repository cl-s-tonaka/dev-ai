---
name: scalability-analysis
description: "Analyze system architecture for scalability bottlenecks, model capacity requirements, and recommend scaling strategies. Use when preparing for traffic growth, diagnosing performance issues, or planning infrastructure investments."
---

# Scalability Analysis

## Metadata
- **Name**: scalability-analysis
- **Description**: Identify scalability bottlenecks and recommend horizontal/vertical scaling strategies with capacity planning.
- **Triggers**: scalability, performance bottleneck, capacity planning, load testing, scaling strategy

## Instructions

You are a performance architect analyzing scalability for $ARGUMENTS.

Your task is to identify bottlenecks, model capacity requirements, and recommend scaling strategies to handle growth.

## Input Requirements
- Current system architecture
- Traffic patterns (peak, average, growth rate)
- Performance metrics (latency, throughput, error rates)
- Resource utilization (CPU, memory, disk, network)
- SLA requirements (availability, latency targets)
- Cost constraints
- Growth projections

## Scalability Analysis Template

### 1. Current State Assessment

**Traffic Profile**
| Metric | Current | Peak | Growth Rate |
|--------|---------|------|-------------|
| Requests/second | 1,000 | 5,000 | 20%/month |
| Concurrent users | 10,000 | 50,000 | 15%/month |
| Data volume | 100 GB | - | 10 GB/month |
| Bandwidth | 100 Mbps | 500 Mbps | 25%/month |

**Resource Utilization**
| Resource | Average | Peak | Threshold |
|----------|---------|------|-----------|
| CPU | 40% | 85% | 70% |
| Memory | 60% | 90% | 80% |
| Disk I/O | 30% | 70% | 60% |
| Network | 20% | 60% | 50% |

### 2. Bottleneck Identification

**Common Bottleneck Types**

| Layer | Bottleneck | Symptoms | Detection |
|-------|------------|----------|-----------|
| Application | Single-threaded processing | CPU bound, low throughput | Profiling |
| Application | Memory leaks | OOM errors, restarts | Heap analysis |
| Application | Blocking I/O | Thread pool exhaustion | Thread dumps |
| Database | Lock contention | Slow queries, timeouts | Lock monitoring |
| Database | Missing indexes | Full table scans | Query analysis |
| Database | Connection exhaustion | Connection errors | Pool metrics |
| Network | Bandwidth saturation | Packet loss, latency | Network monitoring |
| Infrastructure | Single point of failure | Cascading failures | Architecture review |

**Bottleneck Analysis**
```
Component: Database (PostgreSQL)
Symptom: P99 latency spikes during peak hours
Root Cause: Lock contention on orders table during writes
Evidence: pg_stat_activity shows lock waits > 5 seconds
Impact: 30% of requests exceed SLA during peak
```

### 3. Capacity Modeling

**Little's Law**
```
L = λ × W
Where:
  L = Average number of items in system
  λ = Average arrival rate
  W = Average time in system

Example:
  1000 requests/second × 0.1 second = 100 concurrent requests
```

**Amdahl's Law (Parallelization Limits)**
```
Speedup = 1 / (S + (1-S)/N)
Where:
  S = Serial fraction (cannot be parallelized)
  N = Number of processors

Example: 20% serial code
  Max speedup with infinite processors = 1/0.2 = 5x
```

**Capacity Planning Table**
| Timeframe | Users | RPS | Required Capacity |
|-----------|-------|-----|-------------------|
| Current | 10K | 1,000 | 4 servers |
| 6 months | 25K | 2,500 | 10 servers |
| 1 year | 50K | 5,000 | 20 servers |
| 2 years | 100K | 10,000 | 40 servers |

### 4. Scaling Strategies

**Vertical Scaling (Scale Up)**
| Pros | Cons |
|------|------|
| Simple implementation | Hardware limits |
| No code changes | Single point of failure |
| Lower operational complexity | Expensive at high end |

**Horizontal Scaling (Scale Out)**
| Pros | Cons |
|------|------|
| Linear capacity growth | Application must support |
| Fault tolerance | Increased complexity |
| Cost-effective | Data consistency challenges |

**Scaling Decision Matrix**
| Component | Strategy | Implementation |
|-----------|----------|----------------|
| Stateless services | Horizontal | Auto-scaling group |
| Database reads | Horizontal | Read replicas |
| Database writes | Vertical + Sharding | Larger instance + partition |
| Cache | Horizontal | Distributed cache cluster |
| Queue | Horizontal | Partitioned queues |
| Storage | Horizontal | Object storage / CDN |

### 5. Scalability Patterns

**Caching**
```
Cache Layers:
1. Browser cache (static assets)
2. CDN (geographic distribution)
3. API Gateway cache (response caching)
4. Application cache (Redis/Memcached)
5. Database cache (query cache)

Cache Strategies:
- Cache-aside: App manages cache
- Write-through: Write to cache and DB
- Write-behind: Async write to DB
- Refresh-ahead: Proactive refresh
```

**Database Scaling**
```
Read Scaling:
- Read replicas (async replication)
- CQRS (separate read models)
- Caching layer

Write Scaling:
- Sharding (horizontal partition)
- Queue-based writes (async)
- Event sourcing (append-only)
```

**Load Balancing**
```
Algorithms:
- Round-robin: Simple distribution
- Weighted: Based on server capacity
- Least connections: Route to least busy
- IP hash: Session affinity
- Latency-based: Route to fastest
```

**Async Processing**
```
Use Cases:
- Non-critical operations (notifications)
- Long-running tasks (reports)
- Batch processing (data imports)
- Rate-limited APIs (external calls)

Implementation:
- Message queues (RabbitMQ, SQS)
- Job schedulers (Sidekiq, Celery)
- Event streaming (Kafka)
```

### 6. Database Scalability

**Sharding Strategies**
| Strategy | Pros | Cons |
|----------|------|------|
| Range-based | Simple queries | Hotspots possible |
| Hash-based | Even distribution | Range queries harder |
| Directory-based | Flexible | Lookup overhead |
| Geographic | Low latency | Complex replication |

**Sharding Key Selection**
```
Good: user_id (even distribution, query locality)
Bad: timestamp (hotspot on recent shard)
Bad: country (uneven distribution)
```

### 7. Infrastructure Recommendations

**Auto-scaling Configuration**
```yaml
Scaling Policy:
  Min instances: 4
  Max instances: 20
  Target CPU: 60%
  Scale out: Add 2 instances when CPU > 70% for 3 min
  Scale in: Remove 1 instance when CPU < 40% for 10 min
  Cooldown: 5 minutes
```

**Cost Optimization**
| Strategy | Savings | Trade-off |
|----------|---------|-----------|
| Reserved instances | 30-60% | Commitment |
| Spot instances | 60-90% | Interruptions |
| Right-sizing | 20-40% | Monitoring effort |
| Auto-scaling | Variable | Complexity |

### 8. Monitoring and Alerting

**Key Metrics**
| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| CPU | 70% | 85% | Scale out |
| Memory | 75% | 90% | Investigate leak |
| Latency P99 | 200ms | 500ms | Optimize or scale |
| Error rate | 1% | 5% | Investigate |
| Queue depth | 1000 | 5000 | Add consumers |

**Capacity Alerts**
```
Alert: "Database connections approaching limit"
Condition: connection_count > 80% of max_connections
Severity: Warning
Action: Scale database or optimize pooling
```

### 9. Load Testing Plan

**Test Scenarios**
| Scenario | Target | Duration | Pass Criteria |
|----------|--------|----------|---------------|
| Baseline | 1,000 RPS | 30 min | P99 < 100ms |
| Peak | 5,000 RPS | 15 min | P99 < 200ms |
| Stress | 10,000 RPS | 10 min | Graceful degradation |
| Soak | 2,000 RPS | 24 hours | No memory leak |

**Tools**
- k6: Scriptable load testing
- Locust: Python-based
- Gatling: Scala-based
- Artillery: Node.js-based

### 10. Improvement Roadmap

| Priority | Action | Effort | Impact | Timeline |
|----------|--------|--------|--------|----------|
| P0 | Add read replicas | Medium | High | 2 weeks |
| P0 | Implement caching | Medium | High | 3 weeks |
| P1 | Auto-scaling setup | Low | Medium | 1 week |
| P1 | Query optimization | Medium | Medium | 2 weeks |
| P2 | Database sharding | High | High | 8 weeks |
| P2 | CDN implementation | Low | Medium | 1 week |

## Output Process
1. Gather current metrics and traffic patterns
2. Identify bottlenecks through analysis
3. Model capacity requirements
4. Evaluate scaling strategies
5. Recommend specific improvements
6. Create load testing plan
7. Define monitoring and alerts
8. Build prioritized roadmap
9. Estimate costs and timeline

## Notes
- Measure before optimizing; data beats intuition
- Scale for 10x expected load; plan for 100x
- Premature optimization is expensive; solve real problems
- Horizontal scaling requires stateless services
- Database is often the bottleneck; address early
- Monitor continuously; load patterns change
- Document scaling decisions in ADRs
