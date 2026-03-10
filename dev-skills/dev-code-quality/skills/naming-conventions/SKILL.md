---
name: naming-conventions
description: "Analyze and improve naming conventions for variables, functions, classes, and files. Use when reviewing code consistency, establishing coding standards, or improving code readability."
---

# Naming Conventions

## Metadata
- **Name**: naming-conventions
- **Description**: Check and suggest improvements for naming conventions, consistency, and clarity across codebases
- **Triggers**: naming conventions, variable names, function names, code consistency, naming standards

## Instructions

You are a code quality specialist reviewing naming conventions for $ARGUMENTS.

Your task is to evaluate naming consistency, clarity, and adherence to language-specific conventions, then provide specific improvement suggestions.

## Input Requirements
- Code files or snippets to analyze
- Programming language(s) used
- Project or team naming standards (if available)
- Framework conventions (if applicable)

## Naming Convention Standards by Language

### JavaScript/TypeScript
| Element | Convention | Examples |
|---------|------------|----------|
| Variables | camelCase | `userName`, `isActive`, `totalCount` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |
| Functions | camelCase (verb prefix) | `getUserById`, `calculateTotal`, `validateInput` |
| Classes | PascalCase | `UserService`, `PaymentProcessor` |
| Interfaces | PascalCase (I prefix optional) | `IUserRepository`, `Serializable` |
| Type Aliases | PascalCase | `UserId`, `ResponseData` |
| Enums | PascalCase (values SCREAMING_SNAKE) | `UserStatus.ACTIVE` |
| Files | kebab-case or PascalCase | `user-service.ts`, `UserService.ts` |
| React Components | PascalCase | `UserProfile`, `NavigationBar` |
| Hooks | camelCase with use prefix | `useAuth`, `useFetchData` |

### Python
| Element | Convention | Examples |
|---------|------------|----------|
| Variables | snake_case | `user_name`, `is_active`, `total_count` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |
| Functions | snake_case | `get_user_by_id`, `calculate_total` |
| Classes | PascalCase | `UserService`, `PaymentProcessor` |
| Modules | snake_case | `user_service.py`, `data_processor.py` |
| Packages | lowercase | `mypackage`, `utilities` |
| Private | _prefix | `_internal_method`, `_private_var` |
| Dunder | __prefix_suffix__ | `__init__`, `__str__` |

### Java/Kotlin
| Element | Convention | Examples |
|---------|------------|----------|
| Variables | camelCase | `userName`, `isActive` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES`, `DEFAULT_TIMEOUT` |
| Methods | camelCase | `getUserById`, `calculateTotal` |
| Classes | PascalCase | `UserService`, `PaymentProcessor` |
| Interfaces | PascalCase | `Serializable`, `UserRepository` |
| Packages | lowercase.dotted | `com.company.service` |
| Generics | Single uppercase | `T`, `E`, `K`, `V` |

### Go
| Element | Convention | Examples |
|---------|------------|----------|
| Variables | camelCase | `userName`, `isActive` |
| Exported | PascalCase | `UserName`, `GetUserById` |
| Unexported | camelCase | `internalHelper`, `privateData` |
| Constants | PascalCase or camelCase | `MaxRetries`, `defaultTimeout` |
| Packages | lowercase | `userservice`, `httputil` |
| Interfaces | -er suffix | `Reader`, `Writer`, `Formatter` |
| Acronyms | All caps | `HTTPClient`, `XMLParser`, `userID` |

### C#
| Element | Convention | Examples |
|---------|------------|----------|
| Variables | camelCase | `userName`, `isActive` |
| Private fields | _camelCase | `_userName`, `_isActive` |
| Constants | PascalCase | `MaxRetries`, `DefaultTimeout` |
| Methods | PascalCase | `GetUserById`, `CalculateTotal` |
| Classes | PascalCase | `UserService`, `PaymentProcessor` |
| Interfaces | IPascalCase | `IUserRepository`, `ISerializable` |
| Properties | PascalCase | `FirstName`, `IsEnabled` |

## Naming Quality Checklist

### Clarity
- [ ] Name reveals intent — `daysSinceLastLogin` not `d`
- [ ] No ambiguous abbreviations — `customerId` not `cid`
- [ ] Pronounceable — `generationTimestamp` not `genymdhms`
- [ ] Searchable — avoid single letters except loop counters
- [ ] No misleading names — don't use `list` if it's not a list

### Consistency
- [ ] Same concept, same name — don't mix `fetch`, `get`, `retrieve`
- [ ] Symmetric pairs — `open/close`, `start/stop`, `begin/end`
- [ ] Consistent prefixes — `is`, `has`, `can`, `should` for booleans
- [ ] Consistent suffixes — `-Service`, `-Repository`, `-Controller`

### Specificity
- [ ] Avoid generic names — not `data`, `info`, `manager`, `processor`
- [ ] Domain vocabulary — use ubiquitous language
- [ ] Scope-appropriate length — longer names for larger scopes
- [ ] No noise words — `productData` vs `product`, `theCustomer` vs `customer`

### Boolean Naming
- [ ] Positive form — `isEnabled` not `isNotDisabled`
- [ ] Appropriate prefix — `is`, `has`, `can`, `should`, `will`
- [ ] Question form — reads like a yes/no question

### Function/Method Naming
- [ ] Verb or verb phrase — `calculateTotal`, `sendNotification`
- [ ] Describes side effects — `saveAndNotify`, not just `save`
- [ ] Accessors/Mutators — `getName`/`setName`, `isActive`/`setActive`
- [ ] Factory methods — `createUser`, `fromJson`, `valueOf`

### Collection Naming
- [ ] Plural nouns — `users`, `orderItems`, `products`
- [ ] Or collective nouns — `userList`, `orderCollection`
- [ ] Map naming — `userById`, `productsByCategory`

## Output Format

```markdown
## Naming Convention Analysis: [File/Module Name]

**Date**: [today]
**Language**: [language]
**Overall Consistency**: [%]

### Summary
[2-3 sentence overview of naming quality]

### Convention Compliance
| Category | Compliance | Issues |
|----------|------------|--------|
| Variables | [%] | [count] |
| Functions/Methods | [%] | [count] |
| Classes/Types | [%] | [count] |
| Constants | [%] | [count] |
| Files/Modules | [%] | [count] |

### Issues Found

#### Clarity Issues
| Current Name | Problem | Suggested Name | Location |
|--------------|---------|----------------|----------|

#### Consistency Issues
| Pattern A | Pattern B | Recommendation |
|-----------|-----------|----------------|

#### Convention Violations
| Name | Expected | Actual | Location |
|------|----------|--------|----------|

### Good Naming Practices Observed
- [Positive examples from the codebase]

### Naming Glossary
| Term | Preferred Name | Avoid |
|------|---------------|-------|
| [concept] | [use this] | [not this] |

### Recommendations
1. [Specific, prioritized actions]

### Automated Fix Suggestions
\`\`\`[language]
// Rename suggestions for IDE/tooling
[list of renames]
\`\`\`
```

## Common Anti-Patterns

### Meaningless Names
- `temp`, `data`, `info`, `value`, `item`
- Single letters: `x`, `y`, `z` (except loop counters)
- Numbered names: `user1`, `user2`, `result2`

### Misleading Names
- `userList` when it's a Set
- `accountNum` when it's a String
- `calculateTotal` when it also saves to database

### Inconsistent Patterns
- Mixing `fetch`/`get`/`retrieve` for same concept
- `getUserById` vs `findUserByEmail` vs `loadUserByName`
- `isActive` vs `hasEnabled` vs `active`

### Encoded Names
- Hungarian notation: `strName`, `intCount`
- Type prefixes: `sName`, `iCount`
- Member prefixes: `m_name`, `_name` (language-dependent)

## Notes
- Follow language and framework conventions first
- Project consistency trumps personal preference
- When joining a project, adopt existing conventions
- Use IDE/linter tools to enforce conventions automatically
- Good names reduce need for comments
- Rename without fear — IDEs make it safe
- Consider domain-driven design vocabulary
