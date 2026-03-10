---
description: Full debugging workflow — reproduce, analyze, fix, and verify issues systematically
argument-hint: "<bug description, error message, or issue link>"
---

# /debug -- Systematic Debugging Workflow

A structured approach to debugging that ensures issues are properly reproduced, analyzed, fixed, and verified before closing.

## Invocation

```
/debug Users are seeing 500 errors on the checkout page
/debug NullPointerException in OrderService.process()
/debug [paste stack trace or error log]
/debug                    # asks for issue details
```

## Workflow

### Step 1: Understand the Issue

Gather information about the bug:

**Ask if not provided**:
- What is the observed behavior?
- What is the expected behavior?
- When did it start happening?
- How frequently does it occur?
- Who reported it and how?
- Any recent changes (deploys, config, traffic)?

**Classify the issue**:
| Type | Characteristics |
|------|-----------------|
| **Crash** | Application terminates unexpectedly |
| **Error** | Exception/error response but app continues |
| **Incorrect behavior** | Wrong output, data corruption |
| **Performance** | Slow response, timeouts |
| **Intermittent** | Sometimes works, sometimes fails |

### Step 2: Reproduce the Issue

Establish a reliable reproduction:

```
## Reproduction Steps

**Environment**: [production / staging / local]
**Reproducibility**: [Always / Sometimes / Rare]

Steps:
1. [Precondition setup]
2. [Action that triggers the bug]
3. [Additional steps if needed]

**Expected Result**: [What should happen]
**Actual Result**: [What actually happens]

**Minimal Reproduction**:
- Smallest input that triggers the issue
- Fewest steps needed
- Isolated environment if possible
```

**If reproduction is difficult**:
- Check if issue is environment-specific
- Review logs around reported occurrence time
- Look for race conditions or timing dependencies
- Consider data-dependent triggers

### Step 3: Analyze the Issue

Apply relevant analysis skills:

**For Stack Traces**: Use **stack-trace-analysis** skill
- Parse the exception chain
- Identify the originating frame
- Classify as application vs library code

**For Log Analysis**: Use **log-analysis** skill
- Search for error patterns
- Trace request flow
- Identify correlated events

**For Root Cause**: Use **root-cause-analysis** skill
- Apply 5 Whys method
- Build Fishbone diagram for complex issues
- Identify contributing factors

**For Performance Issues**: Use **performance-profiling** skill
- Profile CPU/memory hotspots
- Identify bottlenecks
- Analyze query performance

**For Memory Issues**: Use **memory-leak-detection** skill
- Analyze heap dumps
- Identify retention paths
- Detect leak patterns

### Step 4: Develop the Fix

Create a targeted solution:

```
## Fix Analysis

**Root Cause Identified**: [Clear statement of what's broken and why]

**Fix Options**:

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A | [Quick fix] | Fast to implement | May not address root cause |
| B | [Proper fix] | Addresses root cause | More effort |
| C | [Comprehensive] | Prevents related issues | Significant refactor |

**Selected Approach**: [Option] — [Rationale]

**Code Change**:
```[language]
// Before (buggy)
[original code]

// After (fixed)
[fixed code]
```

**Files Modified**:
- `path/to/file.ext` — [description of change]

**Tests Added**:
- `test_case_name` — Verifies [what it tests]
```

### Step 5: Verify the Fix

Confirm the issue is resolved:

```
## Verification Checklist

### Direct Verification
- [ ] Original reproduction steps no longer trigger the bug
- [ ] Expected behavior is now observed
- [ ] Fix works in all affected environments

### Regression Testing
- [ ] Existing tests pass
- [ ] New tests added for this scenario
- [ ] Related functionality still works
- [ ] Edge cases covered

### Non-Functional Verification
- [ ] No performance degradation
- [ ] No memory leaks introduced
- [ ] Error handling is appropriate
- [ ] Logging is adequate for future debugging

### Code Quality
- [ ] Code reviewed
- [ ] No hardcoded values or workarounds
- [ ] Documentation updated if needed
```

### Step 6: Document and Close

Create a record of the fix:

```
## Bug Fix Summary

**Issue**: [Title/ID]
**Severity**: [P0/P1/P2/P3]
**Status**: Fixed

### Problem
[What was broken and how it manifested]

### Root Cause
[Why it was broken]

### Solution
[What was changed and why]

### Verification
[How we confirmed it's fixed]

### Prevention
[How to prevent similar issues]
- [ ] Add monitoring/alerting
- [ ] Update documentation
- [ ] Improve test coverage
- [ ] Consider process changes

### Related
- PR: [link]
- Tests: [link]
- Docs: [link]
```

### Step 7: Offer Next Steps

- "Should I **create a postmortem** for this incident?"
- "Want me to **add monitoring** to detect this issue earlier?"
- "Should I **review similar code** for the same pattern?"
- "Want me to **update the runbook** with debugging steps?"

## Notes

- **Reproduce first** — never fix what you can't reproduce
- **One change at a time** — isolate variables to confirm cause
- **Document as you go** — capture findings before they're forgotten
- **Check the obvious** — config changes, recent deploys, data issues
- **Ask for help** — fresh eyes often spot what you missed
- **Time-box investigation** — escalate if stuck after [X] minutes

## Quick Reference: Common Debug Commands

| Tool | Command | Purpose |
|------|---------|---------|
| Logs | `tail -f /var/log/app.log \| grep ERROR` | Watch for errors |
| Stack | `jstack <pid>` | Thread dump |
| Heap | `jmap -dump:format=b,file=heap.bin <pid>` | Heap dump |
| Network | `tcpdump -i eth0 port 8080` | Capture traffic |
| DB | `EXPLAIN ANALYZE <query>` | Query plan |
| Profile | `perf top -p <pid>` | CPU hotspots |
