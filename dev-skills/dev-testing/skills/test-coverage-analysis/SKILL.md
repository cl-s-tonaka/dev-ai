---
name: test-coverage-analysis
description: "Analyze test coverage metrics, identify coverage gaps, and create actionable improvement plans. Use when auditing test quality, identifying untested code paths, or prioritizing test development efforts."
---

# Test Coverage Analysis

Analyze test coverage metrics to identify gaps, assess risk, and create prioritized improvement plans.

**Use when:** Auditing test quality, identifying untested code paths, setting coverage targets, or prioritizing test development efforts.

**Arguments:**
- `$PROJECT`: The project or codebase name
- `$COVERAGE_DATA`: Coverage report or metrics
- `$CONTEXT`: Business criticality and risk assessment

## Coverage Metrics

### Types of Coverage

| Metric          | What It Measures                    | Target | Priority |
|-----------------|-------------------------------------|--------|----------|
| Line Coverage   | Lines executed by tests             | 80%+   | Medium   |
| Branch Coverage | Decision branches taken             | 70%+   | High     |
| Function Coverage| Functions called by tests          | 90%+   | Medium   |
| Statement Coverage| Statements executed              | 80%+   | Medium   |
| Path Coverage   | Unique execution paths              | N/A    | Low*     |

*Path coverage is often impractical for complex code.

### Coverage Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                     Coverage Dashboard                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Overall Coverage        ████████████████████░░░░ 80%           │
│                                                                 │
│  By Module:                                                     │
│  ├── auth/               ██████████████████████████ 95%         │
│  ├── payments/           ████████████████████████░░ 90%         │
│  ├── orders/             ██████████████████░░░░░░░░ 72%  ← Gap  │
│  ├── notifications/      ██████████░░░░░░░░░░░░░░░░ 45%  ← Gap  │
│  └── utils/              ██████████████████████████ 98%         │
│                                                                 │
│  Critical Paths:                                                │
│  ├── Checkout flow       ████████████████████████░░ 92%         │
│  ├── User registration   ██████████████████████████ 100%        │
│  └── Password reset      ████████████████░░░░░░░░░░ 65%  ← Risk │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Step-by-Step Process

1. **Gather coverage data**
   - Run test suite with coverage enabled
   - Collect line, branch, and function metrics
   - Generate detailed per-file reports

2. **Identify coverage gaps**
   - Sort modules by coverage percentage
   - Highlight files below threshold
   - Map untested code to business functions

3. **Assess risk**
   - Cross-reference low coverage with critical paths
   - Identify untested error handling
   - Note complex logic without branch coverage

4. **Prioritize improvements**
   - Critical business logic first
   - High-complexity, low-coverage areas
   - Recently changed code with gaps

5. **Create improvement plan**
   - Specific test additions per gap
   - Estimated effort and impact
   - Target dates and ownership

## Coverage Analysis Template

```markdown
## Coverage Analysis: [Project Name]

### Summary

| Metric            | Current | Target | Status  |
|-------------------|---------|--------|---------|
| Line Coverage     | X%      | 80%    | [Met/Gap]|
| Branch Coverage   | X%      | 70%    | [Met/Gap]|
| Function Coverage | X%      | 90%    | [Met/Gap]|

### Coverage by Module

| Module           | Lines | Branches | Functions | Risk Level |
|------------------|-------|----------|-----------|------------|
| [Module A]       | 95%   | 88%      | 100%      | Low        |
| [Module B]       | 72%   | 58%      | 85%       | Medium     |
| [Module C]       | 45%   | 30%      | 60%       | High       |

### Critical Gaps

#### Gap 1: [Module/File Name]
- **Current Coverage**: X% lines, Y% branches
- **Missing Coverage**: [Specific functions or paths]
- **Business Impact**: [Why this matters]
- **Recommended Tests**: [Specific test cases to add]
- **Effort Estimate**: [Hours/Points]

#### Gap 2: [Module/File Name]
...

### Untested Critical Paths

| Path                  | Coverage | Risk  | Action Required          |
|-----------------------|----------|-------|--------------------------|
| Error handling in X   | 0%       | High  | Add failure scenario tests|
| Edge case in Y        | 25%      | Medium| Add boundary tests       |

### Improvement Roadmap

**Phase 1 (Week 1-2): Critical Gaps**
- [ ] Add tests for [Gap 1] — Owner: [Name]
- [ ] Add tests for [Gap 2] — Owner: [Name]
- Target: Reach 75% overall

**Phase 2 (Week 3-4): Medium Priority**
- [ ] Improve branch coverage in [Module]
- [ ] Add edge case tests for [Feature]
- Target: Reach 80% overall

**Phase 3 (Ongoing): Maintenance**
- Require 80% coverage for new code
- Review coverage in PR checks
```

## Coverage Gap Categories

### High Priority Gaps

| Gap Type                     | Risk                        | Action                    |
|------------------------------|-----------------------------|-----------------------------|
| Untested error paths         | Silent failures in prod     | Add failure scenario tests |
| Missing branch coverage      | Edge case bugs              | Add boundary condition tests|
| No tests for security code   | Vulnerabilities             | Priority security testing  |
| Payment/checkout gaps        | Revenue impact              | Immediate E2E + unit tests |

### Medium Priority Gaps

| Gap Type                     | Risk                        | Action                    |
|------------------------------|-----------------------------|-----------------------------|
| Utility functions untested   | Subtle bugs                 | Add unit tests             |
| Configuration code           | Environment issues          | Add config validation tests|
| Logging/monitoring code      | Observability gaps          | Integration tests          |

### Lower Priority Gaps

| Gap Type                     | Risk                        | Action                    |
|------------------------------|-----------------------------|-----------------------------|
| Trivial getters/setters      | Very low                    | May skip                   |
| Generated code               | Low (if generator is tested)| Document exclusion         |
| Third-party integrations     | Tested elsewhere            | Mock at boundary           |

## Coverage Tool Configuration

### Jest (JavaScript)

```json
{
  "collectCoverage": true,
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 80,
      "lines": 80,
      "statements": 80
    },
    "./src/payments/": {
      "branches": 90,
      "lines": 95
    }
  },
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/__tests__/",
    "/generated/"
  ]
}
```

### Pytest (Python)

```ini
[tool.pytest.ini_options]
addopts = "--cov=src --cov-report=html --cov-fail-under=80"

[tool.coverage.run]
branch = true
omit = ["tests/*", "**/__init__.py"]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "def __repr__",
    "raise NotImplementedError"
]
```

## Coverage Anti-Patterns

| Anti-Pattern              | Problem                          | Solution                      |
|---------------------------|----------------------------------|-------------------------------|
| Chasing 100% coverage     | Diminishing returns              | Focus on risk-based coverage |
| Testing implementation    | High coverage, low value         | Test behavior, not internals |
| Ignoring branch coverage  | Missing edge cases               | Track branches, not just lines|
| Coverage without assertions| Tests run code but verify nothing| Require meaningful assertions|
| Excluding too much code   | False sense of security          | Justify every exclusion      |

## Notes

- Coverage is a necessary but not sufficient indicator of test quality
- 80% coverage with good tests beats 100% coverage with weak assertions
- Focus on branch coverage for logic-heavy code — line coverage misses edge cases
- Use coverage trends over time, not just snapshots
- Require coverage thresholds in CI to prevent regression
- Document intentional exclusions to prevent future confusion
