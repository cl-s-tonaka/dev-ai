---
name: mock-strategy
description: "Design mock and stub strategies for test isolation, choosing appropriate test doubles for different scenarios. Use when isolating units under test, mocking external dependencies, or improving test reliability and speed."
---

# Mock Strategy

Design effective mock and stub strategies to isolate units under test and create fast, reliable tests.

**Use when:** Isolating units under test, mocking external dependencies, testing error scenarios, or improving test speed and reliability.

**Arguments:**
- `$CODE`: The code or component to test
- `$DEPENDENCIES`: External dependencies to mock
- `$CONTEXT`: Test framework and mocking library

## Test Double Types

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Test Doubles                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DUMMY ──────► Passed but never used. Fills parameter lists.       │
│                                                                     │
│  STUB ───────► Provides canned answers to calls made during test.  │
│                                                                     │
│  SPY ────────► Records information about how it was called.        │
│                                                                     │
│  MOCK ───────► Pre-programmed with expectations and verifications. │
│                                                                     │
│  FAKE ───────► Working implementation with shortcuts (in-memory DB)│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Test Double Comparison

| Type  | Returns Values | Records Calls | Verifies Behavior | Real Logic |
|-------|----------------|---------------|-------------------|------------|
| Dummy | No             | No            | No                | No         |
| Stub  | Yes (canned)   | No            | No                | No         |
| Spy   | Optional       | Yes           | Optional          | No         |
| Mock  | Yes            | Yes           | Yes               | No         |
| Fake  | Yes            | No            | No                | Simplified |

## When to Use Each Type

### Dummy
Use when a parameter is required but not used:
```javascript
// Logger is required but we don't care about logging in this test
const dummyLogger = { log: () => {} };
const service = new UserService(repository, dummyLogger);
```

### Stub
Use to control indirect inputs:
```javascript
// Stub returns canned data
const userRepositoryStub = {
  findById: jest.fn().mockReturnValue({ id: 1, name: 'Test User' })
};

it('should return user name', () => {
  const service = new UserService(userRepositoryStub);
  const result = service.getUserName(1);
  expect(result).toBe('Test User');
});
```

### Spy
Use to verify interactions without changing behavior:
```javascript
const analyticsService = { track: jest.fn() };

it('should track checkout event', () => {
  const checkout = new CheckoutService(analyticsService);
  checkout.complete(orderId);

  expect(analyticsService.track).toHaveBeenCalledWith('checkout_complete', {
    orderId
  });
});
```

### Mock
Use for complex interaction verification:
```javascript
const paymentGateway = {
  charge: jest.fn()
    .mockResolvedValueOnce({ success: true, transactionId: 'tx123' })
    .mockRejectedValueOnce(new Error('Insufficient funds'))
};

it('should handle payment success', async () => {
  const result = await checkout.processPayment(100);
  expect(result.transactionId).toBe('tx123');
  expect(paymentGateway.charge).toHaveBeenCalledWith(100);
});

it('should handle payment failure', async () => {
  await expect(checkout.processPayment(100)).rejects.toThrow('Insufficient funds');
});
```

### Fake
Use when you need realistic behavior:
```javascript
// In-memory repository fake
class FakeUserRepository {
  constructor() {
    this.users = new Map();
  }

  save(user) {
    const id = this.users.size + 1;
    const savedUser = { ...user, id };
    this.users.set(id, savedUser);
    return savedUser;
  }

  findById(id) {
    return this.users.get(id);
  }

  findAll() {
    return Array.from(this.users.values());
  }
}
```

## Mock Strategy by Dependency Type

### External HTTP APIs

```javascript
// Option 1: Mock at the client level
jest.mock('./httpClient', () => ({
  get: jest.fn().mockResolvedValue({ data: { users: [] } }),
  post: jest.fn().mockResolvedValue({ data: { id: 1 } })
}));

// Option 2: Mock at the network level (MSW)
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: 'Test' }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Database

```javascript
// Option 1: Repository pattern with fake
const fakeRepository = new FakeUserRepository();
const service = new UserService(fakeRepository);

// Option 2: In-memory database
import { createTestDatabase } from './testUtils';
const db = createTestDatabase();

// Option 3: Test containers (for integration tests)
const container = await new PostgreSqlContainer().start();
```

### Time and Dates

```javascript
// Jest fake timers
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-01-15'));
});

afterEach(() => {
  jest.useRealTimers();
});

it('should calculate age correctly', () => {
  const user = { birthDate: new Date('1990-01-15') };
  expect(calculateAge(user)).toBe(34);
});
```

### Random Values

```javascript
// Inject random source
function generateId(randomFn = Math.random) {
  return Math.floor(randomFn() * 1000000);
}

it('should generate predictable ID with mock random', () => {
  const mockRandom = jest.fn().mockReturnValue(0.5);
  expect(generateId(mockRandom)).toBe(500000);
});
```

### File System

```javascript
// Mock fs module
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue('file contents'),
  writeFileSync: jest.fn()
}));

// Or use memfs for realistic file system behavior
import { vol } from 'memfs';
vol.fromJSON({
  '/config.json': '{"setting": "value"}'
});
```

## Mock Strategy Template

```markdown
## Mock Strategy: [Component Under Test]

### Dependencies to Mock

| Dependency        | Type     | Mock Approach          | Rationale                |
|-------------------|----------|------------------------|--------------------------|
| UserRepository    | Database | Fake (in-memory)       | Need realistic behavior  |
| PaymentGateway    | External | Mock                   | Verify exact interactions|
| EmailService      | External | Spy                    | Just verify it was called|
| Logger            | Utility  | Dummy                  | Not relevant to test     |
| CurrentTime       | System   | Stub (fixed date)      | Deterministic tests      |

### Mock Configurations

#### [Dependency 1]: [Mock Type]
```javascript
// Mock setup code
```

**Scenarios:**
- Happy path: Returns [value]
- Error case: Throws [error]
- Edge case: Returns [value]

#### [Dependency 2]: [Mock Type]
...

### Verification Strategy

| Interaction            | Verify? | Assertion                          |
|------------------------|---------|-----------------------------------|
| Repository.save called | Yes     | Called once with correct data     |
| Email sent             | Yes     | Called with recipient and subject |
| Logger called          | No      | Dummy, not verified               |
```

## Anti-Patterns to Avoid

| Anti-Pattern              | Problem                          | Solution                       |
|---------------------------|----------------------------------|--------------------------------|
| Over-mocking              | Tests don't reflect reality      | Use fakes for complex behavior |
| Mocking what you don't own| Fragile to library changes       | Wrap third-party libraries     |
| Implementation coupling   | Tests break on refactoring       | Mock at boundaries only        |
| Ignoring mock verification| Missing interaction bugs         | Verify critical interactions   |
| Complex mock setup        | Hard to understand tests         | Simplify or use fakes          |

## Mock Boundaries

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Where to Mock                                   │
│                                                                     │
│  ┌─────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │  Unit   │───▶│  Service    │───▶│  Repository │                 │
│  │  Test   │    │  (Real)     │    │  (Mocked)   │                 │
│  └─────────┘    └─────────────┘    └─────────────┘                 │
│                       │                   │                         │
│                       │                   ▼                         │
│                       │            ┌─────────────┐                  │
│                       │            │  Database   │                  │
│                       │            │  (Real in   │                  │
│                       │            │  integration)│                 │
│                       │            └─────────────┘                  │
│                       ▼                                             │
│                ┌──────────────┐                                     │
│                │ External API │ ← Always mock in unit tests         │
│                │   (Mocked)   │                                     │
│                └──────────────┘                                     │
│                                                                     │
│  RULE: Mock at architectural boundaries, not internal details      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Notes

- Prefer stubs and fakes over mocks — mocks couple tests to implementation
- Mock at boundaries (APIs, databases, external services), not internal classes
- Use dependency injection to make code testable without complex mocking
- Reset mocks between tests to avoid cross-test contamination
- Too many mocks is a design smell — consider refactoring production code
- Name mocks clearly: `mockPaymentGateway`, `stubUserRepository`, `fakeDatabase`
