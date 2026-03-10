---
name: test-strategy
description: "Formulate comprehensive test strategies using testing pyramid or testing trophy approaches, defining test distribution across layers. Use when planning test architecture, determining test investment priorities, or establishing testing standards for a project."
---

# Test Strategy

Formulate comprehensive test strategies that balance test coverage, execution speed, and maintenance cost across different testing layers.

**Use when:** Planning test architecture, determining test investment priorities, establishing testing standards, or optimizing an existing test suite.

**Arguments:**
- `$PROJECT`: The project or system name
- `$CONTEXT`: Application type, tech stack, team size, deployment frequency
- `$CONSTRAINTS`: Time, budget, or resource constraints

## Testing Models

### Testing Pyramid (Traditional)

```
        /\
       /E2E\        <- Few, slow, expensive
      /------\
     /  Integ  \    <- Some, moderate
    /------------\
   /    Unit      \  <- Many, fast, cheap
  ------------------
```

**Distribution:** 70% Unit / 20% Integration / 10% E2E

**Best for:** Backend services, APIs, microservices, libraries

### Testing Trophy (Frontend-Focused)

```
       ___________
      |    E2E    |   <- Few critical paths
      |___________|
     /             \
    |  Integration  |  <- Most tests here
    |_______________|
   /                 \
  |    Static/Unit    | <- Type checking, linting, unit
  |___________________|
```

**Distribution:** 30% Static/Unit / 50% Integration / 20% E2E

**Best for:** Frontend applications, full-stack apps, user-facing products

### Testing Diamond (Service Layer)

```
      /\
     /E2E\
    /------\
   |Contract |
   |  Tests  |
    \------/
     \Unit/
      \/
```

**Best for:** Microservices architecture, API-first development

## Step-by-Step Process

1. **Analyze the system architecture**
   - Identify components, services, and integration points
   - Map critical business logic locations
   - Understand deployment and release patterns

2. **Select the appropriate testing model**
   - Consider tech stack and application type
   - Evaluate team experience and testing maturity
   - Account for CI/CD pipeline constraints

3. **Define test distribution**
   - Allocate percentages across testing layers
   - Justify distribution based on risk and value
   - Plan for gradual evolution of the strategy

4. **Establish testing standards**
   - Define coverage targets per layer
   - Set execution time budgets
   - Document patterns and anti-patterns

5. **Create the implementation roadmap**
   - Prioritize high-value test additions
   - Plan tooling and infrastructure needs
   - Define success metrics

## Strategy Template

```markdown
## Test Strategy: [Project Name]

### Context
- **Application Type**: [Web app / API / Mobile / Library]
- **Tech Stack**: [Languages, frameworks, databases]
- **Team Size**: [Number of developers]
- **Release Cadence**: [Daily / Weekly / Monthly]

### Selected Model
[Testing Pyramid / Trophy / Diamond] because [rationale]

### Test Distribution

| Layer        | Target % | Current % | Gap   | Priority |
|--------------|----------|-----------|-------|----------|
| E2E          | X%       | Y%        | Z%    | [H/M/L]  |
| Integration  | X%       | Y%        | Z%    | [H/M/L]  |
| Unit         | X%       | Y%        | Z%    | [H/M/L]  |

### Coverage Targets

| Component       | Line % | Branch % | Critical Paths |
|-----------------|--------|----------|----------------|
| [Component A]   | 80%    | 70%      | Auth, Checkout |
| [Component B]   | 70%    | 60%      | Data sync      |

### Execution Budget

| Layer       | Max Time | Parallelization | Run Frequency |
|-------------|----------|-----------------|---------------|
| Unit        | 2 min    | Full            | Every commit  |
| Integration | 10 min   | Partial         | Every PR      |
| E2E         | 30 min   | Limited         | Pre-deploy    |

### Tooling

| Purpose          | Tool             | Status     |
|------------------|------------------|------------|
| Unit Testing     | [Jest/Pytest]    | [In use]   |
| Integration      | [Tool]           | [Needed]   |
| E2E              | [Playwright]     | [In use]   |
| Coverage         | [Istanbul]       | [In use]   |

### Implementation Roadmap

**Phase 1 (Weeks 1-2):** [Focus area]
**Phase 2 (Weeks 3-4):** [Focus area]
**Phase 3 (Weeks 5-8):** [Focus area]

### Success Metrics
- Overall coverage: [Target]%
- CI pipeline time: Under [X] minutes
- Flaky test rate: Under [Y]%
- Bug escape rate: Reduced by [Z]%
```

## Example Strategy

### Context
E-commerce checkout service, Node.js/TypeScript, 6 developers, weekly releases.

### Recommendation
**Testing Trophy** approach because:
- User-facing checkout flow requires realistic integration testing
- Complex state management benefits from integration tests over unit mocks
- Critical payment flows need E2E validation

### Distribution
- **Unit (25%):** Pure functions, utilities, validators, formatters
- **Integration (55%):** API routes, database operations, service interactions
- **E2E (20%):** Complete checkout flow, payment success/failure, error handling

## Notes

- Start with the testing model that matches your application type, then adapt
- Coverage percentages are guidelines, not rigid rules — focus on critical paths first
- Fast feedback loops matter: unit tests should run in seconds, not minutes
- Flaky tests destroy confidence — fix or remove them immediately
- Invest in test infrastructure early: good CI/CD pays dividends
