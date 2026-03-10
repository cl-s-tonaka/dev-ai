---
description: Complete documentation workflow - generate README, API documentation, and technical specification in sequence
argument-hint: "<project or codebase path>"
---

# /docs -- Documentation Generation Workflow

Generate comprehensive project documentation in a structured workflow: README, API documentation, and technical specification.

## Invocation

```
/docs ./my-project
/docs Create documentation for our user authentication service
/docs [upload codebase or existing documentation]
```

## Workflow

### Step 1: Understand the Project

Accept the input in any form:
- A project directory path
- A project description
- Existing documentation to enhance
- Source code files

Analyze the project to understand:
- Project type (library, API, web app, CLI, etc.)
- Technology stack
- Main features and capabilities
- Target audience

### Step 2: Gather Context

Ask conversationally to fill gaps:

1. **Project purpose**: What problem does this project solve?
2. **Target users**: Who will use this? Developers, end-users, operators?
3. **Key features**: What are the main capabilities?
4. **Installation method**: npm, pip, Docker, binary?
5. **API endpoints**: Are there APIs that need documentation?
6. **Existing docs**: Any documentation to incorporate or update?

If code or documentation is provided, extract what's available and only ask about gaps.

### Step 3: Generate README

Apply the **readme-generator** skill to create:

```markdown
# Project Name

Brief description and badges

## Features
- Key feature list

## Installation
Step-by-step setup

## Quick Start
Minimal working example

## Usage
Common use cases with examples

## Configuration
Available options

## Contributing
How to contribute

## License
License information
```

### Step 4: Generate API Documentation (if applicable)

If the project has an API, apply the **api-documentation** skill to create:

```yaml
openapi: 3.0.3
info:
  title: API Name
  version: 1.0.0

paths:
  /endpoint:
    get:
      summary: Description
      # Full OpenAPI spec...
```

Include:
- All endpoints with methods
- Request/response schemas
- Authentication details
- Error codes
- Code examples in multiple languages

### Step 5: Generate Technical Specification

Apply the **technical-spec** skill to create:

```markdown
# Technical Specification: Project Name

## Overview
High-level summary

## Architecture
System design with diagrams

## Data Model
Schema definitions

## Key Decisions
ADRs for important choices

## Security Considerations
Threat model and mitigations
```

### Step 6: Review and Organize

After generating all documents, organize them:

```
docs/
├── README.md              # Project overview
├── api/
│   ├── openapi.yaml      # OpenAPI specification
│   └── reference.md      # API reference guide
├── technical/
│   ├── architecture.md   # Technical specification
│   └── decisions/        # Architecture Decision Records
└── contributing/
    └── CONTRIBUTING.md   # Contribution guidelines
```

### Step 7: Offer Next Steps

After generating, offer:
- "Want me to **add a changelog**? I can create CHANGELOG.md from git history."
- "Should I **create a runbook** for operations?"
- "Want me to **generate an onboarding guide** for new developers?"
- "Should I **add code comments** to key files?"

Save all documentation files to the project workspace.

## Output Files

| File | Description |
|------|-------------|
| `README.md` | Project overview and quick start |
| `docs/api/openapi.yaml` | API specification (if applicable) |
| `docs/technical/architecture.md` | Technical specification |
| `CONTRIBUTING.md` | Contribution guidelines |

## Notes

- Always analyze existing documentation before generating new content
- Preserve any existing content that's still accurate
- Use consistent terminology throughout all documents
- Link between documents where appropriate
- Include diagrams for complex systems
- Make documentation searchable and scannable
- Consider generating a docs site with tools like Docusaurus or MkDocs
- API documentation should be machine-readable (OpenAPI) and human-readable
- Technical specs should explain "why" not just "what"
