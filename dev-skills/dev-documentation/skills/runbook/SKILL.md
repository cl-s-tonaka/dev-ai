---
name: runbook
version: 1.0.0
description: Create operations runbooks with procedures for deployment, incident response, monitoring, and system maintenance
tags:
  - documentation
  - runbook
  - operations
  - incident-response
  - deployment
  - sre
---

# Operations Runbook

## Metadata

| Property | Value |
|----------|-------|
| Name | runbook |
| Version | 1.0.0 |
| Category | Documentation |
| Complexity | High |

## Instructions

Create comprehensive operations runbooks that enable on-call engineers and operators to effectively manage systems during incidents, perform routine maintenance, and execute deployments safely. Runbooks should be clear, actionable, and tested.

### Runbook Types

1. **Incident Response** - Alert-specific troubleshooting
2. **Deployment** - Release and rollback procedures
3. **Maintenance** - Scheduled operations tasks
4. **Recovery** - Disaster recovery procedures
5. **On-Call** - General on-call reference

### Key Principles

- Write for someone woken up at 3 AM
- Be specific and actionable
- Include copy-pasteable commands
- Test procedures regularly
- Keep updated with system changes

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| service_name | string | Yes | Name of the service/system |
| runbook_type | string | Yes | Type (incident, deployment, maintenance, recovery) |
| alert_name | string | No | Specific alert this runbook addresses |
| system_architecture | string | No | Description of the system |
| dependencies | array | No | List of dependent services |

## Output Process

### Step 1: Define Scope

- [ ] Identify the specific scenario covered
- [ ] List prerequisites and access requirements
- [ ] Document system context
- [ ] Define success criteria

### Step 2: Create Procedures

- [ ] Write step-by-step instructions
- [ ] Include verification steps
- [ ] Add rollback procedures
- [ ] Document escalation paths

### Step 3: Add Supporting Information

- [ ] Include diagnostic commands
- [ ] Add relevant dashboards and logs
- [ ] Document common failure modes
- [ ] List contact information

### Step 4: Test and Validate

- [ ] Walk through the runbook
- [ ] Test commands in staging
- [ ] Get peer review
- [ ] Schedule regular reviews

## Output Format

### Incident Response Runbook Template

```markdown
# Runbook: [Alert Name / Incident Type]

**Service**: [Service Name]
**Owner**: [Team Name]
**Last Updated**: YYYY-MM-DD
**Last Tested**: YYYY-MM-DD

---

## Overview

**Alert**: `[alert_name]`
**Severity**: P1 | P2 | P3
**SLO Impact**: [Which SLO is affected]

### What This Alert Means
[Brief explanation of what triggers this alert and why it matters]

### Potential Impact
- Customer-facing: [Yes/No - description]
- Data integrity: [Yes/No - description]
- Revenue impact: [Yes/No - description]

---

## Prerequisites

### Access Required
- [ ] AWS Console access to `production` account
- [ ] Kubernetes cluster access (`kubectl` configured)
- [ ] Database read access to `orders-db`
- [ ] PagerDuty responder role

### Tools Needed
- `kubectl` (v1.25+)
- `aws-cli` (v2.x)
- `psql` (PostgreSQL client)

---

## Quick Triage (< 5 minutes)

### 1. Assess Scope
```bash
# Check if alert is firing across multiple instances
kubectl get pods -n production -l app=order-service | grep -v Running
```

### 2. Check Recent Changes
```bash
# List recent deployments
kubectl rollout history deployment/order-service -n production

# Check last deployment time
kubectl describe deployment order-service -n production | grep -A 5 "Events"
```

### 3. View Key Metrics
- [Grafana Dashboard: Order Service](https://grafana.example.com/d/order-service)
- [Error Rate Panel](https://grafana.example.com/d/order-service?panelId=5)

---

## Diagnosis

### Symptom: High Error Rate (> 1%)

#### Check Application Logs
```bash
# Get recent error logs
kubectl logs -n production -l app=order-service --since=10m | grep ERROR | tail -50

# Search for specific error patterns
kubectl logs -n production -l app=order-service --since=10m | grep -E "NullPointer|OutOfMemory|Connection"
```

#### Check Dependencies
```bash
# Verify database connectivity
kubectl exec -it deploy/order-service -n production -- nc -zv orders-db.internal 5432

# Check cache connectivity
kubectl exec -it deploy/order-service -n production -- redis-cli -h cache.internal ping
```

#### Common Causes
| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Connection refused to DB | Database overloaded | [Scale DB](#scale-database) |
| Timeout errors | Network issue | [Check network](#check-network) |
| OOM kills | Memory leak | [Restart pods](#restart-pods) |

### Symptom: High Latency (p99 > 500ms)

#### Check Slow Queries
```sql
-- Connect to database and check slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle'
  AND now() - pg_stat_activity.query_start > interval '5 seconds'
ORDER BY duration DESC;
```

---

## Remediation Procedures

### Restart Pods

**When to use**: OOM errors, memory leaks, stuck processes

```bash
# Rolling restart (safe - no downtime)
kubectl rollout restart deployment/order-service -n production

# Verify rollout
kubectl rollout status deployment/order-service -n production

# Watch pods
kubectl get pods -n production -l app=order-service -w
```

**Expected outcome**: New pods should be Running within 2-3 minutes
**Verification**: Error rate should return to normal within 5 minutes

### Scale Service

**When to use**: High CPU/memory, request queuing

```bash
# Scale up (current: 5 replicas)
kubectl scale deployment/order-service -n production --replicas=10

# Verify scaling
kubectl get pods -n production -l app=order-service
```

**Expected outcome**: Additional pods running within 2 minutes
**Verification**: CPU/memory utilization should decrease

### Scale Database

**When to use**: Database CPU > 80%, connection exhaustion

```bash
# Scale RDS via AWS CLI
aws rds modify-db-instance \
  --db-instance-identifier orders-db-production \
  --db-instance-class db.r5.2xlarge \
  --apply-immediately

# Monitor scaling progress
aws rds describe-db-instances \
  --db-instance-identifier orders-db-production \
  --query 'DBInstances[0].DBInstanceStatus'
```

**Expected outcome**: Instance modification takes 5-15 minutes
**Verification**: Database CPU should decrease after scaling completes

### Rollback Deployment

**When to use**: Issues started after recent deployment

```bash
# Check deployment history
kubectl rollout history deployment/order-service -n production

# Rollback to previous version
kubectl rollout undo deployment/order-service -n production

# Or rollback to specific revision
kubectl rollout undo deployment/order-service -n production --to-revision=42

# Verify rollback
kubectl rollout status deployment/order-service -n production
```

**Expected outcome**: Previous version running within 3 minutes
**Verification**: Confirm error rate decreases and version matches expected

---

## Escalation

### When to Escalate

- [ ] Issue persists after 15 minutes of troubleshooting
- [ ] P1 incident affecting > 10% of users
- [ ] Data integrity concerns
- [ ] Security-related issues
- [ ] Unsure about next steps

### Escalation Contacts

| Role | Contact | When |
|------|---------|------|
| On-Call Primary | PagerDuty | First responder |
| On-Call Secondary | PagerDuty | Primary unavailable |
| Engineering Lead | @eng-lead (Slack) | Technical decisions |
| Product | @product-oncall | Customer comms |
| Security | @security-oncall | Security incidents |

### How to Escalate

1. **Page via PagerDuty**: Click "Escalate" in the incident
2. **Slack**: Post in `#incident-response` with incident link
3. **Call**: Use PagerDuty phone tree

---

## Post-Incident

### Cleanup Checklist
- [ ] Return scaling to normal levels
- [ ] Remove any temporary fixes
- [ ] Verify monitoring is nominal
- [ ] Update incident ticket

### Documentation
- [ ] Record timeline in incident ticket
- [ ] Note root cause if identified
- [ ] Identify follow-up actions
- [ ] Schedule postmortem if P1/P2

---

## Appendix

### Useful Commands

```bash
# Get all pods with resource usage
kubectl top pods -n production -l app=order-service

# Describe pod for events
kubectl describe pod <pod-name> -n production

# Port-forward for local debugging
kubectl port-forward svc/order-service 8080:80 -n production

# Get pod logs with timestamps
kubectl logs <pod-name> -n production --timestamps

# Execute into pod for debugging
kubectl exec -it <pod-name> -n production -- /bin/sh
```

### Dashboard Links
- [Service Dashboard](https://grafana.example.com/d/order-service)
- [Database Metrics](https://grafana.example.com/d/postgres)
- [Error Tracking](https://sentry.example.com/order-service)
- [Traces](https://jaeger.example.com/search?service=order-service)

### Related Runbooks
- [Database Failover](./database-failover.md)
- [Cache Recovery](./cache-recovery.md)
- [Network Issues](./network-troubleshooting.md)

### Change Log
| Date | Author | Change |
|------|--------|--------|
| 2024-03-15 | @sre | Initial version |
| 2024-03-20 | @sre | Added database scaling section |
```

### Deployment Runbook Template

```markdown
# Deployment Runbook: [Service Name]

## Pre-Deployment Checklist

- [ ] All tests passing in CI
- [ ] Changelog reviewed
- [ ] Feature flags configured
- [ ] Monitoring dashboards ready
- [ ] Rollback plan confirmed
- [ ] On-call notified

## Deployment Steps

### 1. Initiate Deployment
```bash
# Deploy to staging first
./deploy.sh staging v2.1.0

# Run smoke tests
./smoke-tests.sh staging
```

### 2. Production Deployment
```bash
# Deploy to production
./deploy.sh production v2.1.0

# Monitor deployment
kubectl rollout status deployment/service -n production
```

### 3. Verification
- [ ] Health checks passing
- [ ] No increase in error rate
- [ ] Latency within SLO
- [ ] Feature working as expected

## Rollback Procedure

```bash
# Immediate rollback
kubectl rollout undo deployment/service -n production

# Verify rollback
kubectl rollout status deployment/service -n production
```
```

## Notes

- Test runbooks during game days or chaos engineering exercises
- Use consistent formatting across all runbooks
- Include expected output for commands
- Update runbooks immediately after incidents reveal gaps
- Automate repetitive remediation steps
- Keep runbooks in version control alongside code
- Review and update runbooks quarterly
- Include screenshots of dashboards for visual reference
- Make commands copy-pasteable (avoid placeholders when possible)
- Cross-reference related runbooks
