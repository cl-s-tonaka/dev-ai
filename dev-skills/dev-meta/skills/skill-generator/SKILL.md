---
name: skill-generator
version: 1.0.0
description: Generate new skills based on research findings, following the standard SKILL.md format
tags:
  - meta
  - generation
  - skill-creation
  - automation
---

# Skill Generator

## Metadata

| Property | Value |
|----------|-------|
| Name | skill-generator |
| Version | 1.0.0 |
| Category | Meta |
| Complexity | High |

## Instructions

Generate production-ready skills in SKILL.md format based on research findings. Created skills should follow the established patterns, include comprehensive guidance, and integrate seamlessly with the existing plugin ecosystem.

### Generation Principles

1. **Consistency**: Follow established SKILL.md format and conventions
2. **Completeness**: Include all required sections and metadata
3. **Actionability**: Provide clear, actionable guidance
4. **Examples**: Include practical, realistic examples
5. **Checklists**: Add verification checklists for key processes

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| skill_name | string | Yes | Name of the skill to generate |
| research | object | Yes | Research findings from skill-research |
| category | string | Yes | Target category (architecture, testing, etc.) |
| tags | string[] | No | Tags for the skill |
| target_plugin | string | No | Plugin to add the skill to |

## Output Process

### Step 1: Validate Inputs

- [ ] Skill name follows naming conventions (lowercase, hyphenated)
- [ ] Research findings are comprehensive enough
- [ ] Category is valid (matches existing plugin categories)
- [ ] No duplicate skill name exists

**Naming Conventions:**

```
Good: api-design, test-strategy, code-review
Bad: APIDesign, test_strategy, CodeReview
```

### Step 2: Create SKILL.md Structure

**Required Sections:**

```markdown
---
name: [skill-name]
version: 1.0.0
description: [Brief description]
tags:
  - [tag1]
  - [tag2]
---

# [Skill Title]

## Metadata

| Property | Value |
|----------|-------|
| Name | [skill-name] |
| Version | 1.0.0 |
| Category | [Category] |
| Complexity | [Low/Medium/High] |

## Instructions

[Main guidance content]

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| [input1] | [type] | [Yes/No] | [description] |

## Output Process

### Step 1: [Step Name]
[Step content with checklists]

### Step 2: [Step Name]
[Step content with checklists]

## Output Format

[Expected output format with templates]

## Examples

### Input
[Example input]

### Output
[Example output]

## Notes

[Additional considerations]
```

### Step 3: Generate Content

**Content Generation Guidelines:**

1. **Instructions Section**
   - Start with a clear objective statement
   - List the main activities the skill covers
   - Explain the value provided

2. **Input Requirements**
   - List all inputs with types
   - Mark required vs optional
   - Provide clear descriptions

3. **Output Process**
   - Break down into logical steps
   - Include checklists with `- [ ]` format
   - Add tables for structured information
   - Include code examples where relevant

4. **Output Format**
   - Provide markdown templates
   - Show expected structure
   - Include placeholder text

5. **Examples**
   - Realistic, practical scenarios
   - Complete input/output pairs
   - Multiple examples for complex skills

### Step 4: Integrate Research

Transform research findings into skill content:

| Research Section | Skill Section |
|-----------------|---------------|
| Core Concepts | Instructions / Step 1 |
| Best Practices | Output Process steps |
| Patterns | Output Process / Examples |
| Anti-patterns | Notes / Checklists |
| Tools | Instructions / Notes |
| Examples | Examples section |

### Step 5: Quality Assurance

**Validation Checklist:**

- [ ] Frontmatter is complete and valid YAML
- [ ] Name matches directory name convention
- [ ] All required sections present
- [ ] Checklists use `- [ ]` format
- [ ] Tables are properly formatted
- [ ] Code blocks have language tags
- [ ] Examples are complete and realistic
- [ ] No broken links or references
- [ ] Complexity level is appropriate
- [ ] Tags are relevant and consistent

### Step 6: Generate Directory Structure

```
[target-plugin]/
└── skills/
    └── [skill-name]/
        └── SKILL.md
```

## Output Format

### Generated SKILL.md

```markdown
---
name: [skill-name]
version: 1.0.0
description: [Concise description under 100 characters]
tags:
  - [primary-tag]
  - [secondary-tag]
  - [domain-tag]
---

# [Skill Title in Title Case]

## Metadata

| Property | Value |
|----------|-------|
| Name | [skill-name] |
| Version | 1.0.0 |
| Category | [Category] |
| Complexity | [Low/Medium/High] |

## Instructions

[2-3 paragraphs explaining what this skill does, when to use it, and the value it provides]

### [Sub-section 1]

[Detailed guidance organized into logical subsections]

### [Sub-section 2]

[Additional guidance]

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| [input1] | string | Yes | [What this input is for] |
| [input2] | string | No | [Optional input description] |
| [input3] | object | No | [Complex input description] |

## Output Process

### Step 1: [Verb + Noun]

[Description of what happens in this step]

- [ ] [Checklist item 1]
- [ ] [Checklist item 2]
- [ ] [Checklist item 3]

**[Optional table or template]:**

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| [data] | [data] | [data] |

### Step 2: [Verb + Noun]

[Description of what happens in this step]

- [ ] [Checklist item 1]
- [ ] [Checklist item 2]

```[language]
[Code example if applicable]
```

### Step 3: [Verb + Noun]

[Final step and deliverables]

## Output Format

```markdown
# [Output Title]

## [Section 1]
[Template content with placeholders]

## [Section 2]
[Template content with placeholders]

## [Section 3]
[Template content with placeholders]
```

## Examples

### Example 1: [Scenario Name]

#### Input
```
[Realistic input example]
```

#### Output
```markdown
[Complete output example matching the output format]
```

### Example 2: [Alternative Scenario]

#### Input
```
[Different input scenario]
```

#### Output
```markdown
[Corresponding output]
```

## Notes

- [Important consideration 1]
- [Important consideration 2]
- [Common pitfall to avoid]
- [Integration tip with other skills]
- [Reference to related skills or resources]
```

### File Path Output

```
Created: [target-plugin]/skills/[skill-name]/SKILL.md
```

## Examples

### Input
```json
{
  "skill_name": "graphql-api-design",
  "category": "Architecture",
  "tags": ["graphql", "api", "schema-design"],
  "target_plugin": "dev-architecture",
  "research": {
    "core_concepts": ["SDL", "Type System", "Resolvers"],
    "best_practices": ["Schema-first design", "DataLoader usage"],
    "patterns": ["Connection pattern", "DataLoader pattern"],
    "anti_patterns": ["N+1 queries", "Over-fetching"]
  }
}
```

### Output
```markdown
---
name: graphql-api-design
version: 1.0.0
description: Design GraphQL APIs with proper schema structure, resolver patterns, and performance optimization
tags:
  - graphql
  - api
  - schema-design
  - performance
---

# GraphQL API Design

## Metadata

| Property | Value |
|----------|-------|
| Name | graphql-api-design |
| Version | 1.0.0 |
| Category | Architecture |
| Complexity | High |

## Instructions

Design production-ready GraphQL APIs following industry best practices. This skill covers schema design, resolver architecture, and performance optimization to create maintainable, performant GraphQL services.

### Schema Design Principles

GraphQL schemas should be designed client-first, focusing on the data needs of consumers rather than mirroring database structure. Use descriptive naming, embrace proper nullability, and leverage interfaces for polymorphic types.

### Resolver Architecture

Resolvers should be thin and delegate business logic to service layers. Implement DataLoader for efficient data fetching and use context for dependency injection.

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| requirements | string | Yes | API requirements and use cases |
| domain_model | object | No | Existing domain model or entities |
| constraints | string | No | Performance or security constraints |

## Output Process

### Step 1: Define Domain Types

- [ ] Identify main entities and their relationships
- [ ] Define scalar and custom types
- [ ] Establish connections between types
- [ ] Document type purposes

### Step 2: Design Schema

- [ ] Write types using SDL
- [ ] Define queries for data retrieval
- [ ] Define mutations for data modification
- [ ] Add input types for complex arguments
- [ ] Document with descriptions

```graphql
type User {
  """The unique identifier"""
  id: ID!
  """User's display name"""
  name: String!
  """User's email address"""
  email: String!
  """Posts authored by this user"""
  posts(first: Int, after: String): PostConnection!
}
```

### Step 3: Plan Resolvers

- [ ] Map resolvers to types and fields
- [ ] Identify N+1 query risks
- [ ] Design DataLoader usage
- [ ] Plan error handling strategy

### Step 4: Optimize Performance

- [ ] Implement query complexity analysis
- [ ] Add depth limiting
- [ ] Configure caching strategy
- [ ] Set up monitoring

## Output Format

```markdown
# GraphQL API Design: [API Name]

## Schema Overview
[High-level description]

## Types

### [Type Name]
```graphql
[Type definition]
```

## Queries
[Query definitions with descriptions]

## Mutations
[Mutation definitions with descriptions]

## Performance Considerations
[Optimization strategies]

## Implementation Notes
[Additional guidance]
```

## Examples

### Input
```
Design a GraphQL API for a blog platform with users, posts, and comments
```

### Output
```markdown
# GraphQL API Design: Blog Platform

## Schema Overview
A GraphQL API for a blog platform supporting user management, post creation, and commenting.

## Types

### User
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts(first: Int, after: String): PostConnection!
  createdAt: DateTime!
}
```

### Post
```graphql
type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments(first: Int, after: String): CommentConnection!
  publishedAt: DateTime
  status: PostStatus!
}
```

## Queries
```graphql
type Query {
  user(id: ID!): User
  posts(first: Int, after: String, status: PostStatus): PostConnection!
  post(id: ID!): Post
}
```

## Mutations
```graphql
type Mutation {
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
}
```

## Performance Considerations
- Use DataLoader for User.posts and Post.comments
- Implement cursor-based pagination for all connections
- Add query complexity limit of 100
- Cache frequently accessed posts
```

## Notes

- Generated skills should match the quality and depth of existing skills
- Include practical examples that demonstrate real-world usage
- Add checklists to make the skill actionable
- Cross-reference related skills in the Notes section
- Validate YAML frontmatter syntax before finalizing
- Consider both simple and complex use cases in examples
