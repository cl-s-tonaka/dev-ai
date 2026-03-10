---
description: Execute TDD workflow — write failing test, implement minimum code, refactor while green
argument-hint: "<feature or function to implement>"
---

# /tdd -- Test-Driven Development Workflow

Guide through the Test-Driven Development cycle: write a failing test (Red), implement minimum code to pass (Green), then refactor while keeping tests green.

## Invocation

```
/tdd password validation function with length and complexity rules
/tdd shopping cart add/remove item functionality
/tdd [paste requirements or acceptance criteria]
/tdd calculate shipping cost based on weight and destination
```

## Workflow

### Step 1: Accept Requirements

Accept: feature description, function specification, acceptance criteria, or user story that defines what to implement.

Gather context:
- What is the expected input/output?
- What are the edge cases and error conditions?
- What language and test framework are you using?

### Step 2: Break Down Behaviors

Decompose the feature into small, testable behaviors ordered from simplest to most complex:

```markdown
## Behavior Breakdown: [Feature Name]

1. [Simplest valid case] — Start here
2. [Next simplest case] — Build on previous
3. [Edge case] — Boundary condition
4. [Another edge case] — Empty/null handling
5. [Error case] — Invalid input
6. [Complex case] — Full functionality
```

**Example for Password Validator:**
1. Reject empty password
2. Reject password shorter than 8 characters
3. Accept password with 8+ characters
4. Reject password without uppercase
5. Reject password without number
6. Accept valid password meeting all criteria

### Step 3: TDD Cycle — Red Phase

Apply the **tdd-guide** skill:

Write the first failing test for the simplest behavior:

```javascript
// Cycle 1: RED
describe('validatePassword', () => {
  it('should reject empty password', () => {
    const result = validatePassword('');

    expect(result).toEqual({
      valid: false,
      error: 'Password must be at least 8 characters'
    });
  });
});
```

Run the test — confirm it fails for the right reason:
```
✗ validatePassword › should reject empty password
  ReferenceError: validatePassword is not defined
```

### Step 4: TDD Cycle — Green Phase

Write the **minimum** code to make the test pass:

```javascript
// Cycle 1: GREEN
function validatePassword(password) {
  return {
    valid: false,
    error: 'Password must be at least 8 characters'
  };
}
```

Run the test — confirm it passes:
```
✓ validatePassword › should reject empty password
```

### Step 5: TDD Cycle — Refactor Phase

Improve the code while keeping tests green:
- Remove duplication
- Improve naming
- Extract functions or constants
- Simplify logic

For this cycle: No refactoring needed yet — code is minimal.

### Step 6: Next Cycle

Add the next test (back to Red), make it pass (Green), refactor:

```javascript
// Cycle 2: RED — New test
it('should reject password shorter than 8 characters', () => {
  const result = validatePassword('Short1');
  expect(result.valid).toBe(false);
  expect(result.error).toContain('at least 8 characters');
});

// This already passes with current implementation!
// Move to next behavior...

// Cycle 3: RED — Force generalization
it('should accept password with 8+ characters, uppercase, and number', () => {
  const result = validatePassword('Password1');
  expect(result).toEqual({ valid: true });
});

// Cycle 3: GREEN — Implement validation logic
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

Continue until all behaviors are implemented.

### Step 7: Generate TDD Session Log

```markdown
## TDD Session: [Feature Name]

### Requirements
[Original requirements or acceptance criteria]

### Behavior Breakdown
1. [Behavior 1]
2. [Behavior 2]
3. ...

### TDD Log

| Cycle | Phase    | Action                              | Outcome      |
|-------|----------|-------------------------------------|--------------|
| 1     | Red      | Test: reject empty password         | Fails ✓      |
| 1     | Green    | Return hardcoded error              | Passes ✓     |
| 1     | Refactor | None needed                         | Passes ✓     |
| 2     | Red      | Test: reject short password         | Already passes|
| 3     | Red      | Test: accept valid password         | Fails ✓      |
| 3     | Green    | Implement validation rules          | Passes ✓     |
| 3     | Refactor | Extract rules to array              | Passes ✓     |
| ...   | ...      | ...                                 | ...          |

### Final Implementation

```javascript
// Final code that emerged from TDD
```

### Test Suite

```javascript
// Complete test file
```

### Insights
- [Design decisions that emerged]
- [Refactoring performed]
- [What was learned]
```

Save as markdown with code files.

### Step 8: Offer Next Steps

- "Want me to **add more edge case tests** for this implementation?"
- "Should I **refactor further** to improve the design?"
- "Want me to **generate test data** for additional scenarios?"
- "Should I **apply TDD to the next feature**?"

## TDD Tips

### The Three Laws
1. Write no production code until you have a failing test
2. Write only enough test to fail (compilation failures count)
3. Write only enough production code to pass the test

### Time Targets
| Phase    | Target Time | If Longer...                     |
|----------|-------------|----------------------------------|
| Red      | 1-3 min     | Test is too complex, simplify    |
| Green    | 1-5 min     | Step is too big, break it down   |
| Refactor | 2-10 min    | Big refactor? Do it incrementally|

### Common Strategies
- **Fake It**: Return hardcoded value, then generalize
- **Triangulation**: Add tests until pattern emerges
- **Obvious Implementation**: If solution is clear, write it

## Notes

- Small steps are key — if Green takes more than 5 minutes, step is too big
- Tests are design feedback — hard to test often means poor design
- Refactor relentlessly — this is where design improves
- It's okay to "cheat" in Green phase — just make it pass
- Run tests after every change — fast feedback is essential
- TDD takes practice — expect awkwardness initially
