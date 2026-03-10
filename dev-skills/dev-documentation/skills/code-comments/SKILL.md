---
name: code-comments
version: 1.0.0
description: Add or improve code comments including JSDoc, docstrings, inline comments, and header documentation
tags:
  - documentation
  - comments
  - jsdoc
  - docstrings
  - code-quality
  - maintainability
---

# Code Comments

## Metadata

| Property | Value |
|----------|-------|
| Name | code-comments |
| Version | 1.0.0 |
| Category | Documentation |
| Complexity | Medium |

## Instructions

Add clear, meaningful code comments that improve code maintainability and developer understanding. Focus on explaining the "why" rather than the "what", and use appropriate documentation formats for each language.

### Comment Types

1. **File/Module Headers** - Purpose, author, license
2. **Function/Method Documentation** - Parameters, returns, examples
3. **Inline Comments** - Complex logic explanation
4. **TODO/FIXME** - Technical debt tracking
5. **API Documentation** - Public interface documentation

### Documentation Formats by Language

| Language | Format | Tool |
|----------|--------|------|
| JavaScript/TypeScript | JSDoc | TypeDoc |
| Python | Docstrings (Google/NumPy/Sphinx) | Sphinx |
| Java | Javadoc | Javadoc |
| C# | XML Documentation | DocFX |
| Go | GoDoc | godoc |
| Rust | Doc Comments | rustdoc |
| Ruby | YARD | YARD |
| PHP | PHPDoc | phpDocumentor |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Yes | Code to document |
| language | string | Yes | Programming language |
| doc_style | string | No | Documentation style (Google, NumPy, JSDoc, etc.) |
| detail_level | string | No | Level of detail (minimal, standard, comprehensive) |
| existing_comments | boolean | No | Whether to preserve existing comments |

## Output Process

### Step 1: Analyze Code Structure

- [ ] Identify functions, classes, and modules
- [ ] Determine public vs private interfaces
- [ ] Find complex logic requiring explanation
- [ ] Identify potential edge cases

### Step 2: Apply Documentation Standards

- [ ] Add file/module header if missing
- [ ] Document all public functions and methods
- [ ] Add inline comments for complex sections
- [ ] Mark technical debt with TODO/FIXME

### Step 3: Ensure Quality

- [ ] Verify parameter documentation matches signature
- [ ] Check return type documentation
- [ ] Add usage examples where helpful
- [ ] Remove redundant or obvious comments

## Output Format

### JavaScript/TypeScript (JSDoc)

```javascript
/**
 * @fileoverview User authentication service handling login, logout, and session management.
 * @module services/auth
 * @author Development Team
 * @license MIT
 */

/**
 * Authenticates a user with the provided credentials.
 *
 * @async
 * @param {Object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's password (will be hashed).
 * @param {Object} [options={}] - Optional configuration.
 * @param {boolean} [options.rememberMe=false] - Whether to extend session duration.
 * @param {string} [options.mfaCode] - Multi-factor authentication code if enabled.
 * @returns {Promise<AuthResult>} The authentication result containing user and tokens.
 * @throws {AuthenticationError} When credentials are invalid.
 * @throws {RateLimitError} When too many failed attempts occur.
 *
 * @example
 * // Basic login
 * const result = await authenticate({
 *   email: 'user@example.com',
 *   password: 'securePassword123'
 * });
 *
 * @example
 * // Login with MFA
 * const result = await authenticate(
 *   { email: 'user@example.com', password: 'pass' },
 *   { mfaCode: '123456' }
 * );
 */
async function authenticate(credentials, options = {}) {
  // Validate input before processing to fail fast
  validateCredentials(credentials);

  // Check rate limiting to prevent brute force attacks
  // Uses sliding window algorithm with 5 attempts per 15 minutes
  await checkRateLimit(credentials.email);

  const user = await findUserByEmail(credentials.email);

  // SECURITY: Always hash comparison to prevent timing attacks
  const isValid = await secureCompare(
    credentials.password,
    user.passwordHash
  );

  if (!isValid) {
    // TODO: Implement account lockout after N failed attempts
    throw new AuthenticationError('Invalid credentials');
  }

  return generateAuthResult(user, options);
}

/**
 * @typedef {Object} AuthResult
 * @property {User} user - The authenticated user object.
 * @property {string} accessToken - JWT access token (expires in 15 minutes).
 * @property {string} refreshToken - Refresh token (expires in 7 days).
 * @property {Date} expiresAt - Access token expiration timestamp.
 */
```

### Python (Google Style Docstrings)

```python
"""User authentication service.

This module provides authentication functionality including login,
logout, and session management with support for MFA.

Example:
    Basic usage of the authentication service::

        from auth import AuthService

        auth = AuthService()
        result = auth.authenticate('user@example.com', 'password')
        print(f"Welcome, {result.user.name}")

Attributes:
    DEFAULT_SESSION_DURATION (int): Default session length in seconds.
    MAX_LOGIN_ATTEMPTS (int): Maximum failed attempts before lockout.
"""

from typing import Optional
from dataclasses import dataclass


@dataclass
class AuthResult:
    """Result of a successful authentication attempt.

    Attributes:
        user: The authenticated user object.
        access_token: JWT access token for API requests.
        refresh_token: Token used to obtain new access tokens.
        expires_at: Timestamp when the access token expires.
    """
    user: User
    access_token: str
    refresh_token: str
    expires_at: datetime


class AuthService:
    """Handles user authentication and session management.

    This service implements secure authentication with support for
    multi-factor authentication, rate limiting, and session management.

    Args:
        config: Authentication configuration object.
        rate_limiter: Optional custom rate limiter instance.

    Raises:
        ConfigurationError: If required configuration is missing.

    Example:
        >>> auth = AuthService(config)
        >>> auth.authenticate('user@example.com', 'password')
        AuthResult(user=<User>, access_token='...', ...)
    """

    def __init__(
        self,
        config: AuthConfig,
        rate_limiter: Optional[RateLimiter] = None
    ) -> None:
        self._config = config
        self._rate_limiter = rate_limiter or DefaultRateLimiter()

    def authenticate(
        self,
        email: str,
        password: str,
        *,
        remember_me: bool = False,
        mfa_code: Optional[str] = None
    ) -> AuthResult:
        """Authenticate a user with email and password.

        Validates the provided credentials against stored user data,
        checking MFA if enabled for the account.

        Args:
            email: User's email address.
            password: User's password (will be securely compared).
            remember_me: If True, extends session to 30 days.
            mfa_code: Six-digit MFA code if user has MFA enabled.

        Returns:
            AuthResult containing user data and authentication tokens.

        Raises:
            AuthenticationError: If credentials are invalid.
            MFARequiredError: If MFA is enabled but code not provided.
            RateLimitError: If too many failed attempts.

        Note:
            This method uses constant-time comparison to prevent
            timing attacks on the password verification.

        Example:
            >>> result = auth.authenticate(
            ...     'user@example.com',
            ...     'secure_password',
            ...     remember_me=True
            ... )
            >>> print(result.access_token)
            'eyJhbGciOiJIUzI1NiIs...'
        """
        # Rate limit check prevents brute force attacks
        self._rate_limiter.check(email)

        user = self._find_user(email)

        # SECURITY: Use constant-time comparison
        if not secrets.compare_digest(
            self._hash_password(password),
            user.password_hash
        ):
            # FIXME: Add exponential backoff for repeated failures
            raise AuthenticationError("Invalid credentials")

        return self._generate_result(user, remember_me)
```

### Inline Comment Guidelines

```javascript
// GOOD: Explains WHY, not WHAT
// Using binary search here because the list is always sorted
// and can contain up to 1M items - O(n) would be too slow
const index = binarySearch(sortedItems, target);

// BAD: States the obvious
// Loop through the array
for (const item of items) { ... }

// GOOD: Documents a non-obvious decision
// We intentionally catch and swallow this error because
// the analytics service is non-critical and shouldn't
// break the main user flow if it fails
try {
  await trackEvent(event);
} catch {
  // Silently fail - analytics is best-effort
}

// GOOD: TODO with context and ownership
// TODO(#1234): Migrate to new payment API before Dec 2024
// The v1 API will be deprecated and rate limits will apply

// GOOD: Warns about edge cases
// CAUTION: This regex doesn't handle Unicode characters.
// Use the unicode-aware version for user-facing validation.
const ASCII_EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9.-]+$/i;
```

## Notes

- Focus on "why" over "what" - the code shows what, comments explain why
- Keep comments up to date when code changes
- Remove commented-out code - use version control instead
- Use consistent formatting within a codebase
- Document all public APIs thoroughly
- Add examples for complex functions
- Use TODO/FIXME consistently with issue tracker references
- Avoid obvious comments that add noise
- Consider using documentation generators (JSDoc, Sphinx, etc.)
- Write comments for your future self and new team members
