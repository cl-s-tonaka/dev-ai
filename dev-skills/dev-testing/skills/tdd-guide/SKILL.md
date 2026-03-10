---
name: tdd-guide
description: "Practice Test-Driven Development with Red-Green-Refactor workflow, test-first methodology, and incremental design. Use when building new features test-first, learning TDD practices, or improving code design through testing."
---

# TDD Guide

Practice Test-Driven Development using the Red-Green-Refactor cycle to build well-designed, thoroughly tested code.

**Use when:** Building new features test-first, learning TDD practices, improving code design, or establishing TDD workflows on a team.

**Arguments:**
- `$FEATURE`: The feature or functionality to implement
- `$LANGUAGE`: Programming language and test framework
- `$CONTEXT`: Requirements, acceptance criteria, or user story

## The TDD Cycle

```
        ┌─────────────────────────────────────────────┐
        │                                             │
        │              RED-GREEN-REFACTOR             │
        │                                             │
        │    ┌───────┐     ┌───────┐     ┌─────────┐ │
        │    │  RED  │────▶│ GREEN │────▶│REFACTOR │ │
        │    └───────┘     └───────┘     └─────────┘ │
        │        │                             │      │
        │        │                             │      │
        │        └─────────────────────────────┘      │
        │                                             │
        └─────────────────────────────────────────────┘

  RED:      Write a failing test for the next small behavior
  GREEN:    Write minimum code to make the test pass
  REFACTOR: Improve code design while keeping tests green
```

## TDD Rules

### The Three Laws of TDD

1. **Write no production code until you have a failing test**
2. **Write only enough test to fail** (compilation failures count)
3. **Write only enough production code to pass the test**

### The Cycle in Detail

| Phase    | Duration  | Goal                                    | Constraint                    |
|----------|-----------|----------------------------------------|-------------------------------|
| Red      | 1-3 min   | Define the next behavior               | Test must fail for right reason|
| Green    | 1-5 min   | Make test pass                         | Minimum code, "sins" allowed  |
| Refactor | 2-10 min  | Improve design                         | Tests must stay green         |

## Step-by-Step TDD Process

### 1. Red Phase: Write a Failing Test

```javascript
// Start with the simplest behavior
describe('FizzBuzz', () => {
  it('should return "1" for input 1', () => {
    expect(fizzBuzz(1)).toBe('1');
  });
});

// Run test — it fails (RED)
// Error: fizzBuzz is not defined
```

### 2. Green Phase: Make It Pass

```javascript
// Minimum code to pass
function fizzBuzz(n) {
  return '1';
}

// Run test — it passes (GREEN)
```

### 3. Refactor Phase: Improve Design

```javascript
// No refactoring needed yet — code is trivial
// Move to next test
```

### 4. Next Cycle: Add New Behavior

```javascript
// Add next test (RED)
it('should return "2" for input 2', () => {
  expect(fizzBuzz(2)).toBe('2');
});

// Make it pass (GREEN)
function fizzBuzz(n) {
  return String(n);
}

// Continue with Fizz, Buzz, FizzBuzz rules...
```

## TDD Example: Password Validator

### Requirement
Password must be 8+ characters with at least one uppercase letter and one number.

### TDD Session

```javascript
// Cycle 1: RED — Empty password
describe('PasswordValidator', () => {
  it('should reject empty password', () => {
    expect(validatePassword('')).toEqual({
      valid: false,
      error: 'Password must be at least 8 characters'
    });
  });
});

// Cycle 1: GREEN
function validatePassword(password) {
  return { valid: false, error: 'Password must be at least 8 characters' };
}

// Cycle 2: RED — Short password
it('should reject password shorter than 8 characters', () => {
  expect(validatePassword('Short1')).toEqual({
    valid: false,
    error: 'Password must be at least 8 characters'
  });
});
// Already passes! Move on.

// Cycle 3: RED — Valid length but missing uppercase
it('should reject password without uppercase letter', () => {
  expect(validatePassword('password1')).toEqual({
    valid: false,
    error: 'Password must contain an uppercase letter'
  });
});

// Cycle 3: GREEN
function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain an uppercase letter' };
  }
  return { valid: false, error: 'Password must contain a number' };
}

// Cycle 4: RED — Missing number
it('should reject password without a number', () => {
  expect(validatePassword('Password')).toEqual({
    valid: false,
    error: 'Password must contain a number'
  });
});
// Already passes!

// Cycle 5: RED — Valid password
it('should accept valid password', () => {
  expect(validatePassword('Password1')).toEqual({ valid: true });
});

// Cycle 5: GREEN
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

// Cycle 5: REFACTOR — Extract validation rules
const validationRules = [
  { test: (p) => p && p.length >= 8, error: 'Password must be at least 8 characters' },
  { test: (p) => /[A-Z]/.test(p), error: 'Password must contain an uppercase letter' },
  { test: (p) => /[0-9]/.test(p), error: 'Password must contain a number' },
];

function validatePassword(password) {
  for (const rule of validationRules) {
    if (!rule.test(password)) {
      return { valid: false, error: rule.error };
    }
  }
  return { valid: true };
}
```

## TDD Session Template

```markdown
## TDD Session: [Feature Name]

### Requirements
[User story or acceptance criteria]

### Behavior Breakdown
1. [Simplest behavior to implement first]
2. [Next behavior]
3. [Edge case behavior]
4. [Error case behavior]
5. [Final expected behavior]

### TDD Log

| Cycle | Phase    | Test/Action                    | Outcome        |
|-------|----------|--------------------------------|----------------|
| 1     | Red      | Test: [description]            | Fails (expected)|
| 1     | Green    | Code: [what was added]         | Passes         |
| 1     | Refactor | [Refactoring performed or skip]| Tests pass     |
| 2     | Red      | Test: [description]            | Fails          |
| ...   | ...      | ...                            | ...            |

### Final Implementation
[Code that emerged from TDD]

### Observations
- [What design emerged?]
- [What did you learn?]
- [What would you do differently?]
```

## Common TDD Strategies

### Fake It Till You Make It
```javascript
// Return hard-coded value, then generalize
it('should add 2 + 3', () => expect(add(2, 3)).toBe(5));

// Fake it
function add(a, b) { return 5; }

// Add another test to force generalization
it('should add 1 + 1', () => expect(add(1, 1)).toBe(2));

// Now implement properly
function add(a, b) { return a + b; }
```

### Triangulation
Use multiple tests to find the general solution:
```javascript
it('should return 1 for [1]', () => expect(sum([1])).toBe(1));
it('should return 3 for [1, 2]', () => expect(sum([1, 2])).toBe(3));
it('should return 6 for [1, 2, 3]', () => expect(sum([1, 2, 3])).toBe(6));
```

### Obvious Implementation
When the solution is clear, write it directly:
```javascript
it('should return the larger of two numbers', () => {
  expect(max(3, 5)).toBe(5);
});

function max(a, b) { return a > b ? a : b; }  // Obvious
```

## TDD Anti-Patterns

| Anti-Pattern           | Problem                         | Solution                        |
|------------------------|---------------------------------|---------------------------------|
| Too big a step         | Hard to get green quickly       | Break into smaller behaviors    |
| Skipping refactor      | Technical debt accumulates      | Refactor every cycle            |
| Testing implementation | Brittle tests                   | Test behavior, not internals    |
| Gold plating           | Adding untested features        | Only code to pass tests         |
| Ignoring test smells   | Hard to maintain tests          | Refactor tests too              |

## Notes

- Small steps are the key — if green takes more than 5 minutes, the step is too big
- Tests are design feedback — hard to test often means poor design
- Refactor relentlessly — this is where the design improves
- TDD takes practice — expect awkwardness at first, fluency comes with experience
- Use TDD for complex logic — trivial code may not need the full cycle
