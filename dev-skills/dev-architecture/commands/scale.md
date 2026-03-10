---
description: Analyze system scalability, identify bottlenecks, model capacity, and create an improvement roadmap
argument-hint: "<system or service to analyze>"
---

# /scale -- Scalability Analysis

Analyze a system's scalability characteristics, identify bottlenecks, model capacity requirements, and create a prioritized improvement roadmap.

## Invocation

```
/scale our checkout service is timing out during peak hours
/scale e-commerce platform preparing for Black Friday (10x traffic)
/scale [upload architecture diagrams or metrics]
/scale                    # asks about the system
```

## Workflow

### Step 1: Understand the System

Accept context from:
- System description ("checkout service")
- Performance problem ("timing out during peak")
- Growth target ("handle 10x traffic")
- Architecture diagrams or documentation
- Metrics and monitoring data

Ask clarifying questions:
1. **Current state**: What does the system look like today?
2. **Traffic**: Current RPS? Peak vs average? Growth rate?
3. **Performance**: Latency? Error rates? Timeout frequency?
4. **Resources**: CPU, memory, disk utilization?
5. **Symptoms**: When do problems occur? What triggers them?
6. **SLAs**: What are the availability and latency targets?
7. **Constraints**: Budget, timeline, team capacity?

### Step 2: Gather Metrics

Apply the **scalability-analysis** skill to document:

**Traffic Profile**
| Metric | Average | Peak | Target |
|--------|---------|------|--------|
| Requests/second | | | |
| Concurrent users | | | |
| Data volume | | | |
| Bandwidth | | | |

**Resource Utilization**
| Resource | Average | Peak | Threshold |
|----------|---------|------|-----------|
| CPU | | | 70% |
| Memory | | | 80% |
| Disk I/O | | | 60% |
| Network | | | 50% |
| Database connections | | | 80% |

**Performance Metrics**
| Metric | Current | SLA | Gap |
|--------|---------|-----|-----|
| P50 latency | | | |
| P99 latency | | | |
| Error rate | | | |
| Availability | | | |

### Step 3: Identify Bottlenecks

Analyze each layer:

**Application Layer**
```
Check for:
- Single-threaded processing
- Blocking I/O operations
- Memory leaks
- Inefficient algorithms
- Connection pool exhaustion

Detection methods:
- CPU profiling
- Thread dumps
- Memory analysis
- APM tools
```

**Database Layer**
```
Check for:
- Slow queries (missing indexes)
- Lock contention
- Connection limits
- Replication lag
- Disk I/O saturation

Detection methods:
- Query analysis (EXPLAIN)
- Lock monitoring
- Connection pool metrics
- Replication metrics
```

**Infrastructure Layer**
```
Check for:
- Single points of failure
- Network bandwidth limits
- Load balancer saturation
- Auto-scaling delays

Detection methods:
- Infrastructure monitoring
- Load testing
- Failover testing
```

**Bottleneck Summary**
| Component | Bottleneck | Impact | Evidence |
|-----------|------------|--------|----------|
| Database | Lock contention | High | P99 spikes to 5s |
| API Server | Thread pool | Medium | 503 errors at peak |
| Cache | Miss rate | Low | 40% cache misses |

### Step 4: Capacity Modeling

**Current Capacity**
```
Using Little's Law: L = λ × W
Where:
  λ (arrival rate) = [X] requests/second
  W (service time) = [Y] seconds
  L (concurrency) = [Z] concurrent requests

Current capacity: [N] servers can handle [M] RPS
```

**Growth Projections**
| Timeframe | Users | RPS | Required Capacity |
|-----------|-------|-----|-------------------|
| Current | | | |
| 3 months | | | |
| 6 months | | | |
| 1 year | | | |
| Peak event | | | |

**Scaling Requirements**
```
To handle [target RPS]:
- Application servers: [N] → [M] instances
- Database: [current] → [recommended]
- Cache: [current] → [recommended]
- Load balancer: [current] → [recommended]
```

### Step 5: Recommend Scaling Strategies

**Quick Wins (0-2 weeks)**
| Action | Effort | Impact | Notes |
|--------|--------|--------|-------|
| Add caching layer | Low | High | Cache hot data |
| Query optimization | Low | Medium | Add missing indexes |
| Connection pooling | Low | Medium | Tune pool sizes |
| Increase instance size | Low | Medium | Vertical scaling |

**Short-term (2-8 weeks)**
| Action | Effort | Impact | Notes |
|--------|--------|--------|-------|
| Read replicas | Medium | High | Offload reads |
| Auto-scaling | Medium | High | Handle traffic spikes |
| CDN implementation | Medium | Medium | Static assets |
| Async processing | Medium | Medium | Queue background work |

**Medium-term (2-6 months)**
| Action | Effort | Impact | Notes |
|--------|--------|--------|-------|
| Database sharding | High | High | Horizontal scale |
| Service decomposition | High | High | Isolate bottlenecks |
| Multi-region | High | High | Geo distribution |
| Event-driven architecture | High | Medium | Decouple services |

### Step 6: Design Scaling Patterns

**Caching Strategy**
```yaml
Layer 1 - Browser/CDN:
  What: Static assets, public content
  TTL: 1 hour - 1 day
  Invalidation: On deploy

Layer 2 - API Gateway:
  What: Authenticated response caching
  TTL: 1-5 minutes
  Invalidation: Time-based

Layer 3 - Application (Redis):
  What: Session, hot data, computed values
  TTL: Variable by data type
  Invalidation: Write-through

Layer 4 - Database:
  What: Query result cache
  TTL: Query-specific
  Invalidation: On table change
```

**Auto-scaling Configuration**
```yaml
Scaling Policy:
  Min instances: [N]
  Max instances: [M]
  Target CPU: 60%

Scale Out:
  Trigger: CPU > 70% for 3 minutes
  Action: Add 2 instances
  Cooldown: 5 minutes

Scale In:
  Trigger: CPU < 40% for 10 minutes
  Action: Remove 1 instance
  Cooldown: 10 minutes
```

**Database Scaling**
```yaml
Read Scaling:
  - Add read replicas (2-3)
  - Route reads to replicas
  - Accept eventual consistency

Write Scaling:
  - Vertical scaling (first)
  - Write queue for spikes
  - Sharding (if >10K writes/sec)

Sharding Strategy:
  Key: user_id
  Shards: 16
  Routing: Consistent hashing
```

### Step 7: Create Load Testing Plan

**Test Scenarios**
| Scenario | Target RPS | Duration | Success Criteria |
|----------|-----------|----------|------------------|
| Baseline | Current | 30 min | P99 < target |
| Peak | 2x current | 15 min | P99 < 2x target |
| Stress | 5x current | 10 min | Graceful degradation |
| Soak | 1.5x current | 24 hours | No memory leak |
| Spike | 10x current | 5 min | Recovery < 2 min |

**Testing Tools**
- k6: Scriptable, developer-friendly
- Locust: Python-based, distributed
- Gatling: Scala-based, detailed reports
- Artillery: Node.js, serverless-friendly

### Step 8: Define Monitoring & Alerts

**Key Metrics to Track**
| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| P99 latency | 200ms | 500ms | Scale out |
| Error rate | 1% | 5% | Investigate |
| CPU | 70% | 85% | Scale out |
| Memory | 75% | 90% | Investigate |
| Queue depth | 1000 | 5000 | Add consumers |
| DB connections | 70% | 85% | Pool tuning |

**Dashboards**
- System overview (RED metrics)
- Database performance
- Cache hit rates
- Queue depths
- Auto-scaling activity

### Step 9: Generate Improvement Roadmap

```markdown
## Scalability Improvement Roadmap

### Phase 1: Immediate (Week 1-2)
**Goal**: Stabilize current performance

| Priority | Action | Owner | Status |
|----------|--------|-------|--------|
| P0 | Add missing database indexes | DBA | |
| P0 | Increase connection pool size | Backend | |
| P1 | Implement response caching | Backend | |
| P1 | Set up auto-scaling | DevOps | |

### Phase 2: Short-term (Week 3-6)
**Goal**: Handle 2x current traffic

| Priority | Action | Owner | Status |
|----------|--------|-------|--------|
| P0 | Add database read replicas | DBA | |
| P0 | Implement Redis caching | Backend | |
| P1 | Move to async processing | Backend | |
| P1 | CDN for static assets | DevOps | |

### Phase 3: Medium-term (Month 2-3)
**Goal**: Handle 5x current traffic

| Priority | Action | Owner | Status |
|----------|--------|-------|--------|
| P0 | Database sharding | DBA | |
| P1 | Extract hot path service | Backend | |
| P1 | Multi-region deployment | DevOps | |

### Cost Estimates

| Phase | Infrastructure | Engineering | Total |
|-------|---------------|-------------|-------|
| Phase 1 | $500/mo | 2 weeks | $X |
| Phase 2 | $2,000/mo | 4 weeks | $Y |
| Phase 3 | $5,000/mo | 8 weeks | $Z |

### Success Metrics

| Metric | Current | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|---------|
| Max RPS | 1,000 | 2,000 | 5,000 | 10,000 |
| P99 latency | 500ms | 200ms | 150ms | 100ms |
| Error rate | 2% | 0.5% | 0.1% | 0.1% |
| Availability | 99% | 99.5% | 99.9% | 99.95% |
```

### Step 10: Review and Iterate

After generating, offer:
- "Want me to **detail a specific scaling pattern**?"
- "Should I **create load testing scripts**?"
- "Want me to **design the monitoring setup**?"
- "Should I **estimate costs** for cloud resources?"
- "Want me to **create an ADR** for a key decision?"

Save outputs as:
- `Scalability-Analysis.md` - Full analysis
- `Scaling-Roadmap.md` - Prioritized action plan

## Notes

- Measure before optimizing; data beats intuition
- Start with quick wins; build confidence
- Horizontal scaling requires stateless services
- Database is often the bottleneck; address early
- Plan for 10x stated requirements
- Include rollback plans for each change
- Monitor continuously; load patterns change
- Document scaling decisions in ADRs
