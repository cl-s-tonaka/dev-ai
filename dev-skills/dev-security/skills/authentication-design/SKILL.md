---
name: authentication-design
version: 1.0.0
description: Design secure authentication and authorization systems using modern best practices and standards
tags:
  - security
  - authentication
  - authorization
  - oauth
  - jwt
  - rbac
---

# Authentication and Authorization Design

## Metadata

| Property | Value |
|----------|-------|
| Name | authentication-design |
| Version | 1.0.0 |
| Category | Security |
| Complexity | High |

## Instructions

Design secure authentication (AuthN) and authorization (AuthZ) systems using industry standards and best practices. Cover identity verification, access control models, session management, and integration with identity providers.

### Authentication Methods

| Method | Security Level | Use Case |
|--------|---------------|----------|
| Password + MFA | High | Standard user accounts |
| OAuth 2.0 / OIDC | High | Social login, SSO |
| SAML 2.0 | High | Enterprise SSO |
| API Keys | Medium | Service-to-service |
| JWT Tokens | Medium-High | Stateless authentication |
| mTLS | Very High | Zero-trust, service mesh |
| Passkeys/WebAuthn | Very High | Passwordless authentication |
| Magic Links | Medium | Low-friction authentication |

### Authorization Models

| Model | Description | Best For |
|-------|-------------|----------|
| RBAC | Role-Based Access Control | Simple permission structures |
| ABAC | Attribute-Based Access Control | Complex, contextual rules |
| ReBAC | Relationship-Based Access Control | Social, collaborative apps |
| ACL | Access Control Lists | File/resource-based systems |
| PBAC | Policy-Based Access Control | Microservices, cloud-native |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| application_type | string | Yes | Type of application (web, mobile, API, SPA) |
| user_types | array | Yes | Types of users (consumers, employees, admins) |
| scale | string | No | Expected user scale (startup, growth, enterprise) |
| compliance | array | No | Compliance requirements (SOC2, HIPAA, PCI-DSS) |
| existing_idp | string | No | Existing identity provider if any |
| mfa_requirement | string | No | MFA requirements (optional, required, adaptive) |

## Output Process

### Step 1: Requirements Analysis

- [ ] Identify user types and authentication needs
- [ ] Determine compliance requirements
- [ ] Assess risk tolerance
- [ ] Evaluate existing infrastructure
- [ ] Define session requirements

### Step 2: Authentication Design

#### Password Policy

```yaml
password_policy:
  minimum_length: 12
  require_uppercase: true
  require_lowercase: true
  require_numbers: true
  require_special: true
  prevent_common: true
  prevent_user_info: true
  history_count: 10
  max_age_days: 90  # Optional, NIST suggests avoiding forced rotation
```

#### Password Storage

```
# Never store plaintext passwords
# Use adaptive hashing algorithms

Recommended:
- Argon2id (preferred)
- bcrypt (cost factor >= 10)
- scrypt

Parameters:
- Argon2id: memory=64MB, iterations=3, parallelism=4
- bcrypt: cost=12
```

#### MFA Options

| Factor Type | Examples | Security | UX |
|-------------|----------|----------|-----|
| Knowledge | Password, PIN, Security questions | Medium | Good |
| Possession | TOTP, SMS, Hardware key, Push | High | Medium |
| Inherence | Fingerprint, Face, Voice | High | Good |
| Location | IP, Geolocation | Low | Transparent |
| Behavior | Typing patterns, Mouse movement | Medium | Transparent |

### Step 3: Session Management

#### Token Design

```yaml
jwt_configuration:
  algorithm: RS256  # Asymmetric for distributed systems
  access_token_expiry: 15m
  refresh_token_expiry: 7d
  issuer: "https://auth.example.com"
  audience: "https://api.example.com"

claims:
  required:
    - sub (user ID)
    - iat (issued at)
    - exp (expiration)
    - iss (issuer)
    - aud (audience)
  optional:
    - roles
    - permissions
    - tenant_id
```

#### Session Security

| Control | Implementation |
|---------|---------------|
| Secure flag | Set on all session cookies |
| HttpOnly | Prevent JavaScript access |
| SameSite | Strict or Lax for CSRF protection |
| Domain | Limit to specific domain |
| Max-Age | Define session lifetime |
| Regeneration | New ID on privilege change |

### Step 4: Authorization Design

#### RBAC Structure

```yaml
roles:
  admin:
    inherits: [manager]
    permissions:
      - users:*
      - system:*
      - audit:read

  manager:
    inherits: [user]
    permissions:
      - users:read
      - users:create
      - reports:*

  user:
    permissions:
      - profile:read
      - profile:update
      - content:read
```

#### Permission Patterns

```
resource:action
resource:action:scope

Examples:
- users:read           # Read any user
- users:read:own       # Read own user only
- users:*              # All actions on users
- *:read               # Read any resource
```

### Step 5: Security Controls

#### Rate Limiting

| Endpoint | Limit | Window | Action |
|----------|-------|--------|--------|
| /login | 5 attempts | 15 min | Block IP |
| /password-reset | 3 requests | 1 hour | Require CAPTCHA |
| /api/* | 1000 requests | 1 min | 429 response |
| /register | 10 accounts | 1 hour | Block IP |

#### Account Security

- [ ] Account lockout after failed attempts
- [ ] Secure password reset flow
- [ ] Email/phone verification
- [ ] Login anomaly detection
- [ ] Session invalidation on password change
- [ ] Concurrent session limits

## Output Format

```markdown
## Authentication & Authorization Design

**Application**: [Application Name]
**Version**: [version]
**Date**: [date]

### 1. Overview

#### Authentication Flow
```
[Diagram of auth flow]
```

#### Components
| Component | Purpose | Technology |
|-----------|---------|------------|
| Identity Provider | User authentication | Auth0/Okta/Custom |
| Authorization Service | Permission evaluation | OPA/Custom |
| Session Store | Token/session storage | Redis |

### 2. Authentication Design

#### Primary Authentication
- **Method**: [Password + MFA / OAuth 2.0 / etc.]
- **Identity Provider**: [Provider name]
- **Supported IdPs**: [List of social/enterprise IdPs]

#### Password Policy
```yaml
[Password policy configuration]
```

#### Multi-Factor Authentication
| Factor | Type | Required | Implementation |
|--------|------|----------|----------------|

#### Passwordless Options
- [ ] Magic links
- [ ] WebAuthn/Passkeys
- [ ] Push notifications

### 3. Authorization Model

#### Model: [RBAC/ABAC/etc.]

#### Roles and Permissions
```yaml
[Role definitions]
```

#### Permission Evaluation
```
[Pseudocode or logic for permission checks]
```

### 4. Token Design

#### Access Token
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_123",
    "roles": ["user"],
    "permissions": ["profile:read", "content:read"],
    "iat": 1234567890,
    "exp": 1234568790,
    "iss": "https://auth.example.com",
    "aud": "https://api.example.com"
  }
}
```

#### Token Lifecycle
| Token | Expiry | Storage | Refresh |
|-------|--------|---------|---------|

### 5. Session Management

#### Session Configuration
```yaml
[Session settings]
```

#### Cookie Settings
```yaml
[Cookie configuration]
```

### 6. Security Controls

#### Rate Limiting
| Endpoint | Limit | Action |
|----------|-------|--------|

#### Brute Force Protection
[Implementation details]

#### Anomaly Detection
[Detection rules and responses]

### 7. Compliance Mapping

| Requirement | Control | Implementation |
|-------------|---------|----------------|
| SOC2 CC6.1 | MFA | TOTP required for admin |
| HIPAA 164.312(d) | Authentication | Unique user IDs |

### 8. Implementation Checklist

- [ ] Password hashing with Argon2id/bcrypt
- [ ] MFA implementation
- [ ] Secure session management
- [ ] RBAC/ABAC implementation
- [ ] Rate limiting on auth endpoints
- [ ] Security event logging
- [ ] Token rotation strategy
- [ ] Account recovery flow

### 9. Security Considerations

#### Do
- Use proven libraries and frameworks
- Implement defense in depth
- Log all authentication events
- Regularly rotate signing keys

#### Don't
- Store plaintext passwords
- Use JWT for sessions without consideration
- Trust client-side authorization
- Use predictable session IDs
```

## Notes

- Prefer established identity providers over custom implementations
- Always use HTTPS for authentication endpoints
- Implement proper logging for security events (without sensitive data)
- Consider zero-trust principles for internal services
- Plan for credential rotation and revocation
- Design for scalability from the start
- Include account recovery in the design
- Consider compliance requirements early
- Test authentication flows thoroughly
- Document security assumptions and limitations
