---
name: secure-coding
version: 1.0.0
description: Apply secure coding guidelines, patterns, and best practices to prevent common vulnerabilities
tags:
  - security
  - coding
  - best-practices
  - owasp
  - defensive-programming
---

# Secure Coding Guidelines

## Metadata

| Property | Value |
|----------|-------|
| Name | secure-coding |
| Version | 1.0.0 |
| Category | Security |
| Complexity | Medium |

## Instructions

Apply secure coding practices to prevent common vulnerabilities and build resilient applications. This skill provides language-agnostic guidelines and language-specific secure coding patterns.

### Core Principles

1. **Defense in Depth** - Multiple layers of security controls
2. **Least Privilege** - Minimum necessary permissions
3. **Fail Securely** - Secure default behavior on failure
4. **Don't Trust Input** - Validate and sanitize all input
5. **Keep It Simple** - Complexity breeds vulnerabilities
6. **Secure by Default** - Security enabled out of the box

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| language | string | Yes | Programming language for specific patterns |
| context | string | No | Application context (web, API, CLI, library) |
| vulnerability_focus | array | No | Specific vulnerabilities to address |
| code_sample | string | No | Code to review and improve |

## Output Process

### Step 1: Input Validation

#### Validation Strategy

```
All input is untrusted until validated

Sources of untrusted input:
- User forms and query parameters
- HTTP headers and cookies
- File uploads
- API requests
- Database results (if potentially corrupted)
- Environment variables (in some contexts)
- Third-party service responses
```

#### Validation Patterns

**Allowlist Validation (Preferred)**
```javascript
// Good: Allowlist approach
const ALLOWED_TYPES = ['pdf', 'png', 'jpg'];
if (!ALLOWED_TYPES.includes(fileType)) {
  throw new ValidationError('Invalid file type');
}
```

**Input Sanitization**
```javascript
// Sanitize HTML to prevent XSS
const sanitizedHtml = DOMPurify.sanitize(userInput);

// Escape for SQL (prefer parameterized queries)
const escapedValue = mysql.escape(userInput);

// URL encode for safe inclusion in URLs
const safeParam = encodeURIComponent(userInput);
```

### Step 2: Output Encoding

Encode output based on context:

| Context | Encoding | Example |
|---------|----------|---------|
| HTML Body | HTML Entity | `&lt;script&gt;` |
| HTML Attribute | Attribute Encoding | `&quot;onclick&quot;` |
| JavaScript | JavaScript Encoding | `\x3cscript\x3e` |
| URL | URL Encoding | `%3Cscript%3E` |
| CSS | CSS Encoding | `\3C script\3E` |
| SQL | Parameterized Queries | Use prepared statements |

### Step 3: Secure Coding Patterns by Vulnerability

#### SQL Injection Prevention

```javascript
// VULNERABLE
const query = `SELECT * FROM users WHERE id = '${userId}'`;

// SECURE: Parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
const results = await db.query(query, [userId]);

// SECURE: ORM with parameterization
const user = await User.findById(userId);
```

#### XSS Prevention

```javascript
// VULNERABLE: Direct HTML insertion
element.innerHTML = userInput;

// SECURE: Text content (no HTML parsing)
element.textContent = userInput;

// SECURE: Sanitized HTML
element.innerHTML = DOMPurify.sanitize(userInput);

// SECURE: Template with auto-escaping
// React, Vue, Angular auto-escape by default
<div>{userInput}</div>  // React - safe
```

#### Command Injection Prevention

```python
# VULNERABLE
os.system(f"convert {user_filename} output.png")

# SECURE: Avoid shell, use array
subprocess.run(['convert', user_filename, 'output.png'], shell=False)

# SECURE: Validate input
import re
if not re.match(r'^[a-zA-Z0-9._-]+$', user_filename):
    raise ValueError("Invalid filename")
```

#### Path Traversal Prevention

```python
# VULNERABLE
file_path = f"/uploads/{user_input}"
with open(file_path) as f:
    return f.read()

# SECURE: Resolve and validate
import os
base_dir = os.path.realpath('/uploads')
requested_path = os.path.realpath(os.path.join(base_dir, user_input))

if not requested_path.startswith(base_dir):
    raise SecurityError("Path traversal detected")
```

#### SSRF Prevention

```python
# VULNERABLE
response = requests.get(user_provided_url)

# SECURE: URL validation
from urllib.parse import urlparse

def is_safe_url(url):
    parsed = urlparse(url)
    # Allowlist of permitted domains
    allowed_domains = ['api.example.com', 'cdn.example.com']
    # Block internal addresses
    blocked_patterns = ['localhost', '127.0.0.1', '10.', '192.168.', '172.16.']

    if parsed.hostname not in allowed_domains:
        return False
    if any(parsed.hostname.startswith(p) for p in blocked_patterns):
        return False
    return True
```

#### Insecure Deserialization Prevention

```python
# VULNERABLE: pickle with untrusted data
import pickle
data = pickle.loads(user_input)  # RCE risk!

# SECURE: Use safe formats
import json
data = json.loads(user_input)

# SECURE: If pickle required, use hmac verification
import hmac
signature, serialized = user_input.split(':')
expected_sig = hmac.new(SECRET_KEY, serialized, 'sha256').hexdigest()
if not hmac.compare_digest(signature, expected_sig):
    raise SecurityError("Invalid signature")
```

### Step 4: Cryptography Best Practices

#### Secure Defaults

```yaml
# Encryption
symmetric: AES-256-GCM
asymmetric: RSA-4096 or Ed25519
hashing: SHA-256 or SHA-3
password_hashing: Argon2id, bcrypt, scrypt

# Avoid (deprecated/weak)
- MD5 (broken)
- SHA1 (weak)
- DES, 3DES (weak)
- RC4 (broken)
- ECB mode (pattern leakage)
```

#### Key Management

```python
# VULNERABLE: Hardcoded key
SECRET_KEY = "my-secret-key-12345"

# SECURE: Environment variable or secrets manager
SECRET_KEY = os.environ.get('SECRET_KEY')
# or
SECRET_KEY = secrets_manager.get_secret('app/secret-key')

# Generate secure random values
import secrets
token = secrets.token_urlsafe(32)
```

### Step 5: Error Handling

```python
# VULNERABLE: Detailed errors to user
try:
    user = db.query(f"SELECT * FROM users WHERE id={user_id}")
except Exception as e:
    return f"Database error: {e}"  # Leaks internal info

# SECURE: Generic user message, detailed logging
try:
    user = db.query(f"SELECT * FROM users WHERE id={user_id}")
except Exception as e:
    logger.error(f"Database error: {e}", extra={'user_id': user_id})
    return "An error occurred. Please try again."
```

### Step 6: Logging Security

```python
# VULNERABLE: Logging sensitive data
logger.info(f"User login: {username}, password: {password}")

# SECURE: Redact sensitive information
logger.info(f"User login: {username}")

# SECURE: Structured logging without secrets
logger.info("User login", extra={
    'username': username,
    'ip_address': request.remote_addr,
    'user_agent': request.user_agent.string[:100]
})
```

## Output Format

```markdown
## Secure Coding Guidelines: [Language/Framework]

### Quick Reference

| Vulnerability | Prevention Pattern |
|---------------|-------------------|
| SQL Injection | Parameterized queries |
| XSS | Output encoding, CSP |
| CSRF | Tokens, SameSite cookies |
| Path Traversal | Path canonicalization |
| Command Injection | Avoid shell, allowlist |

### Code Examples

#### [Vulnerability Type]

**Vulnerable Pattern**:
```[language]
// Insecure code example
```

**Secure Pattern**:
```[language]
// Secure code example with explanation
```

**Why It Works**:
[Explanation of the security improvement]

### Configuration Checklist

- [ ] Security headers configured
- [ ] TLS properly configured
- [ ] Error handling doesn't leak info
- [ ] Logging excludes sensitive data
- [ ] Dependencies up to date

### Testing Recommendations

1. [Security tests to implement]
2. [SAST/DAST tools to use]
```

## Notes

- Security is not a feature, it's a property of the system
- Code review should include security considerations
- Automated security testing complements manual review
- Keep dependencies updated to get security patches
- Document security assumptions and trust boundaries
- Consider security in design, not just implementation
- Use established libraries instead of rolling your own crypto
- Test security controls with both valid and malicious input
- Security training helps prevent vulnerabilities
- Incident response planning is part of secure development
