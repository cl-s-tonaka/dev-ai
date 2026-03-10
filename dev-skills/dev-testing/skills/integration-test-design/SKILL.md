---
name: integration-test-design
description: "Design integration tests for component interactions, API contracts, database operations, and external service dependencies. Use when testing service boundaries, API endpoints, database queries, or multi-component workflows."
---

# Integration Test Design

Design integration tests that verify correct interaction between components, services, and external dependencies.

**Use when:** Testing API endpoints, database operations, service-to-service communication, or multi-component workflows.

**Arguments:**
- `$SYSTEM`: The system or service to test
- `$INTEGRATION_POINTS`: Components, APIs, or services being integrated
- `$CONTEXT`: Technical stack and infrastructure details

## Integration Test Scope

```
┌─────────────────────────────────────────────────────────────┐
│                    Integration Test Boundary                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │   API    │───▶│  Service │───▶│ Database │              │
│  │ Endpoint │    │  Layer   │    │          │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│        │                               ▲                    │
│        │         ┌──────────┐          │                    │
│        └────────▶│  Cache   │──────────┘                    │
│                  └──────────┘                               │
└─────────────────────────────────────────────────────────────┘
        ▲                                      │
        │                                      ▼
   ┌─────────┐                          ┌─────────────┐
   │ External│  (Mocked or Stubbed)     │  External   │
   │   API   │                          │   Service   │
   └─────────┘                          └─────────────┘
```

## Integration Test Categories

### 1. API Integration Tests

Test HTTP endpoints with real service logic but controlled dependencies.

```javascript
describe('POST /api/users', () => {
  beforeEach(async () => {
    await database.clear('users');
  });

  it('should create a new user and return 201', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'SecurePass123'
    };

    // Act
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect('Content-Type', /json/);

    // Assert
    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.password).toBeUndefined(); // Not exposed

    // Verify side effects
    const savedUser = await database.findUser(response.body.user.id);
    expect(savedUser).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
  });

  it('should return 409 for duplicate email', async () => {
    // Arrange
    await database.createUser({ email: 'existing@example.com' });

    // Act & Assert
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'existing@example.com', name: 'New User' });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain('already exists');
  });
});
```

### 2. Database Integration Tests

Test data access layer with real database operations.

```javascript
describe('UserRepository', () => {
  let repository;
  let testDb;

  beforeAll(async () => {
    testDb = await createTestDatabase();
    repository = new UserRepository(testDb);
  });

  afterAll(async () => {
    await testDb.close();
  });

  beforeEach(async () => {
    await testDb.truncate('users');
  });

  it('should persist and retrieve a user', async () => {
    // Arrange
    const user = { email: 'test@example.com', name: 'Test' };

    // Act
    const savedUser = await repository.save(user);
    const retrieved = await repository.findById(savedUser.id);

    // Assert
    expect(retrieved.email).toBe(user.email);
    expect(retrieved.createdAt).toBeInstanceOf(Date);
  });

  it('should handle concurrent updates with optimistic locking', async () => {
    // Arrange
    const user = await repository.save({ email: 'test@example.com', name: 'V1' });

    // Act - Simulate concurrent updates
    const update1 = repository.update(user.id, { name: 'V2' }, user.version);
    const update2 = repository.update(user.id, { name: 'V3' }, user.version);

    // Assert
    await expect(update1).resolves.toBeDefined();
    await expect(update2).rejects.toThrow('OptimisticLockError');
  });
});
```

### 3. Service-to-Service Integration

Test interactions between internal services.

```javascript
describe('OrderService + InventoryService Integration', () => {
  let orderService;
  let inventoryService;

  beforeEach(async () => {
    inventoryService = new InventoryService(testDb);
    orderService = new OrderService(testDb, inventoryService);

    // Seed inventory
    await inventoryService.addStock('WIDGET-001', 10);
  });

  it('should reserve inventory when placing an order', async () => {
    // Act
    const order = await orderService.placeOrder({
      items: [{ sku: 'WIDGET-001', quantity: 3 }]
    });

    // Assert
    expect(order.status).toBe('confirmed');
    const stock = await inventoryService.getAvailableStock('WIDGET-001');
    expect(stock).toBe(7); // 10 - 3
  });

  it('should fail order when insufficient inventory', async () => {
    // Act & Assert
    await expect(
      orderService.placeOrder({
        items: [{ sku: 'WIDGET-001', quantity: 15 }]
      })
    ).rejects.toThrow('Insufficient inventory');

    // Verify no partial reservation
    const stock = await inventoryService.getAvailableStock('WIDGET-001');
    expect(stock).toBe(10);
  });
});
```

## Step-by-Step Process

1. **Identify integration boundaries**
   - What components interact?
   - Which boundaries are being tested?
   - What is mocked vs. real?

2. **Set up test infrastructure**
   - Test database (containerized or in-memory)
   - External service mocks/stubs
   - Test data seeding strategy

3. **Design test scenarios**
   - Happy path integrations
   - Error propagation across boundaries
   - Transaction and rollback behavior
   - Concurrent access scenarios

4. **Implement setup/teardown**
   - Database migrations for test environment
   - Data cleanup between tests
   - Connection pooling and resource management

5. **Write assertions**
   - Verify state changes across components
   - Check side effects (database writes, queue messages)
   - Validate error responses and status codes

## Integration Test Template

```markdown
## Integration Tests: [System/Component]

### Test Environment
- **Database**: [PostgreSQL in Docker / SQLite in-memory]
- **External Services**: [Mocked with WireMock / Stubbed]
- **Test Data**: [Seeded via factories / Fixtures]

### Test Scenarios

| ID | Integration Point     | Scenario                    | Expected Behavior          |
|----|-----------------------|-----------------------------|----------------------------|
| 1  | API → Service → DB    | Create resource             | Persisted, 201 returned    |
| 2  | API → Service → DB    | Duplicate constraint        | 409 Conflict               |
| 3  | Service → External    | External service timeout    | Graceful degradation       |
| 4  | Service → Queue       | Message published           | Message on queue           |

### Setup Requirements
- [ ] Test database container running
- [ ] Mock server configured
- [ ] Test data factories available
```

## Infrastructure Patterns

### Test Containers (Docker-based)

```javascript
const { PostgreSqlContainer } = require('testcontainers');

describe('with real PostgreSQL', () => {
  let container;
  let connectionString;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('test')
      .start();
    connectionString = container.getConnectionUri();
  }, 60000);

  afterAll(async () => {
    await container.stop();
  });

  // Tests use real PostgreSQL
});
```

### In-Memory Alternatives

```javascript
// SQLite for lightweight database tests
const db = new Database(':memory:');

// Redis mock for cache tests
const RedisMock = require('redis-mock');
const client = RedisMock.createClient();
```

## Notes

- Integration tests are slower than unit tests — run them less frequently (per PR, not per commit)
- Use test containers for realistic database behavior, especially for complex queries
- Isolate tests: each test should set up and tear down its own data
- Mock external services at the HTTP boundary, not at the client level
- Test error scenarios: timeouts, connection failures, malformed responses
- Keep integration test suites focused — resist the urge to test everything
