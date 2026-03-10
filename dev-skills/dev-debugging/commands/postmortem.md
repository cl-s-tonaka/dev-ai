---
description: Run a blameless incident postmortem with timeline reconstruction, root cause analysis, and action items
argument-hint: "<incident description or ID>"
---

# /postmortem -- Blameless Incident Postmortem

Conduct a structured postmortem analysis after a production incident to identify root causes, document learnings, and create action items to prevent recurrence.

## Invocation

```
/postmortem INC-2024-001 Order service outage
/postmortem [paste incident timeline or Slack thread]
/postmortem Yesterday's database failover incident
/postmortem                    # asks for incident details
```

## Workflow

### Step 1: Gather Incident Context

Collect essential information:

**Ask if not provided**:
- What services/systems were affected?
- When did the incident start and end?
- What was the user-visible impact?
- How was it detected (monitoring, user report)?
- What was the resolution (rollback, fix, restart)?
- Who was involved in the response?

**Incident Severity Classification**:

| Severity | Criteria |
|----------|----------|
| **SEV1** | Complete outage, all users affected, revenue impact |
| **SEV2** | Partial outage, significant user impact, degraded service |
| **SEV3** | Limited impact, workaround available, minor degradation |
| **SEV4** | Minimal impact, no user-facing issues, internal only |

### Step 2: Reconstruct Timeline

Apply the **incident-postmortem** skill:

Build a detailed, factual timeline from all available sources:

```
## Incident Timeline

**Incident ID**: [ID]
**Date**: [Date]
**Duration**: [Start] to [End] ([Total time])

| Time (UTC) | Event | Source | Actor |
|------------|-------|--------|-------|
| [time] | [what happened] | [log/alert/slack] | [person/system] |

**Key Metrics**:
- Time to Detection (TTD): [X] minutes
- Time to Acknowledgment: [X] minutes
- Time to Mitigation (TTM): [X] minutes
- Time to Resolution (TTR): [X] minutes
```

**Sources to gather**:
- Alert history (PagerDuty, OpsGenie)
- Slack/Teams incident channel
- Deployment logs
- Monitoring dashboards
- Git commits around incident time
- Configuration changes

### Step 3: Assess Impact

Quantify the incident's effects:

```
## Impact Assessment

### User Impact
| Metric | Value |
|--------|-------|
| Users Affected | [number] ([%] of total) |
| Error Type | [What users saw] |
| Duration | [How long users were impacted] |
| Regions Affected | [Geographic scope] |

### Business Impact
| Metric | Value |
|--------|-------|
| Estimated Revenue Loss | $[amount] |
| SLA Breach | [Yes/No — which SLA] |
| Support Tickets | [count] |
| Social Media Mentions | [count] |

### Technical Impact
| Metric | Value |
|--------|-------|
| Services Affected | [list] |
| Data Loss/Corruption | [Yes/No — details] |
| Recovery Actions Required | [list] |
```

### Step 4: Root Cause Analysis

Apply the **root-cause-analysis** skill:

**5 Whys Template**:

```
## 5 Whys Analysis

**Problem Statement**: [What happened in one sentence]

1. **Why** did [the problem] occur?
   → Because [immediate cause]

2. **Why** did [immediate cause] happen?
   → Because [deeper cause]

3. **Why** did [deeper cause] happen?
   → Because [even deeper cause]

4. **Why** did [even deeper cause] happen?
   → Because [systemic cause]

5. **Why** did [systemic cause] happen?
   → Because [root cause]

**Root Cause**: [Final root cause statement]
**Contributing Factors**: [Other factors that made it worse]
```

**Fishbone Diagram**:

For complex incidents, map causes across categories:

```
## Fishbone Analysis

### Code
- [cause]: [evidence]
- [cause]: [evidence]

### Infrastructure
- [cause]: [evidence]
- [cause]: [evidence]

### Process
- [cause]: [evidence]
- [cause]: [evidence]

### External Dependencies
- [cause]: [evidence]
- [cause]: [evidence]

### Human Factors (Systemic)
- [system gap]: [evidence]
- [system gap]: [evidence]
```

### Step 5: Analyze Response

Evaluate how the incident was handled:

```
## Response Analysis

### What Went Well
- [Positive aspect of detection]
- [Positive aspect of response]
- [Positive aspect of communication]
- [Positive aspect of resolution]

### What Could Be Improved
- [Detection gap]
- [Response gap]
- [Communication gap]
- [Tooling gap]
- [Documentation gap]
```

### Step 6: Generate Action Items

Create specific, assignable follow-ups:

```
## Action Items

### Immediate (This Week)
| # | Action | Owner | Deadline | Tracks |
|---|--------|-------|----------|--------|
| 1 | [Prevent immediate recurrence] | @name | [date] | [ticket] |
| 2 | [Fix root cause] | @name | [date] | [ticket] |

### Short-term (This Sprint)
| # | Action | Owner | Deadline | Tracks |
|---|--------|-------|----------|--------|
| 3 | [Improve detection] | @name | [date] | [ticket] |
| 4 | [Add tests] | @name | [date] | [ticket] |

### Long-term (This Quarter)
| # | Action | Owner | Deadline | Tracks |
|---|--------|-------|----------|--------|
| 5 | [Systemic improvement] | @name | [date] | [ticket] |
| 6 | [Process change] | @name | [date] | [ticket] |

**Action Item Guidelines**:
- Each item has a single owner
- Each item has a specific deadline
- Each item is tracked in issue tracker
- Review progress at next team sync
```

### Step 7: Generate Postmortem Document

```
## Postmortem: [Incident Title]

**Incident ID**: [INC-YYYY-NNN]
**Date**: [Date of incident]
**Duration**: [X hours Y minutes]
**Severity**: [SEV1/SEV2/SEV3/SEV4]
**Status**: [Draft / Under Review / Published]

**Authors**: [Names]
**Reviewers**: [Names]

---

### Executive Summary

On [date] at [time UTC], [service/system] experienced [brief description of failure]. The incident lasted [duration] and affected [N users / X% of traffic / Y revenue]. The root cause was [one-line root cause]. The incident was resolved by [how it was fixed]. [N] action items have been created to prevent recurrence.

---

### Incident Details

**Start Time**: [time UTC]
**End Time**: [time UTC]
**Duration**: [X hours Y minutes]
**Severity**: [SEV level and criteria]
**Detection Method**: [How the incident was discovered]
**Resolution Method**: [How the incident was resolved]

---

### Timeline

[Insert timeline table]

---

### Impact

[Insert impact assessment]

---

### Root Cause Analysis

[Insert 5 Whys and/or Fishbone analysis]

---

### Response Analysis

[Insert what went well / could improve]

---

### Action Items

[Insert action items table]

---

### Lessons Learned

1. **[Lesson 1]**: [What we learned and why it matters]
2. **[Lesson 2]**: [What we learned and why it matters]
3. **[Lesson 3]**: [What we learned and why it matters]

---

### Appendix

- **Dashboards**: [links to relevant dashboards]
- **Logs**: [links to log queries]
- **Slack Thread**: [link to incident channel]
- **Related Incidents**: [links to similar past incidents]
- **Related PRs**: [links to fix PRs]

---

**Review Status**:
- [ ] Initial draft completed
- [ ] Technical review completed
- [ ] Management review completed
- [ ] Action items created and assigned
- [ ] Postmortem published
- [ ] 30-day action item follow-up scheduled
```

Save as `Postmortem-[INC-ID]-[date].md`

### Step 8: Offer Next Steps

- "Should I **create tickets** for these action items?"
- "Want me to **draft a customer communication** about this incident?"
- "Should I **update the runbook** based on learnings?"
- "Want me to **add monitoring** to detect this earlier?"
- "Should I **schedule a follow-up** to review action item progress?"

## Notes

- **Blameless means focusing on systems** — people operate within systems; fix the system
- **Start while memories are fresh** — aim to complete within 48-72 hours
- **Include all perspectives** — everyone involved should contribute
- **Share widely** — postmortems are for organizational learning
- **Follow up on action items** — an unactioned postmortem is wasted effort
- **Celebrate the learning** — postmortems should feel safe, not punitive

## Postmortem Review Checklist

Before publishing, verify:
- [ ] Timeline is factual and specific (times, not "around 2pm")
- [ ] Root cause analysis reaches an actionable conclusion
- [ ] Impact is quantified where possible
- [ ] Action items are specific, owned, and deadlined
- [ ] Language is blameless (systems, not people)
- [ ] All involved parties have reviewed
- [ ] Sensitive information (PII, secrets) is redacted
