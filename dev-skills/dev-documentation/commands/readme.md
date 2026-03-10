---
description: Generate or update a README.md file with project overview, installation, usage, and contribution guidelines
argument-hint: "<project path or description>"
---

# /readme -- README.md Generation

Generate a comprehensive, well-structured README.md that serves as the primary entry point for understanding and using a project.

## Invocation

```
/readme ./my-project
/readme A CLI tool for converting markdown to PDF
/readme Update the README for our authentication library
/readme [upload existing README to improve]
```

## Workflow

### Step 1: Understand the Project

Analyze the input to determine:
- Project type (library, CLI, API, web app, mobile app)
- Primary programming language
- Package manager or distribution method
- Target audience (developers, end-users, both)

If given a directory path, scan for:
- `package.json`, `setup.py`, `Cargo.toml`, `go.mod` (project metadata)
- Existing `README.md` (to update rather than replace)
- Source code structure
- Configuration files

### Step 2: Gather Missing Information

Ask only for information that cannot be inferred:

1. **Project name**: What should the project be called?
2. **One-liner**: How would you describe this in one sentence?
3. **Key features**: What are the 3-5 main capabilities?
4. **Installation**: How do users install this?
5. **Prerequisites**: What do users need before installing?

### Step 3: Generate README Structure

Apply the **readme-generator** skill with this structure:

```markdown
# Project Name

[![Build Status](badge)](link)
[![Version](badge)](link)
[![License](badge)](link)

One-liner description of what this project does.

## Features

- **Feature 1**: Brief description
- **Feature 2**: Brief description
- **Feature 3**: Brief description

## Installation

### Prerequisites

- Prerequisite 1
- Prerequisite 2

### Install

```bash
npm install package-name
```

## Quick Start

```language
// Minimal working example that users can copy-paste
```

## Usage

### Basic Usage

```language
// Example with explanation
```

### Advanced Usage

```language
// More complex example
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option | type | default | description |

## API Reference

### `functionName(params)`

Description of the function.

**Parameters:**
- `param1` (Type): Description

**Returns:** Type - Description

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License - see [LICENSE](LICENSE) for details.
```

### Step 4: Customize Based on Project Type

**For Libraries:**
- Emphasize API documentation
- Include code examples in multiple scenarios
- Add TypeScript/type definition info if applicable

**For CLI Tools:**
- Include command reference with all flags
- Show example commands with output
- Add shell completion instructions

**For Web Applications:**
- Include deployment instructions
- Add environment variable documentation
- Include screenshots or demo links

**For APIs:**
- Link to full API documentation
- Show authentication setup
- Include rate limiting info

### Step 5: Add Badges

Select appropriate badges based on the project:

```markdown
<!-- Build/CI -->
![Build](https://github.com/owner/repo/workflows/CI/badge.svg)

<!-- Package Version -->
![npm](https://img.shields.io/npm/v/package)
![PyPI](https://img.shields.io/pypi/v/package)

<!-- Downloads -->
![Downloads](https://img.shields.io/npm/dm/package)

<!-- License -->
![License](https://img.shields.io/github/license/owner/repo)

<!-- Code Quality -->
![Coverage](https://img.shields.io/codecov/c/github/owner/repo)
![Code Quality](https://img.shields.io/codacy/grade/xxx)

<!-- Documentation -->
![Docs](https://img.shields.io/badge/docs-latest-blue)
```

### Step 6: Review and Finalize

Before saving, verify:
- [ ] All code examples are syntactically correct
- [ ] Installation instructions are complete
- [ ] Links are properly formatted
- [ ] Badges use correct URLs
- [ ] Table of contents is accurate (for long READMEs)

Save the README.md to the project root.

### Step 7: Offer Enhancements

After generating, offer:
- "Want me to **add a table of contents**?"
- "Should I **create a CONTRIBUTING.md**?"
- "Want me to **add more code examples**?"
- "Should I **generate API documentation** from the code?"

## Examples

### Minimal README (Small Script)

```markdown
# csv-to-json

Convert CSV files to JSON with a single command.

## Install

```bash
npm install -g csv-to-json
```

## Usage

```bash
csv-to-json input.csv output.json
```

## License

MIT
```

### Full README (Library)

See the output format in Step 3 for a complete example.

## Notes

- Keep the first paragraph under 2-3 sentences
- Use active voice ("Install the package" not "The package should be installed")
- Include copy-pasteable code that actually works
- Add screenshots or GIFs for visual projects
- Link to detailed docs for complex topics
- Update the README when features change
- Consider international audiences (avoid idioms, use clear language)
- Test installation instructions on a clean environment
