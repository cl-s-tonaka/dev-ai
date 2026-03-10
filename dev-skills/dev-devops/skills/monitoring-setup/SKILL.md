---
name: monitoring-setup
version: 1.0.0
description: Design comprehensive monitoring, alerting, and observability solutions for production systems
tags:
  - monitoring
  - observability
  - alerting
  - prometheus
  - grafana
  - devops
---

# Monitoring and Observability Setup

## Metadata

| Property | Value |
|----------|-------|
| Name | monitoring-setup |
| Version | 1.0.0 |
| Category | DevOps |
| Complexity | High |

## Instructions

Design comprehensive monitoring and observability solutions that provide visibility into system health, performance, and business metrics. Create actionable alerts, meaningful dashboards, and effective incident response workflows.

### The Three Pillars of Observability

| Pillar | Purpose | Tools |
|--------|---------|-------|
| Metrics | Numeric measurements over time | Prometheus, Datadog, CloudWatch |
| Logs | Event records with context | ELK Stack, Loki, Splunk |
| Traces | Request flow across services | Jaeger, Zipkin, OpenTelemetry |

### Monitoring Stack Options

| Stack | Components | Best For |
|-------|------------|----------|
| Prometheus + Grafana | Prometheus, Alertmanager, Grafana | Kubernetes, open source |
| ELK Stack | Elasticsearch, Logstash, Kibana | Log analysis, search |
| Datadog | All-in-one SaaS | Enterprise, low ops overhead |
| AWS Native | CloudWatch, X-Ray, CloudTrail | AWS-centric environments |
| Grafana Cloud | Prometheus, Loki, Tempo | Managed open source |

### Metrics Categories

```
┌─────────────────────────────────────────────────────────────┐
│                    MONITORING PYRAMID                       │
├─────────────────────────────────────────────────────────────┤
│  Business Metrics     │  Revenue, Conversions, Active Users │
├───────────────────────┼─────────────────────────────────────┤
│  Application Metrics  │  Request Rate, Errors, Duration     │
├───────────────────────┼─────────────────────────────────────┤
│  Service Metrics      │  Queue Depth, Connection Pool, Cache│
├───────────────────────┼─────────────────────────────────────┤
│  Infrastructure       │  CPU, Memory, Disk, Network         │
└───────────────────────┴─────────────────────────────────────┘
```

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| architecture | string | Yes | System architecture (monolith, microservices, serverless) |
| platform | string | Yes | Infrastructure platform (k8s, ecs, ec2, lambda) |
| stack | string | Yes | Monitoring stack preference |
| services | array | Yes | List of services to monitor |
| sla_requirements | object | No | SLA/SLO requirements |
| alerting_channels | array | No | Alert notification channels (slack, pagerduty, email) |

## Output Process

### Step 1: Define Key Metrics (RED/USE Methods)

**RED Method (Request-driven services):**
| Metric | Description | Example Query |
|--------|-------------|---------------|
| Rate | Requests per second | `rate(http_requests_total[5m])` |
| Errors | Failed requests per second | `rate(http_requests_total{status=~"5.."}[5m])` |
| Duration | Request latency distribution | `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))` |

**USE Method (Resources):**
| Metric | Description | Example Query |
|--------|-------------|---------------|
| Utilization | % time resource is busy | `avg(rate(container_cpu_usage_seconds_total[5m])) / avg(container_spec_cpu_quota)` |
| Saturation | Queue depth, waiting | `avg(container_cpu_cfs_throttled_seconds_total)` |
| Errors | Error events | `rate(node_disk_io_time_weighted_seconds_total[5m])` |

### Step 2: Configure Metrics Collection

**Prometheus Configuration:**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

rule_files:
  - /etc/prometheus/rules/*.yml

scrape_configs:
  # Prometheus self-monitoring
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Kubernetes service discovery
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__

  # Node Exporter
  - job_name: 'node-exporter'
    kubernetes_sd_configs:
      - role: node
    relabel_configs:
      - source_labels: [__address__]
        regex: '(.*):10250'
        replacement: '${1}:9100'
        target_label: __address__
```

**Application Instrumentation (Go):**
```go
import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    httpRequestsTotal = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total HTTP requests",
        },
        []string{"method", "endpoint", "status"},
    )

    httpRequestDuration = prometheus.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "HTTP request duration in seconds",
            Buckets: []float64{.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10},
        },
        []string{"method", "endpoint"},
    )
)

func init() {
    prometheus.MustRegister(httpRequestsTotal)
    prometheus.MustRegister(httpRequestDuration)
}
```

### Step 3: Configure Alerting

**Alertmanager Configuration:**
```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/xxx'

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty-critical'
      continue: true
    - match:
        severity: warning
      receiver: 'slack-warnings'

receivers:
  - name: 'default'
    slack_configs:
      - channel: '#alerts'
        send_resolved: true

  - name: 'pagerduty-critical'
    pagerduty_configs:
      - service_key: '<pagerduty-service-key>'
        severity: critical

  - name: 'slack-warnings'
    slack_configs:
      - channel: '#alerts-warnings'
        send_resolved: true
```

**Alert Rules:**
```yaml
# alerts.yml
groups:
  - name: application
    rules:
      # High Error Rate
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
          description: "Error rate is {{ $value | humanizePercentage }} (>1%)"
          runbook_url: "https://wiki.example.com/runbooks/high-error-rate"

      # High Latency
      - alert: HighLatency
        expr: |
          histogram_quantile(0.99,
            sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service)
          ) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency on {{ $labels.service }}"
          description: "P99 latency is {{ $value | humanizeDuration }}"

      # Pod Crash Looping
      - alert: PodCrashLooping
        expr: |
          increase(kube_pod_container_status_restarts_total[1h]) > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Pod {{ $labels.pod }} is crash looping"
          description: "Pod has restarted {{ $value }} times in the last hour"

  - name: infrastructure
    rules:
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
        annotations:
          summary: "High CPU usage on {{ $labels.pod }}"
          description: "CPU usage is {{ $value | humanizePercentage }}"

      # High Memory Usage
      - alert: HighMemoryUsage
        expr: |
          (
            container_memory_usage_bytes
            /
            container_spec_memory_limit_bytes
          ) > 0.9
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.pod }}"
          description: "Memory usage is {{ $value | humanizePercentage }}"

      # Disk Space Running Low
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
        annotations:
          summary: "Disk space low on {{ $labels.instance }}"
          description: "Only {{ $value | humanizePercentage }} disk space remaining"
```

### Step 4: Create Dashboards

**Grafana Dashboard JSON (Service Overview):**
```json
{
  "dashboard": {
    "title": "Service Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m]))",
            "legendFormat": "req/s"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "gauge",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m])) * 100",
            "legendFormat": "Error %"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "steps": [
                {"value": 0, "color": "green"},
                {"value": 1, "color": "yellow"},
                {"value": 5, "color": "red"}
              ]
            }
          }
        }
      },
      {
        "title": "Latency (P50, P95, P99)",
        "type": "timeseries",
        "targets": [
          {
            "expr": "histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))",
            "legendFormat": "P50"
          },
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))",
            "legendFormat": "P95"
          },
          {
            "expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))",
            "legendFormat": "P99"
          }
        ]
      }
    ]
  }
}
```

## Output Format

```markdown
## Monitoring Setup: [System Name]

### Architecture
[Diagram of monitoring components and data flow]

### Metrics Collected

| Category | Metric | Source | Retention |
|----------|--------|--------|-----------|
| Application | http_requests_total | App instrumentation | 15 days |
| Application | http_request_duration_seconds | App instrumentation | 15 days |
| Infrastructure | container_cpu_usage_seconds_total | cAdvisor | 7 days |
| Infrastructure | container_memory_usage_bytes | cAdvisor | 7 days |

### Alert Rules

| Alert | Severity | Threshold | Escalation |
|-------|----------|-----------|------------|
| HighErrorRate | Critical | >1% for 5m | PagerDuty immediate |
| HighLatency | Warning | P99>1s for 5m | Slack #alerts |
| PodCrashLooping | Warning | >5 restarts/hr | Slack #alerts |

### Dashboards

1. **Service Overview**: Request rate, errors, latency
2. **Infrastructure**: CPU, memory, disk, network
3. **Business Metrics**: Conversions, revenue, active users

### Runbooks

| Alert | Runbook |
|-------|---------|
| HighErrorRate | [Link to runbook] |
| HighLatency | [Link to runbook] |
```

## Notes

- Start with the RED method for services, USE method for resources
- Alert on symptoms (high latency), not causes (high CPU)
- Every alert should have a runbook
- Use alert severity levels consistently: critical (page), warning (notify), info (log)
- Implement alert deduplication and grouping
- Set up on-call rotations with escalation policies
- Review and tune alerts regularly (weekly alert review)
- Keep dashboards focused: one dashboard per service/domain
- Use recording rules for frequently computed expressions
- Implement SLO-based alerting (burn rate alerts) for mature systems
