---
name: test-data-generation
description: "Generate realistic test data including fixtures, factories, edge cases, and boundary conditions. Use when creating test fixtures, building data factories, generating edge case data, or establishing test data strategies."
---

# Test Data Generation

Generate realistic, maintainable test data using fixtures, factories, and boundary analysis techniques.

**Use when:** Creating test fixtures, building data factories, generating edge case data, or establishing a test data strategy for a project.

**Arguments:**
- `$ENTITY`: The data entity or model to generate
- `$CONSTRAINTS`: Validation rules, relationships, and business constraints
- `$CONTEXT`: Database schema, API contracts, or data requirements

## Test Data Approaches

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Test Data Approaches                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  FIXTURES ────► Static data files (JSON, YAML) loaded into tests   │
│                 Good for: Reference data, stable test scenarios    │
│                                                                     │
│  FACTORIES ───► Programmatic builders that create data on demand   │
│                 Good for: Dynamic data, many variations            │
│                                                                     │
│  GENERATORS ──► Libraries that produce random realistic data       │
│                 Good for: Bulk data, fuzzing, stress testing       │
│                                                                     │
│  BUILDERS ────► Fluent APIs for constructing complex objects       │
│                 Good for: Readable tests, complex relationships    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Factory Pattern

### JavaScript/TypeScript Factory

```typescript
// factories/userFactory.ts
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  settings: UserSettings;
}

let userIdCounter = 1;

export const userFactory = {
  build(overrides: Partial<User> = {}): User {
    const id = String(userIdCounter++);
    return {
      id,
      email: `user${id}@example.com`,
      name: `Test User ${id}`,
      role: 'user',
      createdAt: new Date(),
      settings: { notifications: true, theme: 'light' },
      ...overrides
    };
  },

  buildAdmin(overrides: Partial<User> = {}): User {
    return this.build({ role: 'admin', ...overrides });
  },

  buildMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, () => this.build(overrides));
  },

  async create(overrides: Partial<User> = {}): Promise<User> {
    const user = this.build(overrides);
    return await database.users.insert(user);
  }
};

// Usage in tests
const user = userFactory.build();
const admin = userFactory.buildAdmin({ name: 'Super Admin' });
const users = userFactory.buildMany(5);
```

### Python Factory

```python
# factories/user_factory.py
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import itertools

@dataclass
class User:
    id: int
    email: str
    name: str
    role: str = "user"
    created_at: datetime = field(default_factory=datetime.now)

class UserFactory:
    _counter = itertools.count(1)

    @classmethod
    def build(cls, **overrides) -> User:
        user_id = next(cls._counter)
        defaults = {
            "id": user_id,
            "email": f"user{user_id}@example.com",
            "name": f"Test User {user_id}",
            "role": "user",
        }
        return User(**{**defaults, **overrides})

    @classmethod
    def build_admin(cls, **overrides) -> User:
        return cls.build(role="admin", **overrides)

    @classmethod
    def build_many(cls, count: int, **overrides) -> list[User]:
        return [cls.build(**overrides) for _ in range(count)]

# Usage
user = UserFactory.build()
admin = UserFactory.build_admin(name="Super Admin")
users = UserFactory.build_many(5)
```

## Builder Pattern

```typescript
// builders/OrderBuilder.ts
class OrderBuilder {
  private order: Partial<Order> = {
    items: [],
    status: 'pending',
    createdAt: new Date()
  };

  withCustomer(customer: Customer): this {
    this.order.customerId = customer.id;
    this.order.shippingAddress = customer.address;
    return this;
  }

  withItems(...items: OrderItem[]): this {
    this.order.items = items;
    return this;
  }

  withItem(product: Product, quantity: number): this {
    this.order.items!.push({
      productId: product.id,
      quantity,
      unitPrice: product.price
    });
    return this;
  }

  withStatus(status: OrderStatus): this {
    this.order.status = status;
    return this;
  }

  withDiscount(percentage: number): this {
    this.order.discountPercent = percentage;
    return this;
  }

  build(): Order {
    const total = this.order.items!.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    return {
      id: generateId(),
      ...this.order,
      total: total * (1 - (this.order.discountPercent || 0) / 100)
    } as Order;
  }
}

// Usage in tests
const order = new OrderBuilder()
  .withCustomer(testCustomer)
  .withItem(widget, 2)
  .withItem(gadget, 1)
  .withDiscount(10)
  .build();
```

## Boundary Value Analysis

### Numeric Boundaries

```typescript
// For a field with range [1, 100]
const boundaryValues = {
  belowMin: 0,           // Invalid: below minimum
  atMin: 1,              // Valid: at minimum
  aboveMin: 2,           // Valid: just above minimum
  nominal: 50,           // Valid: typical value
  belowMax: 99,          // Valid: just below maximum
  atMax: 100,            // Valid: at maximum
  aboveMax: 101          // Invalid: above maximum
};

describe('age validation', () => {
  it.each([
    [0, false, 'below minimum'],
    [1, true, 'at minimum'],
    [2, true, 'above minimum'],
    [50, true, 'nominal'],
    [99, true, 'below maximum'],
    [100, true, 'at maximum'],
    [101, false, 'above maximum'],
  ])('age %i should be valid=%s (%s)', (age, expectedValid, _desc) => {
    expect(isValidAge(age)).toBe(expectedValid);
  });
});
```

### String Boundaries

```typescript
const stringBoundaries = {
  empty: '',
  singleChar: 'a',
  atMinLength: 'ab',        // If minLength is 2
  atMaxLength: 'a'.repeat(255),  // If maxLength is 255
  aboveMaxLength: 'a'.repeat(256),
  withSpecialChars: 'test<script>alert(1)</script>',
  withUnicode: 'Test ユーザー 🎉',
  withWhitespace: '  test  ',
  onlyWhitespace: '   ',
  withNewlines: 'line1\nline2',
};
```

### Date Boundaries

```typescript
const dateBoundaries = {
  distantPast: new Date('1900-01-01'),
  recentPast: new Date(Date.now() - 86400000),  // Yesterday
  now: new Date(),
  nearFuture: new Date(Date.now() + 86400000),  // Tomorrow
  distantFuture: new Date('2100-12-31'),
  leapYear: new Date('2024-02-29'),
  endOfMonth: new Date('2024-01-31'),
  endOfYear: new Date('2024-12-31'),
  invalid: new Date('invalid'),
};
```

## Edge Case Data Sets

### User Entity Edge Cases

```typescript
export const userEdgeCases = {
  // Valid variations
  minimalUser: userFactory.build({
    name: 'A',
    email: 'a@b.co'
  }),

  maxLengthName: userFactory.build({
    name: 'A'.repeat(255)
  }),

  unicodeName: userFactory.build({
    name: '田中太郎 Müller Иванов'
  }),

  // Email edge cases
  emailWithPlus: userFactory.build({
    email: 'user+tag@example.com'
  }),

  emailWithSubdomain: userFactory.build({
    email: 'user@mail.example.co.uk'
  }),

  // Invalid data for error testing
  invalidEmail: { email: 'not-an-email' },
  emptyName: { name: '' },
  nullFields: { email: null, name: null },
};
```

### Test Data Template

```markdown
## Test Data: [Entity Name]

### Entity Schema
| Field     | Type    | Constraints              | Required |
|-----------|---------|--------------------------|----------|
| id        | string  | UUID format              | Yes      |
| email     | string  | Valid email, unique      | Yes      |
| name      | string  | 1-255 chars              | Yes      |
| age       | number  | 0-150, integer           | No       |

### Factory Definition
[Code for the factory]

### Standard Test Cases

| Case Name        | Data Description                | Purpose                    |
|------------------|--------------------------------|----------------------------|
| validMinimal     | Only required fields           | Basic happy path           |
| validComplete    | All fields populated           | Full feature test          |
| validBoundaryMin | Minimum valid values           | Boundary testing           |
| validBoundaryMax | Maximum valid values           | Boundary testing           |

### Edge Cases

| Case Name           | Data Description              | Expected Behavior          |
|---------------------|------------------------------|----------------------------|
| emptyEmail          | email: ''                    | Validation error           |
| longName            | name: 256 chars              | Truncation or error        |
| unicodeContent      | name: 'ユーザー 🎉'           | Handled correctly          |
| sqlInjection        | name: "'; DROP TABLE--"     | Escaped, no injection      |
| xssAttempt          | name: '<script>alert(1)'    | Sanitized                  |

### Relationship Data
[Data for related entities needed in tests]
```

## Data Generation Libraries

### JavaScript/TypeScript
```typescript
// Faker.js
import { faker } from '@faker-js/faker';

const user = {
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  address: faker.location.streetAddress(),
  phone: faker.phone.number(),
  createdAt: faker.date.past()
};

// Fish faker (type-safe)
import { createFaker } from '@faker-js/faker';
```

### Python
```python
# Faker
from faker import Faker
fake = Faker()

user = {
    "id": fake.uuid4(),
    "email": fake.email(),
    "name": fake.name(),
    "address": fake.address(),
    "created_at": fake.past_date()
}

# Factory Boy (with ORM integration)
import factory
from myapp.models import User

class UserFactory(factory.Factory):
    class Meta:
        model = User

    name = factory.Faker('name')
    email = factory.Faker('email')
```

## Notes

- Use factories over fixtures for data that varies between tests
- Keep factory defaults realistic — tests should reflect production scenarios
- Name test data clearly: `validUser`, `expiredToken`, `oversizedPayload`
- Centralize test data creation to update constraints in one place
- Include security-focused test data: SQL injection, XSS, oversized inputs
- Use seeded random generators for reproducible "random" test data
- Document special test data requirements (specific dates, IDs, etc.)
