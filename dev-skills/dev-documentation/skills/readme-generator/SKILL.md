---
name: readme-generator
version: 1.0.0
description: Generate comprehensive README.md files with installation instructions, usage examples, API references, and contribution guidelines
tags:
  - documentation
  - readme
  - markdown
  - project-setup
  - developer-experience
---

# README Generator

## Metadata

| Property | Value |
|----------|-------|
| Name | readme-generator |
| Version | 1.0.0 |
| Category | Documentation |
| Complexity | Medium |

## Instructions

Generate comprehensive, well-structured README.md files that serve as the primary entry point for understanding and using a project. The README should be clear, scannable, and provide all essential information for users and contributors.

### README Structure Best Practices

1. **Title & Badges** - Project name with status badges
2. **Description** - Clear, concise project summary
3. **Table of Contents** - For longer READMEs
4. **Installation** - Step-by-step setup instructions
5. **Usage** - Quick start and common examples
6. **API Reference** - Key methods and configuration
7. **Contributing** - How to contribute
8. **License** - Legal information

### Badge Types

```markdown
<!-- Build Status -->
![Build Status](https://img.shields.io/github/actions/workflow/status/owner/repo/ci.yml)

<!-- Version -->
![npm version](https://img.shields.io/npm/v/package-name)
![PyPI version](https://img.shields.io/pypi/v/package-name)

<!-- License -->
![License](https://img.shields.io/github/license/owner/repo)

<!-- Downloads -->
![Downloads](https://img.shields.io/npm/dm/package-name)

<!-- Code Coverage -->
![Coverage](https://img.shields.io/codecov/c/github/owner/repo)
```

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| project_name | string | Yes | Name of the project |
| project_type | string | Yes | Type (library, CLI, web-app, API, etc.) |
| language | string | Yes | Primary programming language |
| description | string | Yes | Brief project description |
| installation_method | string | No | Package manager or installation approach |
| features | array | No | List of key features |
| existing_docs | file | No | Existing documentation to incorporate |

## Output Process

### Step 1: Analyze Project

- [ ] Identify project type and primary use case
- [ ] Determine target audience (developers, end-users, both)
- [ ] List key features and capabilities
- [ ] Identify dependencies and prerequisites

### Step 2: Structure the README

- [ ] Select appropriate sections based on project type
- [ ] Determine depth of each section
- [ ] Plan code examples and screenshots

### Step 3: Generate Content

- [ ] Write compelling project description
- [ ] Create clear installation instructions
- [ ] Develop practical usage examples
- [ ] Document configuration options
- [ ] Add contribution guidelines

### Step 4: Polish and Format

- [ ] Add relevant badges
- [ ] Include table of contents if needed
- [ ] Verify all links work
- [ ] Ensure code blocks have syntax highlighting

## Output Format

```markdown
# Project Name

[![Build Status](badge-url)](link)
[![Version](badge-url)](link)
[![License](badge-url)](link)

Brief, compelling description of what the project does and why it matters.

## Features

- **Feature 1**: Description of the feature
- **Feature 2**: Description of the feature
- **Feature 3**: Description of the feature

## Installation

### Prerequisites

- Prerequisite 1
- Prerequisite 2

### Quick Install

```bash
# Installation command
npm install package-name
```

### From Source

```bash
git clone https://github.com/owner/repo.git
cd repo
npm install
```

## Quick Start

```language
// Minimal working example
const package = require('package-name');

package.doSomething();
```

## Usage

### Basic Usage

```language
// Basic example with explanation
```

### Advanced Usage

```language
// More complex example
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | 'default' | What this option does |
| option2 | boolean | false | What this option does |

## API Reference

### `methodName(param1, param2)`

Description of what the method does.

**Parameters:**
- `param1` (Type): Description
- `param2` (Type, optional): Description

**Returns:** Type - Description

**Example:**
```language
// Example usage
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Acknowledgment 1
- Acknowledgment 2
```

## Notes

- Keep the description under 2-3 sentences for scannability
- Use consistent heading levels (# for title, ## for sections, ### for subsections)
- Include copy-pasteable code examples that actually work
- Add screenshots or GIFs for visual projects
- Link to detailed documentation for complex topics
- Keep installation instructions platform-aware (Windows, macOS, Linux)
- Update the README when features change
- Consider adding a "Why This Project?" section for open source projects
- Include troubleshooting section if common issues exist
