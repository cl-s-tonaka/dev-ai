---
name: secrets-management
version: 1.0.0
description: Implement secrets management strategies for secure storage, rotation, and access control of sensitive credentials
tags:
  - security
  - secrets
  - credentials
  - vault
  - configuration
---

# Secrets Management Strategy

## Metadata

| Property | Value |
|----------|-------|
| Name | secrets-management |
| Version | 1.0.0 |
| Category | Security |
| Complexity | Medium |

## Instructions

Design and implement comprehensive secrets management strategies covering storage, access, rotation, and auditing of sensitive credentials including API keys, passwords, certificates, and encryption keys.

### Types of Secrets

| Secret Type | Examples | Rotation Frequency |
|-------------|----------|-------------------|
| API Keys | Third-party service keys | 90 days |
| Database Credentials | Connection strings, passwords | 30-90 days |
| Encryption Keys | AES keys, signing keys | Annually or on compromise |
| Certificates | TLS/SSL, code signing | Before expiration |
| OAuth Secrets | Client secrets | 90 days |
| SSH Keys | Deploy keys, access keys | Annually |
| Tokens | JWT signing keys, session secrets | 30-90 days |

### Secrets Management Maturity Levels

| Level | Description | Characteristics |
|-------|-------------|-----------------|
| 1 - Ad Hoc | No formal management | Secrets in code, shared manually |
| 2 - Basic | Environment-based | Env vars, basic encryption at rest |
| 3 - Managed | Centralized solution | Vault/secrets manager, audit logs |
| 4 - Automated | Full lifecycle | Auto-rotation, dynamic secrets |
| 5 - Zero Trust | Ephemeral, minimal | Just-in-time, short-lived |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| environment | string | Yes | Target environment (dev, staging, prod) |
| infrastructure | string | No | Cloud provider or on-premises |
| scale | string | No | Team/system size (small, medium, large) |
| compliance | array | No | Compliance requirements |
| current_state | string | No | Current secrets management approach |

## Output Process

### Step 1: Secrets Inventory

- [ ] Identify all secrets in use
- [ ] Classify by sensitivity level
- [ ] Map secrets to services/applications
- [ ] Document current storage locations
- [ ] Identify hardcoded secrets

#### Inventory Template

| Secret | Type | Location | Owner | Last Rotated | Classification |
|--------|------|----------|-------|--------------|----------------|
| DB_PASSWORD | Database | Env var | Platform | 2024-01-15 | High |
| STRIPE_API_KEY | API Key | Config file | Payments | Never | Critical |

### Step 2: Select Secrets Management Solution

| Solution | Type | Best For | Features |
|----------|------|----------|----------|
| HashiCorp Vault | Self-hosted/Cloud | Enterprise, multi-cloud | Dynamic secrets, PKI |
| AWS Secrets Manager | Cloud | AWS-native | Auto-rotation, RDS integration |
| AWS SSM Parameter Store | Cloud | AWS, cost-conscious | Hierarchical, IAM integration |
| Azure Key Vault | Cloud | Azure-native | HSM, certificates |
| GCP Secret Manager | Cloud | GCP-native | IAM, versioning |
| 1Password/Secrets | SaaS | Teams, developers | CLI, integrations |
| Doppler | SaaS | Startups, multi-env | Sync, universal |
| SOPS | Open Source | GitOps, small teams | Encrypted files |

### Step 3: Access Control Design

#### Principle of Least Privilege

```yaml
access_policy:
  production:
    secrets:
      database_credentials:
        read: [app-service-account]
        write: [platform-admin]
        rotate: [secrets-rotation-service]
      api_keys:
        read: [api-gateway-service]
        write: [security-team]

  development:
    secrets:
      database_credentials:
        read: [developer-role]
        write: [developer-role]
```

#### Service Identity

```yaml
# Service account per application
services:
  payment-service:
    identity: payment-service-sa
    allowed_secrets:
      - stripe/*
      - database/payments/*

  user-service:
    identity: user-service-sa
    allowed_secrets:
      - database/users/*
      - auth0/*
```

### Step 4: Secrets Injection Patterns

#### Environment Variables (Basic)

```yaml
# Kubernetes Secret mounted as env vars
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password
```

#### Sidecar Pattern (Advanced)

```yaml
# Vault Agent sidecar for dynamic secrets
apiVersion: v1
kind: Pod
metadata:
  annotations:
    vault.hashicorp.com/agent-inject: "true"
    vault.hashicorp.com/role: "app-role"
    vault.hashicorp.com/agent-inject-secret-db: "database/creds/app"
```

#### SDK Integration

```python
# AWS Secrets Manager SDK
import boto3

def get_secret(secret_name):
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_name)
    return response['SecretString']

# HashiCorp Vault SDK
import hvac

client = hvac.Client(url='https://vault.example.com')
secret = client.secrets.kv.v2.read_secret_version(path='app/config')
```

### Step 5: Rotation Strategy

#### Automatic Rotation

```yaml
rotation_config:
  database_credentials:
    frequency: 30d
    strategy: dual-account  # Two accounts, rotate alternately
    notification:
      - security-team@example.com

  api_keys:
    frequency: 90d
    strategy: overlap  # New key valid before old expires
    grace_period: 24h
```

#### Rotation Workflow

```
1. Generate new secret
2. Update secrets manager
3. Deploy to services (zero-downtime)
4. Verify new secret works
5. Revoke old secret
6. Audit log rotation event
```

### Step 6: Emergency Procedures

#### Compromised Secret Response

```yaml
incident_response:
  steps:
    1_identify:
      - Determine scope of compromise
      - Identify affected systems

    2_contain:
      - Revoke compromised secret immediately
      - Block suspicious access

    3_rotate:
      - Generate new secrets
      - Deploy to all systems

    4_investigate:
      - Review audit logs
      - Identify root cause

    5_remediate:
      - Fix vulnerability
      - Update procedures

    6_report:
      - Document incident
      - Notify stakeholders
```

## Output Format

```markdown
## Secrets Management Strategy

**Organization**: [Name]
**Environment**: [dev/staging/prod]
**Date**: [date]

### 1. Executive Summary

[Overview of secrets management approach and key decisions]

### 2. Secrets Inventory

| Category | Count | Storage | Rotation Status |
|----------|-------|---------|-----------------|
| Database | X | Vault | Automated |
| API Keys | X | Secrets Manager | Manual |
| Certificates | X | Key Vault | Automated |

### 3. Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ Application │────▶│ Secrets      │────▶│ Secret      │
│ Service     │     │ Manager      │     │ Store       │
└─────────────┘     └──────────────┘     └─────────────┘
       │                   │                    │
       ▼                   ▼                    ▼
  [Audit Logs]      [Access Policy]      [Encryption]
```

### 4. Access Control

#### Policies
```yaml
[Access control policies]
```

#### Service Identities
| Service | Identity | Allowed Secrets |
|---------|----------|-----------------|

### 5. Injection Method

**Selected Pattern**: [Environment Variables / Sidecar / SDK]

**Implementation**:
```yaml
[Configuration example]
```

### 6. Rotation Policy

| Secret Type | Frequency | Method | Owner |
|-------------|-----------|--------|-------|
| DB Passwords | 30 days | Automated | Platform |
| API Keys | 90 days | Manual | Security |

### 7. Monitoring and Auditing

#### Audit Events
- Secret access
- Secret modification
- Access denied
- Rotation events

#### Alerts
| Event | Severity | Response |
|-------|----------|----------|
| Unauthorized access | Critical | Immediate investigation |
| Rotation failure | High | Manual intervention |

### 8. Emergency Procedures

#### Secret Compromise Runbook
1. [Immediate actions]
2. [Rotation steps]
3. [Communication plan]

### 9. Implementation Checklist

- [ ] Secrets inventory completed
- [ ] Secrets manager deployed
- [ ] Access policies configured
- [ ] Rotation automation setup
- [ ] Audit logging enabled
- [ ] Emergency procedures documented
- [ ] Team training completed

### 10. Migration Plan

| Phase | Secrets | Timeline | Status |
|-------|---------|----------|--------|
| 1 | Database credentials | Week 1-2 | Planned |
| 2 | API keys | Week 3-4 | Planned |
| 3 | Certificates | Week 5-6 | Planned |
```

## Notes

- Never commit secrets to version control
- Use .gitignore and pre-commit hooks to prevent accidental commits
- Encrypt secrets at rest and in transit
- Implement least privilege access from the start
- Regular audits help identify unused or over-privileged secrets
- Document all secrets and their purposes
- Plan for secret rotation before production deployment
- Consider dynamic secrets for database credentials
- Use secret scanning tools in CI/CD pipelines
- Train developers on secrets management practices
