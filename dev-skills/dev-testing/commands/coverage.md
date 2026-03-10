---
description: Analyze code coverage, identify gaps, and create an improvement plan with prioritized test additions
argument-hint: "<coverage report, codebase, or module to analyze>"
---

# /coverage -- Coverage Analysis and Improvement

Analyze test coverage metrics, identify gaps in critical areas, and create a prioritized improvement plan with specific test recommendations.

## Invocation

```
/coverage [paste coverage report or summary]
/coverage analyze src/payments module, currently at 45% coverage
/coverage [upload coverage HTML report or JSON]
/coverage identify gaps in authentication and user management
```

## Workflow

### Step 1: Accept Coverage Data

Accept:
- Coverage report output (Istanbul, pytest-cov, JaCoCo, etc.)
- Coverage percentages by module
- List of uncovered files or functions
- Codebase structure with testing gaps

If no data provided, ask:
- What coverage tool are you using?
- What is the current overall coverage?
- Which areas are you most concerned about?
- What are the coverage targets?

### Step 2: Parse and Visualize Coverage

Apply the **test-coverage-analysis** skill:

Create a coverage visualization:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Coverage Dashboard                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Overall Coverage        ████████████████░░░░░░░░ 65%           │
│  Target: 80%             Gap: 15%                               │
│                                                                 │
│  By Module:                                                     │
│  ├── auth/               ██████████████████████████ 92%  ✓     │
│  ├── payments/           ████████████████████░░░░░░ 78%  ✓     │
│  ├── orders/             ████████████████░░░░░░░░░░ 65%  ⚠     │
│  ├── shipping/           ██████████░░░░░░░░░░░░░░░░ 42%  ✗     │
│  ├── notifications/      ████████░░░░░░░░░░░░░░░░░░ 35%  ✗     │
│  └── utils/              ██████████████████████████ 95%  ✓     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Legend: ✓ Meets target | ⚠ Close to target | ✗ Below target
```

### Step 3: Identify Critical Gaps

Analyze gaps by risk level:

**High Risk Gaps** (Must Fix):
- Untested payment/checkout logic
- Missing security validation tests
- Error handling without coverage
- Critical business rules untested

**Medium Risk Gaps** (Should Fix):
- Low branch coverage in complex logic
- Missing edge case tests
- Partial integration test coverage

**Low Risk Gaps** (Nice to Have):
- Trivial getters/setters
- Configuration/boilerplate code
- Generated code

### Step 4: Map Gaps to Business Impact

```markdown
## Coverage Gap Analysis

### Critical Gaps (Revenue/Security Impact)

| File/Function              | Coverage | Missing Tests              | Business Risk        |
|----------------------------|----------|---------------------------|----------------------|
| payments/processRefund.js  | 32%      | Error paths, edge cases   | Refund failures      |
| auth/validateToken.js      | 45%      | Expiration, tampering     | Security breach      |
| orders/calculateTotal.js   | 58%      | Discount combinations     | Incorrect charges    |

### Important Gaps (Core Functionality)

| File/Function              | Coverage | Missing Tests              | Impact               |
|----------------------------|----------|---------------------------|----------------------|
| shipping/estimateDelivery  | 42%      | International, holidays   | Wrong estimates      |
| inventory/reserveStock.js  | 55%      | Concurrent reservations   | Overselling          |

### Lower Priority Gaps

| File/Function              | Coverage | Reason for Lower Priority  |
|----------------------------|----------|---------------------------|
| utils/formatDate.js        | 60%      | Simple transformations    |
| config/loadSettings.js     | 40%      | Startup only              |
```

### Step 5: Create Improvement Plan

Generate prioritized test additions:

```markdown
## Coverage Improvement Plan

### Summary
- **Current Coverage**: 65%
- **Target Coverage**: 80%
- **Gap to Close**: 15% (~45 new tests estimated)
- **Timeline**: 3 sprints

---

### Phase 1: Critical Gaps (Sprint 1)
**Goal**: Cover revenue and security critical paths

#### payments/processRefund.js (32% → 80%)
| Test Case                          | Type        | Priority | Est. Time |
|------------------------------------|-------------|----------|-----------|
| Successful full refund             | Unit        | P0       | 30 min    |
| Partial refund calculation         | Unit        | P0       | 30 min    |
| Refund exceeds original amount     | Unit        | P0       | 20 min    |
| Payment gateway timeout            | Integration | P0       | 45 min    |
| Refund already processed           | Unit        | P1       | 20 min    |

```javascript
// Example test to add
describe('processRefund', () => {
  it('should reject refund exceeding original amount', async () => {
    const order = createOrder({ total: 100 });
    await expect(processRefund(order.id, 150))
      .rejects.toThrow('Refund amount exceeds original');
  });
});
```

#### auth/validateToken.js (45% → 85%)
| Test Case                          | Type        | Priority | Est. Time |
|------------------------------------|-------------|----------|-----------|
| Valid token with all claims        | Unit        | P0       | 20 min    |
| Expired token                      | Unit        | P0       | 20 min    |
| Tampered signature                 | Unit        | P0       | 30 min    |
| Missing required claims            | Unit        | P1       | 20 min    |
| Token from revoked session         | Integration | P1       | 45 min    |

---

### Phase 2: Core Functionality (Sprint 2)
**Goal**: Cover main user paths and business logic

#### orders/calculateTotal.js (58% → 85%)
[Test cases...]

#### shipping/estimateDelivery.js (42% → 75%)
[Test cases...]

---

### Phase 3: Maintenance Coverage (Sprint 3)
**Goal**: Establish baseline coverage for remaining modules

[Remaining modules...]

---

### Implementation Checklist

**Sprint 1**
- [ ] payments/processRefund.js — Owner: [Name]
- [ ] auth/validateToken.js — Owner: [Name]
- [ ] Set up coverage threshold in CI (fail if < 70%)

**Sprint 2**
- [ ] orders/calculateTotal.js — Owner: [Name]
- [ ] shipping/estimateDelivery.js — Owner: [Name]
- [ ] Increase CI threshold to 75%

**Sprint 3**
- [ ] Remaining modules — Team effort
- [ ] Final CI threshold: 80%
- [ ] Document coverage exclusions

---

### Coverage Configuration

```json
// jest.config.js additions
{
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 80,
      "lines": 80,
      "statements": 80
    },
    "./src/payments/": {
      "branches": 85,
      "lines": 90
    },
    "./src/auth/": {
      "branches": 85,
      "lines": 90
    }
  }
}
```

### Success Metrics
| Metric              | Current | Target | Deadline    |
|---------------------|---------|--------|-------------|
| Overall coverage    | 65%     | 80%    | Sprint 3    |
| Branch coverage     | 52%     | 70%    | Sprint 3    |
| Critical paths      | 45%     | 90%    | Sprint 1    |
| CI pass rate        | 85%     | 98%    | Sprint 2    |
```

Save as markdown.

### Step 6: Offer Next Steps

- "Want me to **generate the test code** for the Phase 1 critical gaps?"
- "Should I **set up the coverage configuration** for your test framework?"
- "Want me to **create test data factories** for these test cases?"
- "Should I **design mock strategies** for the integration tests?"

## Notes

- Focus on branch coverage for logic-heavy code — line coverage misses edge cases
- 80% coverage with good tests beats 100% coverage with weak assertions
- Require coverage thresholds in CI to prevent regression
- Document intentional exclusions (generated code, trivial methods)
- Track coverage trends over time, not just snapshots
- Coverage is necessary but not sufficient — quality of assertions matters
