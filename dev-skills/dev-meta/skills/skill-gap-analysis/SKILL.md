---
name: skill-gap-analysis
version: 1.0.0
description: Analyze user requests to detect gaps in the current skill set and determine if new skills are needed
tags:
  - meta
  - analysis
  - gap-detection
  - skill-management
---

# Skill Gap Analysis

## Metadata

| Property | Value |
|----------|-------|
| Name | skill-gap-analysis |
| Version | 1.0.0 |
| Category | Meta |
| Complexity | Medium |

## Instructions

Analyze user requests against the available skill set to determine coverage. Identify gaps where existing skills cannot adequately address the user's needs, and recommend whether to use existing skills or create new ones.

### Analysis Process

1. **Request Understanding**: Parse and understand the user's request
2. **Skill Inventory**: Review all available skills across plugins
3. **Coverage Assessment**: Determine how well existing skills cover the request
4. **Gap Identification**: Identify specific areas not covered
5. **Recommendation**: Suggest existing skills or flag for new skill creation

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| request | string | Yes | The user's request or task description |
| context | string | No | Additional context about the domain or project |
| skill_inventory | object | No | List of available skills (auto-populated) |

## Output Process

### Step 1: Parse Request

- [ ] Extract key topics and domains from the request
- [ ] Identify required capabilities (analysis, generation, review, etc.)
- [ ] Note any specific technologies, frameworks, or methodologies mentioned
- [ ] Determine the complexity level (simple, moderate, complex)

### Step 2: Inventory Available Skills

**Skill Categories to Check:**

| Category | Plugin | Example Skills |
|----------|--------|----------------|
| Development | dev-toolkit | code-generation, git-workflow, sql-query-builder |
| Quality | dev-code-quality | code-review, refactoring-plan, clean-code-check |
| Testing | dev-testing | test-strategy, unit-test-design, tdd-guide |
| Architecture | dev-architecture | system-design, api-design, microservices-design |
| Debugging | dev-debugging | root-cause-analysis, log-analysis, performance-profiling |
| Documentation | dev-documentation | readme-generator, api-documentation, technical-spec |
| DevOps | dev-devops | ci-pipeline-design, kubernetes-manifest, deployment-strategy |
| Security | dev-security | security-review, threat-modeling, dependency-audit |

### Step 3: Assess Coverage

**Coverage Levels:**

| Level | Score | Description |
|-------|-------|-------------|
| Full | 90-100% | Existing skills fully cover the request |
| Partial | 50-89% | Some gaps exist but core needs are met |
| Minimal | 20-49% | Significant gaps; existing skills provide limited help |
| None | 0-19% | No relevant skills available |

**Assessment Criteria:**

- [ ] Domain knowledge coverage
- [ ] Methodology/process coverage
- [ ] Technology-specific coverage
- [ ] Output format compatibility
- [ ] Depth of guidance provided

### Step 4: Identify Specific Gaps

For each identified gap, document:

```markdown
### Gap: [Gap Name]

**Domain**: [e.g., GraphQL, Machine Learning, etc.]
**Missing Capabilities**:
- [Capability 1]
- [Capability 2]

**Nearest Existing Skill**: [skill-name]
**Why It's Insufficient**: [explanation]

**Recommended Action**:
- [ ] Create new skill
- [ ] Extend existing skill
- [ ] Combine multiple skills
```

### Step 5: Generate Recommendation

**Decision Matrix:**

| Coverage | Complexity | Recommendation |
|----------|------------|----------------|
| Full | Any | Use existing skills |
| Partial | Low | Combine existing skills with ad-hoc guidance |
| Partial | High | Consider new skill creation |
| Minimal/None | Any | Create new skill |

## Output Format

```markdown
# Skill Gap Analysis Report

## Request Summary
[Brief description of the user's request]

## Key Topics Identified
- Topic 1: [description]
- Topic 2: [description]

## Coverage Assessment

### Overall Coverage: [X]% ([Level])

### Matching Skills Found
| Skill | Plugin | Relevance | Notes |
|-------|--------|-----------|-------|
| [name] | [plugin] | [High/Medium/Low] | [notes] |

### Gaps Identified
1. **[Gap Name]**
   - Domain: [domain]
   - Missing: [what's missing]
   - Impact: [High/Medium/Low]

## Recommendation

**Action**: [Use Existing / Create New Skill / Hybrid Approach]

### If Using Existing Skills:
- Primary: [skill-name] - [how to use]
- Supporting: [skill-name] - [how to use]

### If Creating New Skill:
- Suggested Name: [name]
- Category: [category]
- Key Topics to Cover:
  - [topic 1]
  - [topic 2]
- Proceed to: skill-research → skill-generator

## Next Steps
1. [Step 1]
2. [Step 2]
```

## Examples

### Input
```
"I need help designing a GraphQL API with proper schema design, resolver patterns, and performance optimization"
```

### Output
```markdown
# Skill Gap Analysis Report

## Request Summary
Design guidance for GraphQL API including schema design, resolver patterns, and performance optimization.

## Key Topics Identified
- Topic 1: GraphQL schema design principles
- Topic 2: Resolver implementation patterns
- Topic 3: GraphQL performance optimization (N+1 problem, caching, batching)

## Coverage Assessment

### Overall Coverage: 35% (Minimal)

### Matching Skills Found
| Skill | Plugin | Relevance | Notes |
|-------|--------|-----------|-------|
| api-design | dev-architecture | Medium | Covers REST API design, not GraphQL-specific |
| system-design | dev-architecture | Low | General system design, no GraphQL focus |
| performance-profiling | dev-debugging | Low | General profiling, not GraphQL-specific |

### Gaps Identified
1. **GraphQL Schema Design**
   - Domain: API Design / GraphQL
   - Missing: Type system design, schema-first vs code-first, federation patterns
   - Impact: High

2. **Resolver Patterns**
   - Domain: API Implementation
   - Missing: DataLoader pattern, context design, error handling in resolvers
   - Impact: High

3. **GraphQL Performance**
   - Domain: Performance Optimization
   - Missing: N+1 problem solutions, query complexity analysis, caching strategies
   - Impact: Medium

## Recommendation

**Action**: Create New Skill

### New Skill Details:
- Suggested Name: graphql-api-design
- Category: Architecture
- Key Topics to Cover:
  - Schema design principles (types, interfaces, unions)
  - Resolver architecture and patterns
  - DataLoader and batching
  - Performance optimization strategies
  - Security considerations
- Proceed to: skill-research → skill-generator

## Next Steps
1. Run skill-research to gather GraphQL best practices
2. Generate new skill using skill-generator
3. Review and refine the generated skill
4. Add to dev-architecture plugin
```

## Notes

- Always check all available plugins before declaring a gap
- Consider skill combinations that might address the request
- Factor in the effort required to create new skills vs adapting existing ones
- Document the analysis process for transparency
- Keep the assessment objective and evidence-based
