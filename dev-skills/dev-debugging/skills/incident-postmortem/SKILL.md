---
name: incident-postmortem
description: "Conduct blameless incident postmortems to document incidents, identify root causes, and create action items. Use after production incidents, outages, or significant bugs to learn and prevent recurrence."
---

# Incident Postmortem: Blameless Analysis

## Purpose

You are an incident commander conducting a blameless postmortem on **$ARGUMENTS**. This skill documents the incident, identifies root causes, and creates action items to prevent recurrence while fostering a learning culture.

## Context

A blameless postmortem focuses on understanding what happened and why, without assigning blame to individuals. The goal is organizational learning — improving systems, processes, and documentation rather than punishing people. People don't cause incidents; systems allow incidents to happen.

## Instructions

### 1. Gather Incident Information

Collect facts about the incident:

- What was the impact (users affected, revenue lost, SLA breached)?
- When did it start and end?
- How was it detected?
- Who was involved in response?
- What actions were taken?
- What systems were affected?

### 2. Reconstruct the Timeline

Build a detailed timeline of events:

```
## Incident Timeline

| Time (UTC) | Event | Actor | Notes |
|------------|-------|-------|-------|
| 14:00 | Deployment of v2.3.1 initiated | CI/CD | Automated deploy |
| 14:05 | Deployment completed | CI/CD | |
| 14:15 | Error rate increase detected | Monitoring | 5x normal error rate |
| 14:18 | PagerDuty alert fired | Monitoring | On-call paged |
| 14:22 | On-call engineer acknowledges | @alice | |
| 14:25 | Investigation started | @alice | Checking logs |
| 14:35 | Root cause identified | @alice | DB connection pool exhausted |
| 14:40 | Rollback initiated | @alice | Reverting to v2.3.0 |
| 14:45 | Rollback completed | CI/CD | |
| 14:50 | Error rate normalized | Monitoring | Incident resolved |
| 14:55 | All-clear announced | @alice | Slack #incidents |

**Total Duration**: 55 minutes
**Time to Detection**: 15 minutes
**Time to Mitigation**: 45 minutes
**Time to Resolution**: 50 minutes
```

### 3. Analyze Impact

Quantify the incident's effects:

```
## Impact Assessment

### User Impact
- **Users Affected**: ~10,000 (15% of active users)
- **Error Type**: 500 Internal Server Error on /api/orders
- **User Experience**: Unable to place orders for 45 minutes

### Business Impact
- **Revenue Loss**: ~$25,000 (estimated from typical hourly revenue)
- **SLA Breach**: Yes — 99.9% availability target missed
- **Support Tickets**: 45 tickets filed

### Technical Impact
- **Services Affected**: order-service, payment-service
- **Data Loss**: None
- **Recovery Actions**: Automated rollback, no manual intervention on data
```

### 4. Perform Root Cause Analysis

Apply structured analysis:

```
## Root Cause Analysis

### 5 Whys

**Problem**: Order API returned 500 errors for 45 minutes

**Why #1**: Why did the API return 500 errors?
→ Database queries were timing out

**Why #2**: Why were database queries timing out?
→ Connection pool was exhausted (0 available connections)

**Why #3**: Why was the connection pool exhausted?
→ New code in v2.3.1 opened connections without closing them

**Why #4**: Why weren't connections being closed?
→ Missing try-with-resources block in new OrderRepository method

**Why #5**: Why wasn't this caught before production?
→ Integration tests use mocked database; no connection pool test

**Root Cause**: Missing resource cleanup in OrderRepository.bulkCreate()
**Contributing Factor**: No integration tests for database connection handling

### Human Factors (Blameless)

Focus on systems, not individuals:

| Factor | What Happened | Systemic Issue |
|--------|---------------|----------------|
| Time pressure | PR reviewed quickly before deadline | No deploy freeze before holidays |
| Complexity | New batch API different from existing patterns | No template/pattern documentation |
| Fatigue | Late-night deploy | No deploy window policy |
| Knowledge gap | Unfamiliar with connection pool behavior | Missing onboarding for DB patterns |
```

### 5. Identify What Went Well

Acknowledge successful aspects:

```
## What Went Well

1. **Detection**: Monitoring caught the error rate spike within 15 minutes
2. **Response**: On-call acknowledged within 3 minutes of page
3. **Communication**: Clear updates in #incidents channel throughout
4. **Rollback**: Automated rollback worked flawlessly
5. **Documentation**: Runbooks were followed correctly
```

### 6. Identify What Could Be Improved

Surface improvement opportunities:

```
## What Could Be Improved

### Detection
- Alert took 15 minutes; could be faster with per-endpoint monitoring
- No canary deployment to catch issues with subset of traffic

### Response
- Initial investigation looked at wrong service (20 minutes lost)
- No clear escalation path when on-call needed help

### Prevention
- No static analysis for resource leaks
- No connection pool exhaustion test in CI
```

### 7. Create Action Items

Define specific, assignable follow-ups:

```
## Action Items

### Prevent Recurrence (P0 - This Week)

| # | Action | Owner | Deadline | Status |
|---|--------|-------|----------|--------|
| 1 | Fix connection leak in OrderRepository.bulkCreate() | @bob | Dec 20 | Done |
| 2 | Add integration test for connection pool exhaustion | @alice | Dec 22 | In Progress |
| 3 | Add SpotBugs rule for unclosed resources | @charlie | Dec 22 | Not Started |

### Improve Detection (P1 - Next Sprint)

| # | Action | Owner | Deadline | Status |
|---|--------|-------|----------|--------|
| 4 | Add per-endpoint error rate alerting | @ops | Jan 5 | Not Started |
| 5 | Implement canary deployments | @platform | Jan 15 | Not Started |

### Improve Response (P2 - This Quarter)

| # | Action | Owner | Deadline | Status |
|---|--------|-------|----------|--------|
| 6 | Create escalation runbook for on-call | @alice | Jan 10 | Not Started |
| 7 | Add database troubleshooting guide | @dba | Jan 15 | Not Started |
```

### 8. Generate Postmortem Document

```
## Incident Postmortem: [Incident Title]

**Incident ID**: INC-2024-001
**Date**: [Incident date]
**Severity**: [SEV1/SEV2/SEV3]
**Status**: [Draft / Reviewed / Published]
**Authors**: [Names]
**Reviewers**: [Names]

---

### Executive Summary

On [date] at [time], [brief description of what happened]. The incident lasted [duration] and affected [scope of impact]. The root cause was [one-line root cause]. [Number] action items have been identified to prevent recurrence.

---

### Incident Details

**Duration**: [start time] to [end time] ([total duration])
**Severity**: [SEV1/SEV2/SEV3]
**Detection Method**: [How we found out]
**Resolution**: [How we fixed it]

### Impact

[Impact Assessment section from above]

### Timeline

[Timeline section from above]

### Root Cause Analysis

[Root Cause Analysis section from above]

### What Went Well

[What Went Well section from above]

### What Could Be Improved

[What Could Be Improved section from above]

### Action Items

[Action Items section from above]

### Lessons Learned

1. [Key takeaway 1]
2. [Key takeaway 2]
3. [Key takeaway 3]

### Supporting Information

- **Relevant Logs**: [links]
- **Dashboards**: [links]
- **Related Incidents**: [links]
- **Slack Thread**: [link]

---

**Review Schedule**:
- [ ] Initial draft: [date]
- [ ] Team review: [date]
- [ ] Action items assigned: [date]
- [ ] Published: [date]
- [ ] 30-day action item review: [date]
```

Save as markdown: `Postmortem-INC-[ID]-[date].md`

## Notes

- **Blameless does not mean accountable-less** — systems and processes are accountable
- Focus on "what" and "how," not "who"
- Include quotes from people involved (with permission)
- Share broadly — postmortems are for organizational learning
- Follow up on action items; an unactioned postmortem is wasted effort
- Celebrate the learning, not just the fixing

---

### Further Reading

- [Google SRE Book: Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)
- [Blameless Postmortems and a Just Culture](https://www.etsy.com/codeascraft/blameless-postmortems/)
- [PagerDuty Incident Response](https://response.pagerduty.com/)
