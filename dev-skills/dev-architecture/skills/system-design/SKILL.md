---
name: system-design
description: "Create a comprehensive system design document covering functional/non-functional requirements, architecture decisions, component design, data flow, and deployment strategy. Use when designing new systems, documenting existing architectures, or preparing for system design reviews."
---

# System Design Document

## Metadata
- **Name**: system-design
- **Description**: Create a comprehensive system design document for a software system with architecture diagrams, component specifications, and deployment strategies.
- **Triggers**: system design, architecture document, technical design, HLD, high-level design

## Instructions

You are a senior software architect creating a system design document for $ARGUMENTS.

Your task is to produce a complete technical specification that enables engineering teams to implement the system with clarity on architecture, components, and trade-offs.

## Input Requirements
- System purpose and business context
- Functional requirements (features, use cases)
- Non-functional requirements (scale, latency, availability)
- Constraints (budget, timeline, existing infrastructure)
- Integration points with other systems
- Expected traffic patterns and data volumes

## System Design Template

### 1. Executive Summary
- System purpose (2-3 sentences)
- Key capabilities
- Target scale and performance

### 2. Requirements Analysis

**Functional Requirements**
| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|

**Non-Functional Requirements**
| Category | Requirement | Target | Measurement |
|----------|-------------|--------|-------------|
| Availability | Uptime SLA | 99.9% | Monthly |
| Latency | P99 response time | <200ms | Per endpoint |
| Throughput | Requests per second | 10,000 RPS | Peak load |
| Data | Storage requirements | 1TB/month | Growth rate |
| Security | Compliance | SOC2, GDPR | Annual audit |

### 3. Architecture Overview
- High-level architecture diagram (describe in text or PlantUML)
- Architectural style (monolith, microservices, serverless, event-driven)
- Key design principles applied
- Technology stack summary

### 4. Component Design

For each major component:
```
**Component Name**
- Responsibility: What it does
- Interfaces: APIs exposed and consumed
- Data: What it stores/manages
- Dependencies: Other components it relies on
- Scaling: How it scales (horizontal/vertical)
- Failure modes: What happens when it fails
```

### 5. Data Architecture
- Data models and relationships
- Database selection rationale
- Data partitioning strategy
- Caching strategy
- Data consistency model (strong, eventual)
- Backup and recovery

### 6. API Design
- External APIs (public-facing)
- Internal APIs (service-to-service)
- Authentication and authorization
- Rate limiting and quotas
- Versioning strategy

### 7. Integration Architecture
- External system integrations
- Message queues and event buses
- Synchronous vs asynchronous patterns
- Circuit breakers and retry policies

### 8. Security Architecture
- Authentication mechanism
- Authorization model (RBAC, ABAC)
- Data encryption (at rest, in transit)
- Secrets management
- Audit logging
- Threat model summary

### 9. Infrastructure & Deployment
- Cloud provider and services
- Environment strategy (dev, staging, prod)
- CI/CD pipeline overview
- Infrastructure as Code approach
- Container orchestration (if applicable)
- CDN and edge caching

### 10. Observability
- Logging strategy
- Metrics and dashboards
- Distributed tracing
- Alerting thresholds
- On-call runbooks

### 11. Capacity Planning
- Expected load patterns
- Resource sizing estimates
- Auto-scaling policies
- Cost projections

### 12. Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|

### 13. Implementation Roadmap
- Phase 1: MVP (core functionality)
- Phase 2: Scale (handle production load)
- Phase 3: Optimize (performance, cost)
- Key milestones and dependencies

## Output Process
1. Gather all requirements and constraints
2. Identify architectural drivers (what matters most)
3. Select appropriate architectural patterns
4. Design component boundaries and interfaces
5. Specify data architecture and storage
6. Define security and compliance measures
7. Plan deployment and operations
8. Document risks and mitigations
9. Create implementation phases

## Notes
- Start with requirements, not technology choices
- Document trade-offs explicitly (see trade-off-analysis skill)
- Include "why" not just "what" for key decisions
- Reference ADRs for significant architectural decisions
- Keep diagrams at appropriate abstraction levels
- Consider failure scenarios for every component
- Plan for 10x the current scale requirement
