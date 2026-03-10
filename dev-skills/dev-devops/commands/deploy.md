---
description: Design deployment strategies and implementation for production releases
argument-hint: "[strategy] <context>"
---

# /deploy -- Deployment Strategy Design

Design and implement deployment strategies including Blue-Green, Canary, Rolling updates, and feature flags for safe production releases.

## Invocation

```
/deploy Canary deployment for high-traffic e-commerce API on Kubernetes
/deploy Blue-Green strategy for AWS ECS with ALB
/deploy Rolling update for stateless microservices
/deploy feature-flags for gradual feature rollout
/deploy                # asks for strategy and requirements
```

## Modes

---

### Strategy Selection Mode

When no specific strategy is mentioned, help select the right approach.

**Decision Framework:**
```
┌─────────────────────────────────────────┐
│     What are your requirements?         │
└─────────────────────────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
┌────▼────┐  ┌─────▼─────┐  ┌────▼────┐
│ Instant │  │  Gradual  │  │  Low    │
│Rollback │  │ Validation│  │  Cost   │
└────┬────┘  └─────┬─────┘  └────┬────┘
     │             │             │
     ▼             ▼             ▼
Blue-Green     Canary       Rolling
```

**Strategy Comparison:**
| Strategy | Rollback Speed | Risk | Resource Cost | Complexity |
|----------|---------------|------|---------------|------------|
| Rolling | Minutes | Medium | 1x + surge | Low |
| Blue-Green | Instant | Low | 2x | Medium |
| Canary | Fast | Very Low | 1x + canary | High |
| Feature Flags | Instant | Very Low | 1x | High |

---

### Rolling Update Mode

**Best for:** Most applications, resource-efficient

#### Workflow

**Step 1: Configure Rolling Update**

Apply the **deployment-strategy** skill for Kubernetes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 25% extra capacity during update
      maxUnavailable: 0  # Zero downtime guarantee
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
            failureThreshold: 3
```

**Step 2: Monitor Rollout**

```bash
# Watch rollout progress
kubectl rollout status deployment/myapp

# Check pod status
kubectl get pods -l app=myapp -w

# View rollout history
kubectl rollout history deployment/myapp
```

**Step 3: Rollback if Needed**

```bash
# Immediate rollback
kubectl rollout undo deployment/myapp

# Rollback to specific revision
kubectl rollout undo deployment/myapp --to-revision=2
```

---

### Blue-Green Mode

**Best for:** Instant rollback needs, full environment validation

#### Workflow

**Step 1: Deploy Green Environment**

```yaml
# Green deployment (new version)
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
```

**Step 2: Validate Green Environment**

```bash
# Test green environment directly
kubectl port-forward svc/myapp-green 8080:80

# Run smoke tests
./smoke-tests.sh http://localhost:8080

# Verify metrics
kubectl logs -l version=green --tail=100
```

**Step 3: Switch Traffic**

```bash
# Switch service selector to green
kubectl patch service myapp -p '{"spec":{"selector":{"version":"green"}}}'

# Verify traffic switch
kubectl get endpoints myapp
```

**Step 4: Keep Blue for Rollback**

```bash
# Instant rollback if issues
kubectl patch service myapp -p '{"spec":{"selector":{"version":"blue"}}}'

# Clean up old blue after validation period (e.g., 24h)
kubectl delete deployment myapp-blue
```

---

### Canary Mode

**Best for:** High-risk changes, gradual validation, large user bases

#### Workflow

**Step 1: Deploy Canary**

```yaml
# Canary deployment (small percentage)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-canary
spec:
  replicas: 1  # 1 out of 10 total = 10%
  selector:
    matchLabels:
      app: myapp
      track: canary
  template:
    metadata:
      labels:
        app: myapp
        track: canary
    spec:
      containers:
        - name: myapp
          image: myapp:v2
```

**Step 2: Configure Traffic Split (Istio)**

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
    - myapp
  http:
    - route:
        - destination:
            host: myapp
            subset: stable
          weight: 95
        - destination:
            host: myapp
            subset: canary
          weight: 5
```

**Step 3: Progressive Rollout**

| Stage | Canary % | Duration | Validation |
|-------|----------|----------|------------|
| 1 | 1% | 10 min | Error rate, latency |
| 2 | 5% | 30 min | Error rate, latency, conversions |
| 3 | 10% | 1 hour | Full metrics analysis |
| 4 | 25% | 2 hours | Business metrics validation |
| 5 | 50% | 4 hours | Extended monitoring |
| 6 | 100% | - | Full rollout |

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
    threshold: 5        # Max failed checks before rollback
    maxWeight: 50       # Max canary traffic percentage
    stepWeight: 10      # Increment per interval
    metrics:
      - name: request-success-rate
        thresholdRange:
          min: 99
      - name: request-duration
        thresholdRange:
          max: 500
```

**Step 4: Monitor and Validate**

```bash
# Watch canary progress
kubectl get canary myapp -w

# Check metrics
kubectl -n istio-system port-forward svc/prometheus 9090

# Query: rate(http_requests_total{version="canary",status=~"5.."}[5m])
```

---

### Feature Flags Mode

**Best for:** Decoupling deployment from release, A/B testing

#### Workflow

**Step 1: Implement Feature Flag**

```javascript
// Using LaunchDarkly / Unleash / Custom
const flags = require('./feature-flags');

app.get('/checkout', async (req, res) => {
  const user = req.user;

  if (await flags.isEnabled('new-checkout-flow', user)) {
    return newCheckoutHandler(req, res);
  } else {
    return legacyCheckoutHandler(req, res);
  }
});
```

**Step 2: Configure Gradual Rollout**

```yaml
# Feature flag configuration
feature: new-checkout-flow
enabled: true
strategies:
  - name: gradualRollout
    parameters:
      percentage: 10
      stickiness: userId
  - name: userWithId
    parameters:
      userIds: "internal-testers,beta-users"
```

**Step 3: Monitor Feature Performance**

Track metrics by flag variant:
- Conversion rate
- Error rate
- Latency
- User feedback

**Step 4: Full Rollout or Rollback**

```yaml
# Full rollout
feature: new-checkout-flow
enabled: true
strategies:
  - name: default  # 100% of users

# Rollback
feature: new-checkout-flow
enabled: false
```

## Output Format

```markdown
## Deployment Strategy: [Application Name]

### Strategy: [Strategy Name]

**Rationale:**
[Why this strategy fits the requirements]

### Architecture Diagram
```
[ASCII diagram of deployment flow]
```

### Implementation Checklist

#### Pre-Deployment
- [ ] Health check endpoints implemented and tested
- [ ] Monitoring and alerting configured
- [ ] Rollback procedure documented
- [ ] Database migrations backward compatible
- [ ] Feature flags configured (if applicable)
- [ ] Smoke tests ready

#### Deployment Steps
1. [Step-by-step deployment process]

#### Validation
- [ ] Health checks passing
- [ ] Error rate < 0.1%
- [ ] P99 latency < [target]
- [ ] No increase in error logs

#### Rollback Steps
1. [Step-by-step rollback process]

### Configuration Files
[Include relevant YAML/JSON]

### Monitoring Queries
| Metric | Query |
|--------|-------|
| Error Rate | `rate(http_requests_total{status=~"5.."}[5m])` |
| Latency P99 | `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))` |
```

## Notes

- Always test rollback procedures before production deployments
- Database migrations must be backward compatible for zero-downtime
- Use feature flags to decouple deployment from release
- Monitor business metrics, not just technical metrics
- Avoid deploying during peak traffic hours
- Keep previous versions available for quick rollback
- Document runbooks for all failure scenarios
- Communicate deployment windows to stakeholders
