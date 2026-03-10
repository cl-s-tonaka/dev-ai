---
name: sre-principles
version: 1.0.0
description: Apply Site Reliability Engineering principles including SLI, SLO, SLA definitions, error budgets, and reliability practices
tags:
  - sre
  - reliability
  - sli
  - slo
  - sla
  - error-budget
  - devops
---

# SRE Principles Application

## Metadata

| Property | Value |
|----------|-------|
| Name | sre-principles |
| Version | 1.0.0 |
| Category | DevOps |
| Complexity | High |

## Instructions

Apply Site Reliability Engineering principles to define and maintain service reliability. Create meaningful SLIs, achievable SLOs, and enforceable SLAs. Implement error budgets to balance reliability with feature velocity.

### SLI/SLO/SLA Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  SLA (Service Level Agreement)                              │
│  External commitment with consequences (contracts, refunds) │
│  Example: "99.9% monthly uptime or credits issued"          │
├─────────────────────────────────────────────────────────────┤
│  SLO (Service Level Objective)                              │
│  Internal reliability target (stricter than SLA)            │
│  Example: "99.95% availability over 28 days"                │
├─────────────────────────────────────────────────────────────┤
│  SLI (Service Level Indicator)                              │
│  Quantitative measure of service behavior                   │
│  Example: "Successful requests / Total requests"            │
└─────────────────────────────────────────────────────────────┘
```

### Common SLI Categories

| Category | SLI | Measurement |
|----------|-----|-------------|
| Availability | Successful requests / Total requests | HTTP 2xx, 3xx, 4xx vs 5xx |
| Latency | Requests faster than threshold | P50, P95, P99 response time |
| Throughput | Requests processed per second | Sustained vs peak capacity |
| Correctness | Valid responses / Total responses | Business logic validation |
| Freshness | Data updated within threshold | Time since last update |
| Coverage | Data processed / Data available | Batch job completeness |

### Error Budget Concept

```
Error Budget = 1 - SLO Target

Example: 99.9% availability SLO
- Error Budget: 0.1% (43.2 minutes/month)
- Remaining budget determines velocity vs reliability focus

Budget Status Actions:
├── Budget > 50%: Ship features aggressively
├── Budget 25-50%: Normal velocity, monitor closely
├── Budget 10-25%: Slow down, focus on reliability
└── Budget < 10%: Feature freeze, reliability sprint
```

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| service_name | string | Yes | Name of the service |
| service_type | string | Yes | Type (api, web, batch, data-pipeline) |
| user_journeys | array | Yes | Critical user journeys |
| current_reliability | object | No | Current availability and latency data |
| business_criticality | string | No | Criticality level (critical, high, medium, low) |

## Output Process

### Step 1: Identify Critical User Journeys (CUJs)

**User Journey Mapping:**
| Journey | Description | User Impact | Revenue Impact |
|---------|-------------|-------------|----------------|
| Checkout | Complete purchase | Direct | High |
| Search | Find products | Discovery | Medium |
| Login | Authenticate user | Access | Medium |
| Dashboard | View analytics | Insights | Low |

**Journey Dependency Map:**
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Search    │────▶│  Product    │────▶│  Checkout   │
│   Service   │     │   Service   │     │   Service   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Search DB  │     │ Product DB  │     │ Payment API │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Step 2: Define SLIs

**Availability SLI:**
```yaml
sli:
  name: api_availability
  description: Proportion of successful API requests
  specification:
    numerator: HTTP requests with status 2xx, 3xx, or 4xx (excluding 429)
    denominator: All HTTP requests
  implementation:
    prometheus: |
      sum(rate(http_requests_total{status!~"5.."}[5m]))
      /
      sum(rate(http_requests_total[5m]))
```

**Latency SLI:**
```yaml
sli:
  name: api_latency
  description: Proportion of requests served within latency threshold
  specification:
    numerator: HTTP requests with duration < 200ms
    denominator: All HTTP requests
  implementation:
    prometheus: |
      sum(rate(http_request_duration_seconds_bucket{le="0.2"}[5m]))
      /
      sum(rate(http_request_duration_seconds_count[5m]))
  thresholds:
    - name: fast
      value: 0.1  # 100ms
      target: 0.95  # 95% of requests
    - name: acceptable
      value: 0.3  # 300ms
      target: 0.99  # 99% of requests
```

**Correctness SLI:**
```yaml
sli:
  name: data_correctness
  description: Proportion of responses with valid data
  specification:
    numerator: Responses passing validation checks
    denominator: All responses
  implementation:
    prometheus: |
      sum(rate(api_responses_valid_total[5m]))
      /
      sum(rate(api_responses_total[5m]))
```

### Step 3: Set SLOs

**SLO Document Template:**
```yaml
service: checkout-api
version: 1.0.0
owner: platform-team
review_date: 2024-Q2

slos:
  - name: availability
    description: Service responds successfully
    sli: api_availability
    target: 99.95%
    window: 28 days (rolling)
    consequences:
      budget_remaining_75: Normal operations
      budget_remaining_50: Weekly reliability review
      budget_remaining_25: Feature freeze consideration
      budget_remaining_0: Mandatory reliability sprint

  - name: latency_p50
    description: Median response time
    sli: api_latency_p50
    target: 99% of requests < 100ms
    window: 28 days (rolling)

  - name: latency_p99
    description: Tail latency
    sli: api_latency_p99
    target: 99.9% of requests < 500ms
    window: 28 days (rolling)

error_budget:
  availability:
    target: 99.95%
    window_minutes: 40320  # 28 days
    budget_minutes: 20.16  # 0.05% of 28 days
```

### Step 4: Calculate and Track Error Budget

**Error Budget Calculation:**
```python
# Error Budget Calculator

def calculate_error_budget(slo_target: float, window_days: int) -> dict:
    """Calculate error budget from SLO target."""
    window_minutes = window_days * 24 * 60

    error_budget_percentage = (1 - slo_target) * 100
    error_budget_minutes = window_minutes * (1 - slo_target)

    return {
        "slo_target": f"{slo_target * 100}%",
        "window_days": window_days,
        "error_budget_percentage": f"{error_budget_percentage:.3f}%",
        "error_budget_minutes": round(error_budget_minutes, 2),
        "error_budget_hours": round(error_budget_minutes / 60, 2),
    }

# Examples:
# 99.9% over 30 days = 43.2 minutes
# 99.95% over 28 days = 20.16 minutes
# 99.99% over 30 days = 4.32 minutes
```

**Error Budget Prometheus Queries:**
```yaml
# Remaining error budget (as ratio)
- record: slo:error_budget_remaining:ratio
  expr: |
    1 - (
      (
        1 - (
          sum(rate(http_requests_total{status!~"5.."}[28d]))
          /
          sum(rate(http_requests_total[28d]))
        )
      )
      /
      (1 - 0.9995)  # SLO target
    )

# Error budget burn rate (should be ~1.0 for sustainable)
- record: slo:error_budget_burn_rate:ratio
  expr: |
    (
      1 - (
        sum(rate(http_requests_total{status!~"5.."}[1h]))
        /
        sum(rate(http_requests_total[1h]))
      )
    )
    /
    (1 - 0.9995)  # Expected hourly error rate
```

### Step 5: Implement Error Budget Alerts

**Multi-Window Multi-Burn-Rate Alerts:**
```yaml
groups:
  - name: slo-alerts
    rules:
      # Fast burn - 2% budget consumed in 1 hour
      - alert: ErrorBudgetFastBurn
        expr: |
          slo:error_budget_burn_rate:1h > 14.4
          and
          slo:error_budget_burn_rate:5m > 14.4
        for: 2m
        labels:
          severity: critical
          window: 1h
        annotations:
          summary: "Burning error budget too fast"
          description: "At current rate, error budget exhausted in {{ $value | humanizeDuration }}"

      # Medium burn - 5% budget consumed in 6 hours
      - alert: ErrorBudgetMediumBurn
        expr: |
          slo:error_budget_burn_rate:6h > 6
          and
          slo:error_budget_burn_rate:30m > 6
        for: 15m
        labels:
          severity: warning
          window: 6h

      # Slow burn - 10% budget consumed in 3 days
      - alert: ErrorBudgetSlowBurn
        expr: |
          slo:error_budget_burn_rate:3d > 1
          and
          slo:error_budget_burn_rate:6h > 1
        for: 1h
        labels:
          severity: warning
          window: 3d

      # Low budget remaining
      - alert: ErrorBudgetLow
        expr: slo:error_budget_remaining:ratio < 0.25
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Error budget below 25%"
          description: "Only {{ $value | humanizePercentage }} error budget remaining"
```

### Step 6: Create SLO Dashboards

**Key SLO Dashboard Panels:**
| Panel | Purpose | Visualization |
|-------|---------|---------------|
| Current SLO Status | Quick health check | Stat with threshold colors |
| Error Budget Remaining | Budget status | Gauge (green/yellow/red) |
| Error Budget Burn Rate | Consumption speed | Time series |
| SLI Trend | Historical performance | Time series (28 day) |
| Incidents Impact | Budget consumed by incident | Bar chart |

## Output Format

```markdown
## SLO Definition: [Service Name]

### Service Overview
| Property | Value |
|----------|-------|
| Service | [Name] |
| Owner | [Team] |
| Criticality | [Level] |
| Review Cycle | Quarterly |

### Critical User Journeys
1. **[Journey Name]**: [Description]
   - Affected services: [List]
   - User impact: [Description]

### SLIs
| SLI | Description | Measurement |
|-----|-------------|-------------|
| Availability | [Description] | [Prometheus query] |
| Latency (P99) | [Description] | [Prometheus query] |

### SLOs
| SLO | Target | Window | Error Budget |
|-----|--------|--------|--------------|
| Availability | 99.95% | 28 days | 20.16 min |
| Latency P99 | 99.9% < 500ms | 28 days | 43.2 min |

### Error Budget Policy
| Budget Remaining | Action |
|------------------|--------|
| > 50% | Normal development velocity |
| 25-50% | Weekly reliability review |
| 10-25% | Reduced feature work, focus on reliability |
| < 10% | Feature freeze, reliability sprint |

### Alerting
| Alert | Severity | Condition |
|-------|----------|-----------|
| FastBurn | Critical | 2% budget/hr for 2m |
| MediumBurn | Warning | 5% budget/6hr for 15m |
| LowBudget | Warning | < 25% remaining |
```

## Notes

- SLOs should be based on user experience, not internal metrics
- Set SLOs slightly stricter than SLAs to provide buffer
- Start with achievable SLOs and tighten over time
- Review SLOs quarterly and adjust based on learnings
- Error budgets require executive buy-in to be effective
- Use multi-window, multi-burn-rate alerts to catch both fast and slow issues
- Document all SLO decisions and rationale
- Share error budget status transparently with all stakeholders
- SLO violations should trigger blameless postmortems
- Consider SLO dependencies: downstream service SLOs affect upstream
