---
name: deployment-strategy
version: 1.0.0
description: Design deployment strategies including Blue-Green, Canary, Rolling updates, and feature flags for safe production releases
tags:
  - deployment
  - release
  - blue-green
  - canary
  - rolling
  - devops
---

# Deployment Strategy Design

## Metadata

| Property | Value |
|----------|-------|
| Name | deployment-strategy |
| Version | 1.0.0 |
| Category | DevOps |
| Complexity | High |

## Instructions

Design and implement deployment strategies that minimize risk, enable quick rollbacks, and ensure zero or near-zero downtime during production releases. Select appropriate strategies based on application requirements, infrastructure capabilities, and risk tolerance.

### Strategy Comparison Matrix

| Strategy | Downtime | Risk | Rollback Speed | Resource Cost | Complexity |
|----------|----------|------|----------------|---------------|------------|
| Rolling | Zero | Medium | Medium (minutes) | 1x + surge | Low |
| Blue-Green | Zero | Low | Instant | 2x | Medium |
| Canary | Zero | Very Low | Fast | 1x + canary | High |
| A/B Testing | Zero | Low | Fast | 1x + variants | High |
| Recreate | Yes | High | Slow | 1x | Very Low |
| Shadow | Zero | Very Low | N/A (testing only) | 2x | Very High |

### Strategy Selection Guide

```
                    ┌─────────────────────────────────────────┐
                    │     What are your requirements?         │
                    └─────────────────────────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
              ┌─────▼─────┐      ┌─────▼─────┐      ┌─────▼─────┐
              │  Minimal  │      │   Zero    │      │  Feature  │
              │   Cost    │      │ Downtime  │      │  Testing  │
              └─────┬─────┘      └─────┬─────┘      └─────┬─────┘
                    │                  │                  │
              ┌─────▼─────┐      ┌─────▼─────┐      ┌─────▼─────┐
              │  Rolling  │      │   Risk    │      │    A/B    │
              │  Update   │      │ Tolerance │      │  Testing  │
              └───────────┘      └─────┬─────┘      └───────────┘
                                       │
                            ┌──────────┼──────────┐
                            │          │          │
                      ┌─────▼────┐ ┌───▼───┐ ┌────▼─────┐
                      │   Low    │ │ Medium│ │   High   │
                      │ (Canary) │ │(B/G)  │ │(Rolling) │
                      └──────────┘ └───────┘ └──────────┘
```

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| application_type | string | Yes | Type of application (web, api, worker, database) |
| traffic_pattern | string | Yes | Traffic characteristics (steady, spiky, critical) |
| downtime_tolerance | string | Yes | Acceptable downtime (zero, minutes, maintenance-window) |
| rollback_requirement | string | Yes | Rollback speed needed (instant, fast, acceptable) |
| infrastructure | string | Yes | Infrastructure platform (k8s, ecs, ec2, lambda) |
| team_experience | string | No | Team's deployment experience level |

## Output Process

### Step 1: Analyze Requirements

- [ ] Assess application criticality and SLA requirements
- [ ] Evaluate infrastructure capabilities
- [ ] Determine acceptable risk level
- [ ] Consider team experience and operational overhead
- [ ] Review monitoring and observability readiness

### Step 2: Design Rolling Update Strategy

**Best For:** Most applications, low resource overhead

```yaml
# Kubernetes Rolling Update
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 1 extra pod during update
      maxUnavailable: 0  # Zero downtime
  template:
    spec:
      containers:
        - name: myapp
          image: myapp:v2
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 10
```

**Rollout Progression:**
```
Time  Pod-1    Pod-2    Pod-3    Pod-4    Pod-5(surge)
T0    v1 ✓     v1 ✓     v1 ✓     v1 ✓
T1    v1 ✓     v1 ✓     v1 ✓     v1 ✓     v2 (starting)
T2    v1 ✓     v1 ✓     v1 ✓     v1 ✓     v2 ✓
T3    v2 ✓     v1 ✓     v1 ✓     v1 ✓     (terminated)
T4    v2 ✓     v2 ✓     v1 ✓     v1 ✓
T5    v2 ✓     v2 ✓     v2 ✓     v1 ✓
T6    v2 ✓     v2 ✓     v2 ✓     v2 ✓     Done!
```

### Step 3: Design Blue-Green Deployment

**Best For:** Instant rollback needs, stateless applications

```yaml
# Blue Environment (current production)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-blue
  labels:
    app: myapp
    version: blue
spec:
  replicas: 4
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
        - name: myapp
          image: myapp:v1

---
# Green Environment (new version)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-green
  labels:
    app: myapp
    version: green
spec:
  replicas: 4
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
        - name: myapp
          image: myapp:v2

---
# Service - switch selector to swap traffic
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  selector:
    app: myapp
    version: blue  # Change to 'green' to switch
  ports:
    - port: 80
      targetPort: 8080
```

**Traffic Switch:**
```bash
# Switch to green
kubectl patch service myapp -p '{"spec":{"selector":{"version":"green"}}}'

# Rollback to blue
kubectl patch service myapp -p '{"spec":{"selector":{"version":"blue"}}}'
```

### Step 4: Design Canary Deployment

**Best For:** High-risk changes, gradual validation

```yaml
# Using Istio for traffic splitting
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
    - myapp
  http:
    - match:
        - headers:
            x-canary:
              exact: "true"
      route:
        - destination:
            host: myapp
            subset: canary
    - route:
        - destination:
            host: myapp
            subset: stable
          weight: 95
        - destination:
            host: myapp
            subset: canary
          weight: 5

---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: myapp
spec:
  host: myapp
  subsets:
    - name: stable
      labels:
        version: v1
    - name: canary
      labels:
        version: v2
```

**Progressive Rollout Schedule:**
```
Stage    Canary %    Duration    Validation
1        1%          10 min      Error rate, latency
2        5%          30 min      Error rate, latency, conversions
3        10%         1 hour      Full metrics analysis
4        25%         2 hours     Business metrics validation
5        50%         4 hours     Extended monitoring
6        100%        -           Full rollout
```

**Automated Canary with Flagger:**
```yaml
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: myapp
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  service:
    port: 80
  analysis:
    interval: 1m
    threshold: 5
    maxWeight: 50
    stepWeight: 10
    metrics:
      - name: request-success-rate
        thresholdRange:
          min: 99
        interval: 1m
      - name: request-duration
        thresholdRange:
          max: 500
        interval: 1m
    webhooks:
      - name: load-test
        url: http://flagger-loadtester/
        timeout: 5s
        metadata:
          cmd: "hey -z 1m -q 10 -c 2 http://myapp-canary/"
```

### Step 5: Define Rollback Procedures

**Automatic Rollback Triggers:**
| Metric | Threshold | Action |
|--------|-----------|--------|
| Error Rate | > 1% increase | Pause, alert |
| Error Rate | > 5% increase | Auto rollback |
| P99 Latency | > 2x baseline | Pause, alert |
| P99 Latency | > 5x baseline | Auto rollback |
| Health Checks | < 95% passing | Auto rollback |

**Manual Rollback Commands:**
```bash
# Kubernetes - Rolling Update
kubectl rollout undo deployment/myapp

# Kubernetes - to specific revision
kubectl rollout undo deployment/myapp --to-revision=2

# AWS ECS
aws ecs update-service --cluster prod --service myapp \
  --task-definition myapp:previous-version

# Docker Swarm
docker service rollback myapp
```

## Output Format

```markdown
## Deployment Strategy: [Application Name]

### Recommended Strategy: [Strategy Name]

**Rationale:**
[Why this strategy fits the requirements]

### Architecture

```
[ASCII diagram of deployment flow]
```

### Implementation Details

#### Pre-Deployment Checklist
- [ ] Health check endpoints implemented
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented and tested
- [ ] Database migrations are backward compatible
- [ ] Feature flags configured (if applicable)

#### Deployment Steps
1. [Step-by-step deployment process]

#### Rollback Steps
1. [Step-by-step rollback process]

### Success Criteria

| Metric | Threshold | Measurement |
|--------|-----------|-------------|
| Error Rate | < 0.1% | Prometheus |
| P99 Latency | < 200ms | Prometheus |
| Success Rate | > 99.9% | Prometheus |

### Configuration Files
[Include relevant YAML/JSON configurations]

### Monitoring Dashboard
[Grafana/Datadog dashboard queries]
```

## Notes

- Always test rollback procedures before production deployments
- Database migrations must be backward compatible for zero-downtime deploys
- Use feature flags to decouple deployment from release
- Monitor business metrics, not just technical metrics
- Consider time-of-day for deployments (avoid peak hours)
- Implement circuit breakers for resilience during partial failures
- Document runbooks for all failure scenarios
- Use deployment slots/immutable infrastructure when possible
- Communicate deployment windows to stakeholders
- Keep previous versions available for quick rollback
