---
name: dependency-analysis
description: "Analyze code dependencies for circular references, coupling issues, and optimization opportunities. Use when auditing architecture, planning modularization, or identifying dependency risks."
---

# Dependency Analysis

## Metadata
- **Name**: dependency-analysis
- **Description**: Analyze dependencies for circular references, coupling issues, optimization opportunities, and architectural health
- **Triggers**: dependency analysis, coupling, circular dependency, module dependencies, architecture review

## Instructions

You are a software architect analyzing dependencies for $ARGUMENTS.

Your task is to map dependencies, identify problematic patterns, assess coupling health, and provide architectural improvement recommendations.

## Input Requirements
- Code files, modules, or package structure
- Import/require statements or dependency configurations
- Package.json, requirements.txt, pom.xml, etc. (for external deps)
- Architecture diagrams (if available)
- Specific concerns or areas of focus (optional)

## Dependency Types

### 1. Internal Dependencies (Code Modules)
- Import/require between modules
- Class inheritance and composition
- Interface implementations
- Event subscriptions
- Shared state

### 2. External Dependencies (Packages)
- Third-party libraries
- Framework dependencies
- Runtime dependencies
- Development dependencies
- Peer dependencies

### 3. Infrastructure Dependencies
- Database connections
- External APIs
- Message queues
- File systems
- Configuration services

## Dependency Analysis Checklist

### Coupling Assessment

#### Afferent Coupling (Ca) - Incoming
Number of modules that depend on this module.
- **High Ca**: Core/shared module (be careful changing it)
- **Risk**: Changes have wide blast radius

#### Efferent Coupling (Ce) - Outgoing
Number of modules this module depends on.
- **High Ce**: Dependent on many things (fragile)
- **Risk**: Many reasons to change

#### Instability (I)
**Formula**: I = Ce / (Ca + Ce)
| Score | Interpretation |
|-------|---------------|
| 0 | Completely stable (only incoming deps) |
| 0.5 | Balanced |
| 1 | Completely unstable (only outgoing deps) |

**Rule**: Depend in direction of stability (unstable → stable)

#### Abstractness (A)
**Formula**: A = Abstract Classes / Total Classes
| Score | Interpretation |
|-------|---------------|
| 0 | Completely concrete |
| 1 | Completely abstract |

#### Distance from Main Sequence (D)
**Formula**: D = |A + I - 1|
| Score | Zone |
|-------|------|
| 0 | Ideal balance |
| Near 1 | Zone of Pain (concrete + stable) or Zone of Uselessness (abstract + unstable) |

### Dependency Problems

#### Circular Dependencies
**Symptoms:**
- A imports B, B imports A
- Longer cycles: A → B → C → A
- Module initialization failures

**Detection:**
- [ ] Build/import errors at runtime
- [ ] Unexpected undefined values
- [ ] Dependency graph has cycles

#### Inappropriate Dependencies
**Symptoms:**
- Higher layer imports lower layer
- Domain imports infrastructure
- Core imports plugins

**Detection:**
- [ ] Layer violations (UI → DB direct)
- [ ] Package boundary violations
- [ ] Stable modules importing unstable

#### Hidden Dependencies
**Symptoms:**
- Global state access
- Service locator patterns
- Environment variable access
- Singleton usage

**Detection:**
- [ ] Not visible in import statements
- [ ] Hard to test in isolation
- [ ] Behavior changes based on context

#### Over-coupling
**Symptoms:**
- God module everything depends on
- Excessive interface parameters
- Deep object graph navigation

**Detection:**
- [ ] Module with Ca > 10
- [ ] Changes cascade across system
- [ ] Can't deploy independently

### Dependency Patterns (Good)

#### Dependency Injection
- Dependencies passed via constructor
- Enables testing and flexibility
- Makes dependencies explicit

#### Interface Segregation
- Depend on small, focused interfaces
- Clients only see what they need
- Reduces coupling surface

#### Inversion of Control
- High-level defines interface
- Low-level implements interface
- Plug-in architecture

#### Layered Architecture
- Clear boundaries between layers
- Dependencies flow one direction
- Each layer has defined responsibility

## Output Format

```markdown
## Dependency Analysis: [Module/Package Name]

**Date**: [today]
**Language**: [language]
**Architecture Style**: [Layered/Modular/Microservices/Monolith]

### Executive Summary
[2-3 sentences on dependency health]

### Dependency Overview

#### Module Statistics
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Total Modules | [n] | - | - |
| Total Dependencies | [n] | - | - |
| Avg Afferent (Ca) | [n] | <5 | [status] |
| Avg Efferent (Ce) | [n] | <5 | [status] |
| Circular Dependencies | [n] | 0 | [status] |
| Max Dependency Depth | [n] | <5 | [status] |

#### External Dependencies
| Category | Count | Direct | Transitive |
|----------|-------|--------|------------|
| Production | [n] | [n] | [n] |
| Development | [n] | [n] | [n] |
| Total | [n] | [n] | [n] |

### Dependency Graph

\`\`\`
[ASCII or description of dependency structure]

UserService
├── UserRepository (internal)
├── EmailService (internal)
├── Logger (shared)
└── bcrypt (external)
\`\`\`

### Module Analysis

#### High Risk Modules (High Coupling)
| Module | Ca | Ce | Instability | Risk |
|--------|----|----|-------------|------|
| [name] | [n] | [n] | [0-1] | [risk] |

#### Core Modules (Many Dependents)
| Module | Dependents | Purpose |
|--------|------------|---------|
| [name] | [n] | [description] |

### Problems Found

#### Circular Dependencies
| Cycle | Modules Involved | Severity |
|-------|------------------|----------|
| 1 | A → B → A | Critical |
| 2 | A → B → C → A | High |

**Resolution Strategy:**
1. [Specific recommendation]
2. [Specific recommendation]

#### Layer Violations
| From | To | Expected | Violation |
|------|----|-----------| ----------|
| [layer] | [layer] | [direction] | [description] |

#### Hidden Dependencies
| Module | Hidden Dependency | Type |
|--------|-------------------|------|
| [name] | [dependency] | [global/singleton/env] |

### External Dependency Analysis

#### Dependency Health
| Package | Version | Latest | Age | Risk |
|---------|---------|--------|-----|------|
| [name] | [ver] | [ver] | [months] | [risk] |

#### Security Vulnerabilities
| Package | Severity | CVE | Action |
|---------|----------|-----|--------|

#### Unused Dependencies
| Package | Last Used | Action |
|---------|-----------|--------|
| [name] | [never/date] | Remove |

#### Duplicate Functionality
| Functionality | Packages | Recommendation |
|---------------|----------|----------------|
| [function] | [pkg1, pkg2] | Keep [pkg] |

### Architecture Conformance

#### Layer Dependencies (Expected)
\`\`\`
UI/API → Application → Domain → Infrastructure
         ↓
         Shared/Common
\`\`\`

#### Violations
| Source Layer | Target Layer | Count |
|--------------|--------------|-------|
| [layer] | [layer] | [n] |

### Recommendations

#### Immediate Actions
1. [Critical fix - e.g., break circular dependency]

#### Short-term Improvements
1. [Reduce coupling in module X]
2. [Update outdated dependencies]

#### Long-term Refactoring
1. [Architectural improvements]
2. [Modularization strategy]

### Dependency Reduction Strategies

**Strategy 1: Extract Shared Module**
\`\`\`
Before: A ↔ B (circular)
After:  A → Shared ← B
\`\`\`

**Strategy 2: Introduce Interface**
\`\`\`
Before: HighLevel → LowLevel
After:  HighLevel → Interface ← LowLevel
\`\`\`

**Strategy 3: Event-Based Decoupling**
\`\`\`
Before: A → B (direct call)
After:  A → EventBus ← B (subscriber)
\`\`\`
```

## Dependency Best Practices

### The Stable Dependencies Principle (SDP)
Depend in the direction of stability. Unstable packages should depend on stable ones.

### The Stable Abstractions Principle (SAP)
A package should be as abstract as it is stable. Stable packages should be abstract.

### The Acyclic Dependencies Principle (ADP)
Allow no cycles in the package dependency graph.

### The Common Closure Principle (CCP)
Classes that change together should be packaged together.

### The Common Reuse Principle (CRP)
Classes that are used together should be packaged together.

## Notes
- Circular dependencies are often a sign of missing abstraction
- High coupling is acceptable for core/shared modules
- External dependencies are liabilities — choose carefully
- Regular dependency audits prevent tech debt accumulation
- Use dependency injection for testability
- Consider the "fan-in" and "fan-out" of each module
- Automated tools can enforce dependency rules in CI/CD
