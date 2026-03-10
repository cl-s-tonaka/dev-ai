---
name: stack-trace-analysis
description: "Parse and interpret stack traces to identify exception sources, call chains, and potential fixes. Use when debugging crashes, investigating exceptions, understanding error origins, or triaging bug reports."
---

# Stack Trace Analysis

## Purpose

You are a senior engineer analyzing stack traces for **$ARGUMENTS**. This skill parses stack traces across multiple languages to identify the root cause of exceptions and guide debugging efforts.

## Context

Stack traces capture the call hierarchy at the moment an error occurs. Effective analysis involves identifying the originating exception, understanding the call chain, distinguishing application code from library code, and correlating with known issues.

## Instructions

### 1. Identify the Stack Trace Format

Recognize the language and format:

| Language | Identifying Markers |
|----------|---------------------|
| **Java/Kotlin** | `at package.Class.method(File.java:line)` |
| **Python** | `File "path.py", line N, in function` |
| **JavaScript/Node** | `at function (file.js:line:col)` |
| **Go** | `package/file.go:line +0xABC` |
| **Ruby** | `file.rb:line:in 'method'` |
| **C#/.NET** | `at Namespace.Class.Method() in File.cs:line N` |
| **Rust** | `at location - file.rs:line:col` |

### 2. Parse the Exception Chain

For nested exceptions, trace from the root cause upward:

```
## Exception Chain Analysis

**Top-Level Exception**:
Type: java.lang.RuntimeException
Message: "Failed to process order"
Location: com.app.OrderService.process(OrderService.java:45)

↓ Caused by ↓

**Intermediate Exception**:
Type: java.sql.SQLException
Message: "Connection timed out"
Location: com.app.Database.query(Database.java:123)

↓ Caused by ↓

**Root Cause Exception** ← START HERE
Type: java.net.SocketTimeoutException
Message: "connect timed out"
Location: java.net.Socket.connect(Socket.java:589)

→ Root cause: Network timeout connecting to database
```

### 3. Analyze the Call Stack

Map the execution path:

```
## Call Stack Analysis

Exception: NullPointerException at line 42

Call Chain (bottom to top):
┌─────────────────────────────────────────────────────────────────┐
│ 1. main()                          [Entry Point]                │
│    └→ Application.start()          [Bootstrap]                  │
│        └→ OrderController.create() [HTTP Handler]               │
│            └→ OrderService.save()  [Business Logic]             │
│                └→ user.getName()   ← NULL POINTER HERE          │
└─────────────────────────────────────────────────────────────────┘

Analysis:
- Line 42: user.getName() called on null reference
- 'user' variable is null when reaching OrderService.save()
- Likely cause: OrderController.create() not validating user input
```

### 4. Classify Stack Frames

Separate application code from framework/library code:

```
## Frame Classification

Application Code (investigate first):
  → com.app.OrderService.process(OrderService.java:45)
  → com.app.validators.OrderValidator.validate(OrderValidator.java:23)
  → com.app.Database.query(Database.java:123)

Framework Code (context only):
  → org.springframework.web.servlet.FrameworkServlet.service()
  → org.springframework.transaction.support.TransactionTemplate.execute()

Library Code (usually not the bug):
  → java.util.concurrent.ThreadPoolExecutor.runWorker()
  → java.lang.Thread.run()

JDK/Runtime (rarely the issue):
  → java.net.Socket.connect()
  → sun.nio.ch.SocketChannelImpl.connect()
```

### 5. Identify Common Patterns

Look for known issue patterns:

| Pattern | Stack Signature | Likely Cause |
|---------|-----------------|--------------|
| **Null Pointer** | `NullPointerException` at getter/method | Missing null check, uninitialized field |
| **Index Out of Bounds** | `ArrayIndexOutOfBoundsException` | Loop bounds error, empty collection |
| **Class Not Found** | `ClassNotFoundException`, `NoClassDefFoundError` | Missing dependency, classpath issue |
| **Connection Timeout** | `SocketTimeoutException` | Network issue, server down, slow DB |
| **OOM** | `OutOfMemoryError` | Memory leak, insufficient heap |
| **Stack Overflow** | `StackOverflowError` | Infinite recursion |
| **Deadlock** | Thread dump with `BLOCKED` states | Lock ordering issue |
| **Concurrent Modification** | `ConcurrentModificationException` | Iterator invalidation |

### 6. Generate Analysis Report

```
## Stack Trace Analysis Report

**Exception Type**: [Full exception class name]
**Message**: [Exception message]
**Occurred At**: [Timestamp if available]
**Affected Component**: [Service/module]

### Quick Summary
- **Root Cause**: [One-line explanation]
- **Impact**: [What functionality is broken]
- **Severity**: [P0/P1/P2/P3]

### Exception Details

**Primary Exception**:
```
[Full exception message and top 5 frames]
```

**Root Cause Exception** (if chained):
```
[Innermost Caused By exception]
```

### Call Path Analysis

| Frame # | Location | Code Type | Significance |
|---------|----------|-----------|--------------|
| 1 | [method:line] | App | ← Exception thrown here |
| 2 | [method:line] | App | Caller |
| 3 | [method:line] | Framework | Context |

### Root Cause Identified

**What happened**: [Detailed explanation]

**Why it happened**: [Underlying cause]

**Evidence**:
- [Specific line/code reference]
- [Variable state if known]

### Recommended Fix

**Immediate**:
```[language]
// Before (buggy)
user.getName()

// After (fixed)
if (user != null) {
    user.getName()
}
// Or use Optional/null-safe operator
```

**Long-term**:
- [ ] Add input validation at [location]
- [ ] Add null-safety annotations
- [ ] Add unit test for this edge case

### Similar Issues

| Issue | Similarity | Status |
|-------|------------|--------|
| [JIRA-123] | Same exception type | Fixed in v2.3 |
| [JIRA-456] | Same call path | Open |

### Prevention

- Add defensive null checks in [component]
- Consider using [pattern/library] for safer handling
- Add monitoring for [error type] errors
```

Save as markdown.

## Notes

- Always start from the "Caused by" at the bottom — that's the root cause
- Application code frames are more likely to contain the bug than library code
- Look for your package names to find relevant frames quickly
- Thread names and IDs help correlate in multi-threaded scenarios
- Compare with git blame to find recent changes near the error location

---

### Further Reading

- [Debugging with Stack Traces](https://www.baeldung.com/java-stack-trace)
- [Reading Python Tracebacks](https://realpython.com/python-traceback/)
- [Chrome DevTools Stack Traces](https://developer.chrome.com/docs/devtools/console/reference/#stack)
