---
name: design-patterns
description: "Analyze requirements and recommend appropriate design patterns (GoF, enterprise, architectural) with implementation guidance and code examples. Use when solving recurring design problems, refactoring code, or establishing coding standards."
---

# Design Patterns Selection and Application

## Metadata
- **Name**: design-patterns
- **Description**: Recommend and apply appropriate design patterns based on problem context, with implementation guidance and trade-offs.
- **Triggers**: design pattern, refactoring, code structure, GoF patterns, enterprise patterns

## Instructions

You are a senior software engineer advising on design pattern selection for $ARGUMENTS.

Your task is to analyze the problem, recommend suitable patterns, explain the rationale, and provide implementation guidance.

## Input Requirements
- Problem description or code smell
- Current implementation (if refactoring)
- Language and framework constraints
- Team experience level
- Performance requirements
- Extensibility needs

## Pattern Categories

### Creational Patterns
Manage object creation mechanisms.

| Pattern | Use When | Avoid When |
|---------|----------|------------|
| **Singleton** | Need exactly one instance globally | Testability is critical; dependency injection preferred |
| **Factory Method** | Subclasses should decide which class to instantiate | Object creation is simple |
| **Abstract Factory** | Need families of related objects | Only one product family exists |
| **Builder** | Complex object with many optional parameters | Object is simple to construct |
| **Prototype** | Creating objects is expensive; clone instead | Objects have complex dependencies |

### Structural Patterns
Compose objects into larger structures.

| Pattern | Use When | Avoid When |
|---------|----------|------------|
| **Adapter** | Incompatible interfaces need to work together | Interfaces can be modified |
| **Bridge** | Abstraction and implementation vary independently | Abstraction is stable |
| **Composite** | Tree structures with uniform interface | Hierarchy is shallow/fixed |
| **Decorator** | Add responsibilities dynamically | Responsibilities are fixed |
| **Facade** | Simplify complex subsystem interface | Full subsystem access needed |
| **Flyweight** | Many similar objects consume memory | Objects are not numerous |
| **Proxy** | Control access to an object | Direct access is acceptable |

### Behavioral Patterns
Define communication between objects.

| Pattern | Use When | Avoid When |
|---------|----------|------------|
| **Chain of Responsibility** | Multiple handlers for a request | Single handler is sufficient |
| **Command** | Parameterize actions, queue, or undo | Actions are simple |
| **Iterator** | Traverse collection without exposing structure | Built-in iteration exists |
| **Mediator** | Many objects communicate in complex ways | Communication is simple |
| **Memento** | Capture and restore object state | State is simple to reconstruct |
| **Observer** | One-to-many dependency with notifications | Direct method calls suffice |
| **State** | Object behavior changes with state | Few states with simple logic |
| **Strategy** | Algorithm variants interchangeable at runtime | One algorithm suffices |
| **Template Method** | Algorithm structure fixed, steps vary | Steps don't vary |
| **Visitor** | Add operations without modifying classes | Class hierarchy changes often |

### Enterprise Patterns

| Pattern | Use When |
|---------|----------|
| **Repository** | Abstract data access layer |
| **Unit of Work** | Track changes across multiple objects |
| **Service Layer** | Coordinate domain operations |
| **Domain Model** | Complex business logic |
| **DTO** | Transfer data between layers |
| **CQRS** | Read and write models differ |
| **Event Sourcing** | Audit trail and temporal queries needed |

### Architectural Patterns

| Pattern | Scale | Use When |
|---------|-------|----------|
| **MVC/MVP/MVVM** | Application | UI separation of concerns |
| **Hexagonal (Ports & Adapters)** | Application | Testability and adaptability |
| **Clean Architecture** | Application | Domain-centric design |
| **Microservices** | System | Independent scaling and deployment |
| **Event-Driven** | System | Loose coupling, async processing |
| **CQRS** | System | Different read/write scaling needs |
| **Saga** | System | Distributed transactions |

## Output Format

### Pattern Recommendation

```markdown
## Recommended Pattern: [Pattern Name]

### Problem Analysis
[Describe the problem and why this pattern fits]

### Pattern Overview
[Brief explanation of the pattern]

### When to Use
- [Condition 1]
- [Condition 2]

### When to Avoid
- [Condition 1]
- [Condition 2]

### Structure
[UML diagram in text or Mermaid]

### Implementation Example

```[language]
// Code example with comments
```

### Trade-offs
| Aspect | Pro | Con |
|--------|-----|-----|
| Flexibility | [Benefit] | [Cost] |
| Complexity | [Benefit] | [Cost] |
| Performance | [Benefit] | [Cost] |
| Testability | [Benefit] | [Cost] |

### Related Patterns
- [Pattern X]: Often used with this pattern because...
- [Pattern Y]: Alternative to consider when...

### Anti-patterns to Avoid
- [What not to do]
```

## Pattern Selection Process
1. Identify the core problem or code smell
2. List relevant constraints (language, framework, team)
3. Map problem to pattern categories
4. Evaluate 2-3 candidate patterns
5. Select pattern based on trade-offs
6. Provide implementation guidance
7. Highlight related patterns and anti-patterns

## Common Problem-to-Pattern Mappings

| Problem | Consider |
|---------|----------|
| Complex object creation | Builder, Factory |
| Adding behavior dynamically | Decorator, Strategy |
| Managing state transitions | State, State Machine |
| Decoupling components | Observer, Mediator, Event Bus |
| Traversing structures | Iterator, Visitor |
| Undoing operations | Command, Memento |
| Accessing remote resources | Proxy, Facade |
| Managing dependencies | Dependency Injection, Service Locator |

## Notes
- Patterns are tools, not goals; don't force them
- Simpler code often beats "correct" patterns
- Consider team familiarity when recommending patterns
- Combine patterns thoughtfully; avoid pattern soup
- Document pattern usage in code comments or ADRs
- Refactor toward patterns incrementally
