---
name: regex-builder
version: 1.0.0
description: Build, explain, and test regular expressions for pattern matching
tags:
  - regex
  - patterns
  - validation
  - parsing
  - text-processing
---

# Regular Expression Builder

## Metadata

| Property | Value |
|----------|-------|
| Name | regex-builder |
| Version | 1.0.0 |
| Category | Development |
| Complexity | Medium |

## Instructions

Build, explain, and test regular expressions for various pattern matching needs. Provide clear explanations, test cases, and consider edge cases and performance implications.

### Common Regex Tokens

| Token | Description | Example |
|-------|-------------|---------|
| `.` | Any character except newline | `a.c` matches "abc" |
| `*` | Zero or more | `ab*c` matches "ac", "abc", "abbc" |
| `+` | One or more | `ab+c` matches "abc", "abbc" |
| `?` | Zero or one | `ab?c` matches "ac", "abc" |
| `^` | Start of string | `^abc` matches "abc..." |
| `$` | End of string | `abc$` matches "...abc" |
| `[]` | Character class | `[aeiou]` matches vowels |
| `[^]` | Negated class | `[^0-9]` matches non-digits |
| `\d` | Digit | `\d+` matches "123" |
| `\w` | Word character | `\w+` matches "abc_123" |
| `\s` | Whitespace | `\s+` matches spaces/tabs |
| `\b` | Word boundary | `\bword\b` matches whole word |
| `()` | Capturing group | `(ab)+` captures "ab" |
| `(?:)` | Non-capturing group | `(?:ab)+` groups without capture |
| `(?=)` | Positive lookahead | `a(?=b)` matches "a" before "b" |
| `(?!)` | Negative lookahead | `a(?!b)` matches "a" not before "b" |
| `{n}` | Exactly n | `a{3}` matches "aaa" |
| `{n,}` | n or more | `a{2,}` matches "aa", "aaa" |
| `{n,m}` | Between n and m | `a{2,4}` matches "aa" to "aaaa" |
| `\|` | Alternation | `cat\|dog` matches either |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| requirement | string | Yes | What pattern to match |
| examples | string[] | No | Example strings to match |
| negative_examples | string[] | No | Strings that should NOT match |
| language | string | No | Target language (JS, Python, etc.) |
| flags | string | No | Regex flags needed (i, g, m, etc.) |

## Output Process

### Step 1: Understand Requirements

- [ ] Identify what needs to be matched
- [ ] Gather positive examples
- [ ] Identify what should NOT match
- [ ] Determine capture group needs
- [ ] Consider edge cases

### Step 2: Build Pattern

- [ ] Start with literal characters
- [ ] Add character classes as needed
- [ ] Apply quantifiers
- [ ] Add anchors if needed
- [ ] Group related parts
- [ ] Add alternation if needed

### Step 3: Test Pattern

- [ ] Test all positive examples
- [ ] Test all negative examples
- [ ] Test edge cases
- [ ] Test empty strings
- [ ] Test very long strings
- [ ] Test special characters

### Step 4: Optimize

- [ ] Simplify redundant patterns
- [ ] Use non-capturing groups where possible
- [ ] Consider performance (avoid catastrophic backtracking)
- [ ] Make pattern readable with comments if complex

### Step 5: Document

- [ ] Explain each part of the pattern
- [ ] Provide usage examples
- [ ] Note any limitations
- [ ] Include test cases

## Output Format

### Regex Pattern Card

```markdown
## Pattern: [Name/Purpose]

### Regular Expression
```regex
[pattern]
```

### With Flags
```regex
/[pattern]/[flags]
```

### Explanation
| Part | Meaning |
|------|---------|
| `...` | ... |

### Test Cases

#### Should Match
- `example1` -> [capture groups if any]
- `example2` -> [capture groups if any]

#### Should NOT Match
- `example1`
- `example2`

### Usage Examples

#### JavaScript
```javascript
const regex = /[pattern]/[flags];
const match = text.match(regex);
```

#### Python
```python
import re
pattern = r'[pattern]'
match = re.search(pattern, text)
```

### Notes
- [Any limitations or edge cases]
```

## Common Patterns Library

### Email Validation
```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```
**Explanation:**
- `^` - Start of string
- `[a-zA-Z0-9._%+-]+` - Local part (letters, digits, special chars)
- `@` - Literal @ symbol
- `[a-zA-Z0-9.-]+` - Domain name
- `\.` - Literal dot
- `[a-zA-Z]{2,}` - TLD (2+ letters)
- `$` - End of string

### URL Validation
```regex
^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$
```

### Phone Number (US)
```regex
^(\+1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$
```

### Date (YYYY-MM-DD)
```regex
^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$
```

### Strong Password
```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```
**Requirements:**
- At least 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one digit
- At least one special character

### IPv4 Address
```regex
^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$
```

### UUID
```regex
^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$
```

### Credit Card (Basic)
```regex
^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$
```

### Hex Color
```regex
^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$
```

### Slug (URL-friendly)
```regex
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

### HTML Tag
```regex
<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)
```

## Notes

- Different regex engines have different features
- Always escape special characters in user input
- Consider using named capture groups for readability
- Test with Unicode characters if applicable
- Avoid catastrophic backtracking (nested quantifiers)
- Use atomic groups or possessive quantifiers when available
- Consider regex compilation for repeated use
- Document complex patterns with verbose/extended mode
- Always validate regex with edge cases before production use
