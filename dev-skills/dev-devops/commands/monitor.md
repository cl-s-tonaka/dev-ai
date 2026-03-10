---
description: Design monitoring, alerting, and dashboards for production systems
argument-hint: "[setup|alerts|dashboard] <context>"
---

# /monitor -- Monitoring Design

Design comprehensive monitoring solutions including metrics collection, alerting rules, and dashboards for production observability.

## Invocation

```
/monitor setup Prometheus + Grafana for Kubernetes microservices
/monitor alerts for e-commerce checkout service with SLO 99.9%
/monitor dashboard for API gateway with latency and error tracking
/monitor                # asks which mode and requirements
```

## Modes

---

### Setup Mode

Configure a complete monitoring stack for your infrastructure.

#### Workflow

**Step 1: Gather Requirements**

Ask for (or extract from context):
- **Infrastructure**: Platform (Kubernetes, EC2, serverless)
- **Stack Preference**: Open source (Prometheus) or managed (Datadog)
- **Services**: List of services to monitor
- **Retention**: How long to keep metrics (7d, 30d, 1y)
- **Alert Channels**: Where to send alerts (Slack, PagerDuty, email)

**Step 2: Design Metrics Collection**

Apply the **monitoring-setup** skill:

**The Three Pillars of Observability:**
| Pillar | Purpose | Tooling |
|--------|---------|---------|
| Metrics | Numeric time-series | Prometheus, Datadog, CloudWatch |
| Logs | Event records | Loki, ELK, Splunk |
| Traces | Request flow | Jaeger, Zipkin, X-Ray |

**Metrics Categories:**
```
Business    │ Revenue, conversions, active users
Application │ Request rate, errors, duration (RED)
Service     │ Queue depth, connection pool, cache hit
Infrastructure │ CPU, memory, disk, network (USE)
```

**Step 3: Generate Stack Configuration**

**Prometheus Stack (Kubernetes):**

```yaml
# prometheus-values.yaml (Helm)
prometheus:
  prometheusSpec:
    retention: 15d
    resources:
      requests:
        cpu: 500m
        memory: 2Gi
      limits:
        cpu: 2
        memory: 8Gi
    serviceMonitorSelector: {}
    podMonitorSelector: {}

alertmanager:
  config:
    global:
      resolve_timeout: 5m
      slack_api_url: 'https://hooks.slack.com/services/xxx'
    route:
      group_by: ['alertname', 'service']
      group_wait: 30s
      group_interval: 5m
      repeat_interval: 4h
      receiver: 'slack-notifications'
      routes:
        - match:
            severity: critical
          receiver: 'pagerduty-critical'
    receivers:
      - name: 'slack-notifications'
        slack_configs:
          - channel: '#alerts'
            send_resolved: true
      - name: 'pagerduty-critical'
        pagerduty_configs:
          - service_key: '<key>'

grafana:
  enabled: true
  persistence:
    enabled: true
    size: 10Gi
  dashboardProviders:
    dashboardproviders.yaml:
      apiVersion: 1
      providers:
        - name: 'default'
          folder: ''
          type: file
          options:
            path: /var/lib/grafana/dashboards
```

**Application Instrumentation:**

```yaml
# ServiceMonitor for auto-discovery
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: myapp
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      app: myapp
  endpoints:
    - port: http
      path: /metrics
      interval: 15s
```

---

### Alerts Mode

Design effective alerting rules based on SLOs and operational needs.

#### Workflow

**Step 1: Define SLOs**

Apply the **sre-principles** skill:

| Service | SLO | Error Budget (28d) |
|---------|-----|-------------------|
| Checkout API | 99.9% availability | 40.32 minutes |
| Search API | 99.5% availability | 3.36 hours |
| Checkout API | P99 < 500ms | 40.32 minutes |

**Step 2: Design Alert Rules**

**Alert Severity Levels:**
| Severity | Response | Example |
|----------|----------|---------|
| Critical | Page immediately | Service down, error rate > 5% |
| Warning | Notify during hours | Error rate > 1%, high latency |
| Info | Log only | Approaching threshold |

**Prometheus Alert Rules:**

```yaml
groups:
  - name: service-slos
    rules:
      # High Error Rate - Critical
      - alert: HighErrorRate
        expr: |
          (
            sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
            /
            sum(rate(http_requests_total[5m])) by (service)
          ) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.service }}"
          description: "Error rate is {{ $value | humanizePercentage }}"
          runbook_url: "https://wiki/runbooks/high-error-rate"

      # High Latency - Warning
      - alert: HighLatency
        expr: |
          histogram_quantile(0.99,
            sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
          ) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High P99 latency on {{ $labels.service }}"
          description: "P99 latency is {{ $value | humanizeDuration }}"

      # Error Budget Burn Rate - Fast Burn
      - alert: ErrorBudgetFastBurn
        expr: |
          (
            1 - (
              sum(rate(http_requests_total{status!~"5.."}[1h])) by (service)
              /
              sum(rate(http_requests_total[1h])) by (service)
            )
          ) / (1 - 0.999) > 14.4
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Fast error budget burn on {{ $labels.service }}"
          description: "At current rate, budget exhausted in < 2 hours"

  - name: infrastructure
    rules:
      # Pod Crash Looping
      - alert: PodCrashLooping
        expr: |
          increase(kube_pod_container_status_restarts_total[1h]) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Pod {{ $labels.pod }} is crash looping"

      # High CPU Usage
      - alert: HighCPUUsage
        expr: |
          (
            sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)
            /
            sum(container_spec_cpu_quota/container_spec_cpu_period) by (pod)
          ) > 0.9
        for: 10m
        labels:
          severity: warning

      # High Memory Usage
      - alert: HighMemoryUsage
        expr: |
          (container_memory_usage_bytes / container_spec_memory_limit_bytes) > 0.9
        for: 10m
        labels:
          severity: warning

      # Disk Space Low
      - alert: DiskSpaceLow
        expr: |
          (
            node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"}
            /
            node_filesystem_size_bytes{fstype!~"tmpfs|overlay"}
          ) < 0.15
        for: 10m
        labels:
          severity: warning
```

**Step 3: Configure Alert Routing**

```yaml
# Alertmanager routing
route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'default'
  routes:
    # Critical alerts go to PagerDuty immediately
    - match:
        severity: critical
      receiver: 'pagerduty-critical'
      continue: true  # Also send to Slack

    # Business hours for warnings
    - match:
        severity: warning
      receiver: 'slack-warnings'
      mute_time_intervals:
        - nights-and-weekends

    # Specific service routing
    - match:
        service: checkout
      receiver: 'checkout-team'

mute_time_intervals:
  - name: nights-and-weekends
    time_intervals:
      - weekdays: ['saturday', 'sunday']
      - times:
          - start_time: '18:00'
            end_time: '09:00'
```

---

### Dashboard Mode

Create focused, actionable monitoring dashboards.

#### Workflow

**Step 1: Identify Dashboard Purpose**

| Dashboard Type | Audience | Focus |
|----------------|----------|-------|
| Service Overview | On-call SRE | Health, alerts, key metrics |
| Deep Dive | Engineers | Debugging, investigation |
| Business Metrics | Product/Exec | KPIs, trends |
| Infrastructure | Platform team | Resource utilization |

**Step 2: Design Dashboard Layout**

**Service Overview Dashboard Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE: CHECKOUT API                     │
├───────────────┬───────────────┬───────────────┬─────────────┤
│ Request Rate  │  Error Rate   │  P99 Latency  │ Availability│
│   1.2k/s ✓    │   0.05% ✓     │   120ms ✓     │  99.97% ✓   │
├───────────────┴───────────────┴───────────────┴─────────────┤
│                  Request Rate & Errors (Graph)              │
│  ─────────────────────────────────────────────────────────  │
├─────────────────────────────────────────────────────────────┤
│                  Latency Distribution (Graph)                │
│  ─────────────────────────────────────────────────────────  │
├───────────────────────────┬─────────────────────────────────┤
│    Top Endpoints          │     Error Breakdown             │
│  /checkout   800/s        │  500: 12 (timeout)              │
│  /cart       350/s        │  502: 5 (upstream)              │
│  /payment    50/s         │  503: 3 (overload)              │
└───────────────────────────┴─────────────────────────────────┘
```

**Step 3: Generate Dashboard JSON**

```json
{
  "dashboard": {
    "title": "Checkout API Overview",
    "tags": ["checkout", "api", "production"],
    "timezone": "browser",
    "refresh": "30s",
    "panels": [
      {
        "title": "Request Rate",
        "type": "stat",
        "gridPos": { "x": 0, "y": 0, "w": 6, "h": 4 },
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{service=\"checkout\"}[5m]))",
            "legendFormat": "req/s"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "reqps",
            "thresholds": {
              "mode": "absolute",
              "steps": [
                { "value": 0, "color": "green" },
                { "value": 2000, "color": "yellow" },
                { "value": 3000, "color": "red" }
              ]
            }
          }
        }
      },
      {
        "title": "Error Rate",
        "type": "gauge",
        "gridPos": { "x": 6, "y": 0, "w": 6, "h": 4 },
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{service=\"checkout\",status=~\"5..\"}[5m])) / sum(rate(http_requests_total{service=\"checkout\"}[5m])) * 100"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "percent",
            "min": 0,
            "max": 5,
            "thresholds": {
              "steps": [
                { "value": 0, "color": "green" },
                { "value": 0.5, "color": "yellow" },
                { "value": 1, "color": "red" }
              ]
            }
          }
        }
      },
      {
        "title": "Latency (P50, P95, P99)",
        "type": "timeseries",
        "gridPos": { "x": 0, "y": 4, "w": 24, "h": 8 },
        "targets": [
          {
            "expr": "histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket{service=\"checkout\"}[5m])) by (le))",
            "legendFormat": "P50"
          },
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{service=\"checkout\"}[5m])) by (le))",
            "legendFormat": "P95"
          },
          {
            "expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{service=\"checkout\"}[5m])) by (le))",
            "legendFormat": "P99"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "unit": "s"
          }
        }
      }
    ]
  }
}
```

## Output Format

```markdown
## Monitoring Setup: [System Name]

### Stack Components
| Component | Purpose | Configuration |
|-----------|---------|---------------|
| Prometheus | Metrics collection | 15s scrape, 15d retention |
| Alertmanager | Alert routing | Slack + PagerDuty |
| Grafana | Visualization | 3 dashboards |
| Loki | Log aggregation | 7d retention |

### Metrics Collected
| Category | Metric | Source | Query |
|----------|--------|--------|-------|
| Availability | Success rate | App | `rate(http_requests_total{status!~"5.."}[5m])` |
| Latency | P99 response time | App | `histogram_quantile(0.99, ...)` |
| Saturation | CPU usage | cAdvisor | `container_cpu_usage_seconds_total` |

### Alert Rules (5 total)
| Alert | Severity | Condition | Action |
|-------|----------|-----------|--------|
| HighErrorRate | Critical | > 1% for 5m | Page on-call |
| HighLatency | Warning | P99 > 500ms | Slack #alerts |

### Dashboards
1. **Service Overview** - Key metrics at a glance
2. **Deep Dive** - Detailed debugging view
3. **Infrastructure** - Resource utilization

### Runbooks
| Alert | Runbook |
|-------|---------|
| HighErrorRate | [Link] |
```

## Notes

- Start with RED (Rate, Errors, Duration) for services
- Use USE (Utilization, Saturation, Errors) for resources
- Every alert must have a runbook
- Alert on symptoms (high latency), not causes (high CPU)
- Use alert severity consistently: critical (page), warning (notify)
- Keep dashboards focused: one purpose per dashboard
- Review and tune alerts weekly to reduce noise
- Set up on-call rotations with clear escalation paths
