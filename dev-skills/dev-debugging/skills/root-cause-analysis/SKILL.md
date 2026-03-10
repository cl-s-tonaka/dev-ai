---
name: root-cause-analysis
description: "Perform structured root cause analysis using 5 Whys and Fishbone (Ishikawa) diagrams to identify the true origin of issues. Use when debugging complex problems, investigating production incidents, or understanding systemic failures."
---

# Root Cause Analysis: 5 Whys and Fishbone Diagrams

## Purpose

You are a senior engineer conducting root cause analysis on **$ARGUMENTS**. This skill applies structured methodologies to move beyond symptoms and identify the true underlying causes of issues.

## Context

Root cause analysis (RCA) is a systematic approach to problem-solving that aims to identify the fundamental cause of problems rather than just treating symptoms. Two primary techniques are the 5 Whys method (iterative questioning) and Fishbone diagrams (categorical cause mapping).

## Instructions

### 1. Understand the Problem

Gather information about the issue:
- What is the observable symptom?
- When did it first occur?
- What changed recently (deployments, configs, traffic)?
- Who is affected and how severely?
- Is the issue intermittent or constant?

### 2. Apply the 5 Whys Method

Start with the problem statement and ask "Why?" iteratively until you reach the root cause:

```
## 5 Whys Analysis

**Problem Statement**: [Clear description of the issue]

**Why #1**: Why did [problem] occur?
→ Because [immediate cause]

**Why #2**: Why did [immediate cause] happen?
→ Because [deeper cause]

**Why #3**: Why did [deeper cause] happen?
→ Because [even deeper cause]

**Why #4**: Why did [even deeper cause] happen?
→ Because [systemic cause]

**Why #5**: Why did [systemic cause] happen?
→ Because [root cause]

**Root Cause Identified**: [Final root cause statement]
```

**Guidelines for 5 Whys**:
- Stay factual — avoid speculation or blame
- Focus on process and system failures, not individuals
- Branch if multiple valid answers exist at any level
- Stop when you reach something actionable and fundamental
- You may need fewer or more than 5 iterations

### 3. Build a Fishbone Diagram

For complex issues with multiple potential causes, use the Fishbone (Ishikawa) diagram:

```
## Fishbone Diagram: [Problem Statement]

                    ┌─────────────────────────────────────────┐
                    │              PROBLEM                    │
                    │         [Problem Statement]             │
                    └─────────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
   ┌────┴────┐                   ┌────┴────┐                   ┌────┴────┐
   │  CODE   │                   │ INFRA   │                   │ PROCESS │
   └────┬────┘                   └────┬────┘                   └────┬────┘
        │                              │                              │
   • [cause]                      • [cause]                      • [cause]
   • [cause]                      • [cause]                      • [cause]
        │                              │                              │
        │                              │                              │
   ┌────┴────┐                   ┌────┴────┐                   ┌────┴────┐
   │  DATA   │                   │ EXTERNAL│                   │  PEOPLE │
   └────┬────┘                   └────┬────┘                   └────┬────┘
        │                              │                              │
   • [cause]                      • [cause]                      • [cause]
   • [cause]                      • [cause]                      • [cause]
```

**Standard Categories for Software Issues**:

| Category | Example Causes |
|----------|----------------|
| **Code** | Logic errors, race conditions, memory leaks, unhandled exceptions |
| **Infrastructure** | Server capacity, network latency, disk space, configuration drift |
| **Data** | Corrupt data, schema changes, missing records, encoding issues |
| **Process** | Missing tests, inadequate review, deployment gaps, documentation |
| **External** | Third-party APIs, vendor issues, DNS, CDN failures |
| **People** | Training gaps, communication failures, unclear ownership |

### 4. Analyze and Prioritize Causes

For each identified cause:
- **Evidence**: What data supports this as a cause?
- **Likelihood**: High / Medium / Low
- **Impact**: How much does this contribute to the problem?
- **Actionability**: Can we address this directly?

### 5. Generate RCA Report

```
## Root Cause Analysis Report

**Issue**: [Problem title]
**Date**: [Analysis date]
**Analyst**: [Name/Team]
**Severity**: [P0/P1/P2/P3]

### Problem Statement
[Clear, factual description of what happened]

### Timeline
| Time | Event |
|------|-------|
| [timestamp] | [event] |

### 5 Whys Analysis
[Full 5 Whys chain as above]

### Fishbone Analysis
[Diagram with populated causes]

### Root Cause(s) Identified
1. **Primary Root Cause**: [description]
   - Evidence: [data points]
   - Confidence: [High/Medium/Low]

2. **Contributing Factor(s)**: [description]

### Recommended Actions
| # | Action | Owner | Priority | Deadline |
|---|--------|-------|----------|----------|
| 1 | [Fix/Mitigation] | [Team] | [P0/P1/P2] | [Date] |

### Preventive Measures
[How to prevent recurrence]

### Lessons Learned
[Key takeaways for the team]
```

Save the analysis as markdown.

## Notes

- The goal is learning, not blame — focus on systems and processes
- Root causes are often organizational or process-related, not just technical
- Multiple root causes can contribute to a single issue
- Validate root causes with data before proposing fixes
- Share findings broadly to prevent similar issues elsewhere

---

### Further Reading

- [The 5 Whys Technique](https://www.mindtools.com/a3mi00v/5-whys)
- [Ishikawa Fishbone Diagrams](https://asq.org/quality-resources/fishbone)
- [How to Run Effective Root Cause Analysis](https://sre.google/sre-book/postmortem-culture/)
