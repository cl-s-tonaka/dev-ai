---
name: unit-test-design
description: "Design effective unit tests using AAA (Arrange-Act-Assert) or Given-When-Then patterns with proper isolation and assertions. Use when writing unit tests, refactoring test code, establishing test patterns, or reviewing test quality."
---

# Unit Test Design

Design effective unit tests that are readable, maintainable, and provide fast feedback on code correctness.

**Use when:** Writing unit tests, refactoring test code, establishing test patterns, reviewing test quality, or teaching testing practices.

**Arguments:**
- `$CODE`: The function, class, or module to test
- `$LANGUAGE`: Programming language and test framework
- `$CONTEXT`: Business logic context or requirements

## Unit Test Patterns

### AAA Pattern (Arrange-Act-Assert)

```javascript
describe('Calculator', () => {
  it('should add two positive numbers', () => {
    // Arrange
    const calculator = new Calculator();
    const a = 5;
    const b = 3;

    // Act
    const result = calculator.add(a, b);

    // Assert
    expect(result).toBe(8);
  });
});
```

### Given-When-Then (BDD Style)

```javascript
describe('ShoppingCart', () => {
  describe('given an empty cart', () => {
    describe('when adding an item', () => {
      it('then the cart should contain one item', () => {
        const cart = new ShoppingCart();
        cart.addItem({ id: 1, name: 'Widget', price: 10 });
        expect(cart.itemCount).toBe(1);
      });

      it('then the total should equal the item price', () => {
        const cart = new ShoppingCart();
        cart.addItem({ id: 1, name: 'Widget', price: 10 });
        expect(cart.total).toBe(10);
      });
    });
  });
});
```

## Step-by-Step Process

1. **Identify the unit under test**
   - Single function, method, or class
   - Clear input/output boundaries
   - Minimal external dependencies

2. **List test cases**
   - Happy path (expected inputs)
   - Edge cases (boundaries, empty, null)
   - Error cases (invalid inputs, exceptions)

3. **Design each test**
   - One assertion per test (ideally)
   - Descriptive test names that document behavior
   - Independent tests that can run in any order

4. **Isolate dependencies**
   - Mock external services and I/O
   - Use dependency injection
   - Avoid global state

5. **Write assertions**
   - Assert on behavior, not implementation
   - Use specific matchers for clarity
   - Include failure messages when helpful

## Test Case Template

```markdown
## Unit Tests: [Function/Class Name]

### Test Cases

| ID | Category    | Scenario                  | Input       | Expected Output  |
|----|-------------|---------------------------|-------------|------------------|
| 1  | Happy Path  | [Normal operation]        | [Input]     | [Output]         |
| 2  | Edge Case   | [Boundary condition]      | [Input]     | [Output]         |
| 3  | Edge Case   | [Empty/null handling]     | [Input]     | [Output]         |
| 4  | Error Case  | [Invalid input]           | [Input]     | [Error/Exception]|

### Test Code

[Test implementation following AAA or Given-When-Then]
```

## Example: Password Validator

### Function Under Test

```javascript
function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain an uppercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain a number' };
  }
  return { valid: true };
}
```

### Test Cases

| ID | Category    | Scenario                 | Input         | Expected                    |
|----|-------------|--------------------------|---------------|-----------------------------|
| 1  | Happy Path  | Valid password           | "Password1"   | { valid: true }             |
| 2  | Edge Case   | Exactly 8 characters     | "Passwor1"    | { valid: true }             |
| 3  | Edge Case   | Empty string             | ""            | Error: at least 8 chars     |
| 4  | Edge Case   | Null input               | null          | Error: at least 8 chars     |
| 5  | Error       | Too short                | "Pass1"       | Error: at least 8 chars     |
| 6  | Error       | No uppercase             | "password1"   | Error: uppercase required   |
| 7  | Error       | No number                | "Password"    | Error: number required      |

### Test Implementation

```javascript
describe('validatePassword', () => {
  describe('valid passwords', () => {
    it('should accept a password meeting all requirements', () => {
      // Arrange
      const password = 'Password1';

      // Act
      const result = validatePassword(password);

      // Assert
      expect(result).toEqual({ valid: true });
    });

    it('should accept a password with exactly 8 characters', () => {
      const result = validatePassword('Passwor1');
      expect(result.valid).toBe(true);
    });
  });

  describe('invalid passwords', () => {
    it('should reject empty string', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 8 characters');
    });

    it('should reject null input', () => {
      const result = validatePassword(null);
      expect(result.valid).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = validatePassword('Pass1');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 8 characters');
    });

    it('should reject password without uppercase letter', () => {
      const result = validatePassword('password1');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('uppercase');
    });

    it('should reject password without number', () => {
      const result = validatePassword('Password');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('number');
    });
  });
});
```

## Test Naming Conventions

### Format Options

```
// Method-based
test_[method]_[scenario]_[expected]
test_add_twoPositiveNumbers_returnsSum

// Should-based
should[Expected]When[Scenario]
shouldReturnSumWhenAddingTwoPositiveNumbers

// Given-When-Then
given[Context]When[Action]Then[Result]
givenEmptyCartWhenAddingItemThenCartContainsOneItem
```

## Anti-Patterns to Avoid

| Anti-Pattern           | Problem                          | Solution                        |
|------------------------|----------------------------------|---------------------------------|
| Testing implementation | Brittle, breaks on refactor      | Test behavior and outputs       |
| Multiple assertions    | Unclear what failed              | One logical assertion per test  |
| Shared mutable state   | Tests affect each other          | Fresh setup for each test       |
| Testing private methods| Over-specification               | Test through public interface   |
| Overly complex setup   | Hard to understand               | Use builders or factories       |
| Ignoring edge cases    | Bugs in boundaries               | Systematically cover boundaries |

## Notes

- Fast tests encourage frequent running — keep unit tests under 100ms each
- Test names should read like documentation — future developers will thank you
- Avoid logic in tests (if/else, loops) — tests should be linear and obvious
- Use test data builders for complex objects to keep tests readable
- Run tests in random order to catch hidden dependencies
