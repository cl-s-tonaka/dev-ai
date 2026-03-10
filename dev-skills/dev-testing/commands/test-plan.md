---
description: Create a comprehensive test plan — strategy formulation, test case design, and priority assignment
argument-hint: "<feature, component, or system to test>"
---

# /test-plan -- Test Plan Creation

Create a comprehensive test plan that covers strategy formulation, test case design across all layers, and priority assignment based on risk and business impact.

## Invocation

```
/test-plan [paste requirements, PRD, or feature description]
/test-plan checkout flow for e-commerce platform
/test-plan [upload API spec or technical design]
/test-plan user authentication module with OAuth and MFA
```

## Workflow

### Step 1: Accept Input

Accept: feature requirements, PRD sections, API specifications, user stories, or technical designs that describe what needs to be tested.

Ask clarifying questions if needed:
- What is the tech stack?
- What testing tools are already in use?
- Are there existing tests to integrate with?
- What is the risk tolerance and release timeline?

### Step 2: Define Test Strategy

Apply the **test-strategy** skill:

1. Analyze the system architecture and identify:
   - Components and integration points
   - Critical business logic locations
   - External dependencies

2. Select appropriate testing model:
   ```
   Testing Pyramid (Backend):     Testing Trophy (Frontend):
          /\                           ___________
         /E2E\                        |    E2E    |
        /------\                      |___________|
       /  Integ  \                   /             \
      /------------\                |  Integration  |
     /    Unit      \               |_______________|
    ------------------             /                 \
                                  |    Static/Unit    |
   70% / 20% / 10%                 30% / 50% / 20%
   ```

3. Define test distribution and coverage targets

### Step 3: Design Test Cases

Apply skills for each testing layer:

**Unit Tests** (apply **unit-test-design** skill):
- Identify pure functions and isolated logic
- Design tests using AAA pattern
- Cover happy paths, edge cases, error cases

**Integration Tests** (apply **integration-test-design** skill):
- Map component interactions
- Design API and database tests
- Plan service boundary tests

**E2E Tests** (apply **e2e-test-design** skill):
- Identify critical user journeys
- Design browser-based scenarios
- Plan cross-browser coverage

### Step 4: Prioritize Tests

Assign priority based on:
- **P0 (Critical)**: Revenue-impacting, security-critical, core functionality
- **P1 (High)**: Important features, common user paths
- **P2 (Medium)**: Secondary features, edge cases
- **P3 (Low)**: Nice-to-have coverage, rare scenarios

### Step 5: Generate Test Plan

```markdown
## Test Plan: [Feature/System Name]

### Overview
- **Scope**: [What is being tested]
- **Objective**: [Testing goals]
- **Timeline**: [Estimated duration]
- **Owner**: [Team or individual]

### Test Strategy

#### Selected Model
[Testing Pyramid / Trophy / Diamond] — Rationale: [why this model]

#### Test Distribution
| Layer        | Target % | Test Count | Time Budget |
|--------------|----------|------------|-------------|
| Unit         | X%       | ~N tests   | X min       |
| Integration  | X%       | ~N tests   | X min       |
| E2E          | X%       | ~N tests   | X min       |

#### Coverage Targets
| Component       | Line % | Branch % | Priority |
|-----------------|--------|----------|----------|
| [Component A]   | 80%    | 70%      | High     |
| [Component B]   | 70%    | 60%      | Medium   |

---

### Unit Tests

#### [Module/Function 1]
| ID   | Test Case                | Input        | Expected        | Priority |
|------|--------------------------|--------------|-----------------|----------|
| U01  | [Happy path]             | [input]      | [output]        | P0       |
| U02  | [Edge case]              | [input]      | [output]        | P1       |
| U03  | [Error case]             | [input]      | [error]         | P1       |

#### [Module/Function 2]
...

---

### Integration Tests

#### [Integration Point 1]
| ID   | Scenario                 | Components         | Expected        | Priority |
|------|--------------------------|--------------------|--------------------|----------|
| I01  | [API → DB interaction]   | [Service, Repo]    | [Behavior]      | P0       |
| I02  | [Service → External]     | [Service, Gateway] | [Behavior]      | P1       |

---

### E2E Tests

#### [User Journey 1]
| ID   | Scenario                 | Steps Summary        | Expected         | Priority |
|------|--------------------------|----------------------|------------------|----------|
| E01  | [Complete flow]          | [Step overview]      | [Success state]  | P0       |
| E02  | [Error handling]         | [Step overview]      | [Error state]    | P1       |

#### Browser Matrix
| Browser | Desktop | Mobile | Priority |
|---------|---------|--------|----------|
| Chrome  | Yes     | Yes    | P0       |
| Firefox | Yes     | No     | P1       |
| Safari  | Yes     | Yes    | P1       |

---

### Test Data Requirements

| Data Type          | Description                  | Source              |
|--------------------|------------------------------|---------------------|
| [User accounts]    | [Test user configurations]   | [Factory/Fixture]   |
| [Product data]     | [Sample products]            | [Seed script]       |

---

### Dependencies and Risks

| Risk                        | Impact | Mitigation                      |
|-----------------------------|--------|----------------------------------|
| [External API instability]  | High   | [Use mocks in CI, real in staging]|
| [Test data freshness]       | Medium | [Daily refresh script]          |

---

### Execution Plan

**Phase 1: Unit Tests** (Week 1)
- [ ] [Module A] unit tests
- [ ] [Module B] unit tests

**Phase 2: Integration Tests** (Week 2)
- [ ] [Integration point 1]
- [ ] [Integration point 2]

**Phase 3: E2E Tests** (Week 3)
- [ ] [Critical journey 1]
- [ ] [Critical journey 2]

### Success Criteria
- [ ] Overall coverage ≥ [X]%
- [ ] All P0 tests passing
- [ ] CI pipeline < [X] minutes
- [ ] Zero flaky tests
```

Save as markdown.

### Step 6: Offer Next Steps

- "Want me to **generate the unit test code** for the highest priority cases?"
- "Should I **design the test data factories** for this test plan?"
- "Want me to **create mock strategies** for the external dependencies?"
- "Should I **set up the TDD workflow** for implementing these tests?"

## Notes

- Start with critical paths — cover the money and security flows first
- Balance coverage with maintenance cost — 100% coverage is rarely worth it
- Integration tests often provide the best value-to-effort ratio
- E2E tests should be few and focused on complete user journeys
- Include negative tests: what happens when things fail?
- Consider non-functional tests: performance, accessibility, security
