---
name: skill-research
version: 1.0.0
description: Research and gather information for domains not covered by existing skills
tags:
  - meta
  - research
  - information-gathering
  - best-practices
---

# Skill Research

## Metadata

| Property | Value |
|----------|-------|
| Name | skill-research |
| Version | 1.0.0 |
| Category | Meta |
| Complexity | Medium |

## Instructions

Conduct comprehensive research on domains identified as gaps in the skill ecosystem. Gather best practices, methodologies, patterns, and relevant information to enable the creation of new skills.

### Research Objectives

1. **Domain Understanding**: Build comprehensive knowledge of the target domain
2. **Best Practices**: Identify industry-accepted best practices and standards
3. **Patterns & Anti-patterns**: Document common patterns and pitfalls to avoid
4. **Tools & Technologies**: Survey relevant tools, frameworks, and technologies
5. **Structured Output**: Organize findings for skill generation

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| topic | string | Yes | The domain or topic to research |
| context | string | No | Specific context or focus areas |
| depth | string | No | Research depth: quick, standard, comprehensive |
| existing_knowledge | object | No | Related existing skills for context |

## Output Process

### Step 1: Define Research Scope

- [ ] Clarify the target domain boundaries
- [ ] Identify key concepts and terminology
- [ ] List specific questions to answer
- [ ] Determine required depth of coverage

**Scope Template:**

```markdown
### Research Scope

**Domain**: [Main topic]
**Sub-domains**:
- [Sub-domain 1]
- [Sub-domain 2]

**Key Questions**:
1. What are the fundamental concepts?
2. What are the best practices?
3. What patterns should be used?
4. What are common mistakes to avoid?
5. What tools/frameworks are commonly used?
```

### Step 2: Gather Information

**Research Sources:**

| Source Type | Examples | Use For |
|-------------|----------|---------|
| Official Docs | MDN, Official specs | Authoritative definitions |
| Best Practice Guides | Google Style Guides, Airbnb guides | Industry standards |
| Technical Blogs | Engineering blogs from major companies | Real-world insights |
| Academic Papers | IEEE, ACM | Theoretical foundations |
| Community Knowledge | Stack Overflow trends, GitHub discussions | Common issues and solutions |

**Information Categories:**

1. **Fundamentals**
   - Core concepts and definitions
   - Key terminology
   - Historical context (if relevant)

2. **Best Practices**
   - Industry standards
   - Recommended approaches
   - Quality criteria

3. **Patterns**
   - Design patterns specific to the domain
   - Implementation patterns
   - Integration patterns

4. **Anti-patterns**
   - Common mistakes
   - Performance pitfalls
   - Security concerns

5. **Tooling**
   - Popular tools and frameworks
   - Comparison of alternatives
   - Ecosystem overview

### Step 3: Validate and Verify

- [ ] Cross-reference multiple sources
- [ ] Check for recency (prefer recent information)
- [ ] Verify against official documentation
- [ ] Note any conflicting recommendations
- [ ] Identify consensus vs. debated topics

### Step 4: Synthesize Findings

Organize information into a structured format suitable for skill generation:

```markdown
## Research Synthesis

### Domain Overview
[High-level description of the domain]

### Core Concepts
| Concept | Definition | Importance |
|---------|------------|------------|
| [Concept 1] | [Definition] | [High/Medium/Low] |

### Best Practices
1. **[Practice Name]**
   - Description: [what to do]
   - Rationale: [why it matters]
   - Example: [brief example]

### Design Patterns
1. **[Pattern Name]**
   - Problem: [what problem it solves]
   - Solution: [how it solves it]
   - When to use: [applicable scenarios]

### Anti-patterns
1. **[Anti-pattern Name]**
   - Description: [what not to do]
   - Why it's bad: [consequences]
   - Alternative: [what to do instead]

### Tools & Technologies
| Tool | Purpose | Pros | Cons |
|------|---------|------|------|
| [Tool 1] | [Purpose] | [Pros] | [Cons] |

### Implementation Guidelines
1. [Guideline 1]
2. [Guideline 2]

### Common Pitfalls
- [Pitfall 1]: [how to avoid]
- [Pitfall 2]: [how to avoid]

### References
- [Source 1]: [URL or description]
- [Source 2]: [URL or description]
```

### Step 5: Prepare for Skill Generation

Create a skill specification draft:

```markdown
## Skill Specification

### Recommended Skill Name
[skill-name]

### Category
[Architecture/Testing/DevOps/etc.]

### Tags
- [tag1]
- [tag2]

### Key Sections for Skill
1. **Instructions**: [Main guidance content]
2. **Input Requirements**: [What the skill needs]
3. **Output Format**: [Expected deliverables]
4. **Checklist Items**: [Key verification points]

### Content Outline
1. [Section 1]
   - [Subsection 1.1]
   - [Subsection 1.2]
2. [Section 2]
   - [Subsection 2.1]

### Example Scenarios
1. [Scenario 1]: [How skill would help]
2. [Scenario 2]: [How skill would help]
```

## Output Format

```markdown
# Skill Research Report: [Topic]

## Executive Summary
[Brief overview of findings and recommendations]

## Research Scope
**Domain**: [Main topic]
**Depth**: [quick/standard/comprehensive]
**Focus Areas**:
- [Area 1]
- [Area 2]

## Domain Overview
[Comprehensive description of the domain]

## Core Concepts

### [Concept 1]
**Definition**: [definition]
**Key Points**:
- [point 1]
- [point 2]

### [Concept 2]
...

## Best Practices

### [Practice Category 1]

1. **[Practice Name]**
   - **Do**: [recommendation]
   - **Don't**: [anti-pattern]
   - **Example**:
   ```[language]
   [code example]
   ```

## Design Patterns

### [Pattern 1]
- **Intent**: [what it achieves]
- **Applicability**: [when to use]
- **Structure**: [how it works]
- **Example**: [implementation example]

## Anti-patterns & Pitfalls

### [Anti-pattern 1]
- **Problem**: [description]
- **Symptoms**: [how to recognize]
- **Solution**: [how to fix]

## Tools & Ecosystem
[Overview of relevant tools, frameworks, libraries]

## Skill Generation Ready
- [ ] Core concepts documented
- [ ] Best practices identified
- [ ] Patterns catalogued
- [ ] Anti-patterns listed
- [ ] Examples prepared
- [ ] Checklists drafted

## Skill Specification Draft
[Prepared specification for skill-generator]

## References
1. [Reference 1]
2. [Reference 2]
```

## Examples

### Input
```
topic: "GraphQL API Design"
context: "Focus on schema design and performance"
depth: "standard"
```

### Output
```markdown
# Skill Research Report: GraphQL API Design

## Executive Summary
GraphQL provides a flexible query language for APIs. This research covers schema design principles, resolver patterns, and performance optimization strategies. Key findings indicate that schema-first design, proper use of DataLoader for batching, and query complexity analysis are essential for production-ready GraphQL APIs.

## Research Scope
**Domain**: GraphQL API Design
**Depth**: standard
**Focus Areas**:
- Schema design principles
- Resolver architecture
- Performance optimization
- Security considerations

## Domain Overview
GraphQL is a query language for APIs that provides a complete description of the data in your API, gives clients the power to ask for exactly what they need, and makes it easier to evolve APIs over time. Unlike REST, GraphQL APIs are organized in terms of types and fields, not endpoints.

## Core Concepts

### Schema Definition Language (SDL)
**Definition**: A syntax for defining GraphQL schemas
**Key Points**:
- Types define the shape of data
- Fields represent properties on types
- Resolvers fetch data for each field

### Type System
**Definition**: GraphQL's type system for defining data structures
**Key Points**:
- Scalar types: Int, Float, String, Boolean, ID
- Object types: Custom data structures
- Input types: Arguments for mutations
- Interfaces and Unions: Polymorphic types

## Best Practices

### Schema Design

1. **Design Schema First**
   - **Do**: Start with SDL to define your API contract
   - **Don't**: Let database schema dictate API schema
   - **Example**:
   ```graphql
   type User {
     id: ID!
     name: String!
     email: String!
     posts: [Post!]!
   }
   ```

2. **Use Meaningful Naming**
   - **Do**: Use descriptive, domain-specific names
   - **Don't**: Use generic names like "getData" or "item"

3. **Embrace Nullability**
   - **Do**: Make fields non-null (!) when they're guaranteed
   - **Don't**: Make everything nullable by default

### Performance

1. **Implement DataLoader**
   - **Do**: Use batching to avoid N+1 queries
   - **Don't**: Make separate database calls per item

2. **Add Query Complexity Limits**
   - **Do**: Implement query cost analysis
   - **Don't**: Allow unbounded queries

## Design Patterns

### Connection Pattern (Relay-style Pagination)
- **Intent**: Standardized pagination with cursor-based navigation
- **Applicability**: Lists that need efficient pagination
- **Structure**: Edges with nodes and cursors, pageInfo
- **Example**:
```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}
type UserEdge {
  node: User!
  cursor: String!
}
```

### DataLoader Pattern
- **Intent**: Batch and cache database requests
- **Applicability**: Resolving related entities
- **Structure**: Batched loading function with caching

## Anti-patterns & Pitfalls

### N+1 Query Problem
- **Problem**: Executing one query per item in a list
- **Symptoms**: Slow performance, database overload
- **Solution**: Implement DataLoader for batching

### Overly Complex Queries
- **Problem**: Allowing deeply nested queries without limits
- **Symptoms**: Server crashes, timeouts
- **Solution**: Implement query depth and complexity limits

## Tools & Ecosystem
| Tool | Purpose | Recommendation |
|------|---------|----------------|
| Apollo Server | GraphQL server | Production-ready, feature-rich |
| GraphQL Yoga | GraphQL server | Lightweight, flexible |
| Prisma | Database toolkit | Great for GraphQL backends |
| DataLoader | Batching utility | Essential for performance |

## Skill Generation Ready
- [x] Core concepts documented
- [x] Best practices identified
- [x] Patterns catalogued
- [x] Anti-patterns listed
- [x] Examples prepared
- [x] Checklists drafted

## Skill Specification Draft

### Recommended Skill Name
graphql-api-design

### Category
Architecture

### Tags
- graphql
- api
- schema-design
- performance

### Key Sections for Skill
1. **Instructions**: Schema design, resolver patterns, performance
2. **Input Requirements**: API requirements, domain model
3. **Output Format**: Schema SDL, resolver examples, checklist

## References
1. GraphQL Official Documentation: https://graphql.org/learn/
2. Apollo Best Practices: https://www.apollographql.com/docs/
3. GraphQL Spec: https://spec.graphql.org/
```

## Notes

- Use web search when current knowledge is insufficient
- Prioritize official documentation and authoritative sources
- Cross-reference multiple sources for best practices
- Note any version-specific information (e.g., "as of v2.0")
- Include practical code examples where applicable
- Focus on actionable guidance that can be turned into a skill
