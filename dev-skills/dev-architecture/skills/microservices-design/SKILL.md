---
name: microservices-design
description: "Decompose systems into microservices using domain-driven design principles, defining service boundaries, communication patterns, and data ownership. Use when breaking down monoliths, designing distributed systems, or establishing service architecture standards."
---

# Microservices Design

## Metadata
- **Name**: microservices-design
- **Description**: Design microservices architecture with service boundaries, communication patterns, and data ownership strategies.
- **Triggers**: microservices, service decomposition, monolith to microservices, service boundaries, DDD

## Instructions

You are a software architect designing a microservices architecture for $ARGUMENTS.

Your task is to decompose the domain into well-bounded services with clear responsibilities, communication patterns, and data ownership.

## Input Requirements
- Domain description and business capabilities
- Current system architecture (if migrating)
- Team structure and ownership model
- Scale requirements and SLAs
- Integration points
- Data consistency requirements

## Microservices Design Template

### 1. Domain Analysis

**Bounded Contexts**
| Context | Domain | Core Entities | Team |
|---------|--------|---------------|------|
| User Management | Identity | User, Role, Permission | Platform |
| Order Processing | Commerce | Order, Cart, Payment | Orders |
| Inventory | Supply Chain | Product, Stock, Warehouse | Catalog |
| Notification | Engagement | Message, Template, Channel | Growth |

**Context Map**
```
[User Management] <-- Customer/Supplier --> [Order Processing]
[Order Processing] <-- Conformist --> [Inventory]
[Order Processing] <-- Published Language --> [Notification]
```

### 2. Service Identification

**Service Decomposition Strategies**

| Strategy | Description | Use When |
|----------|-------------|----------|
| By Business Capability | Align to business functions | Clear business domains |
| By Subdomain | Follow DDD bounded contexts | Complex domains |
| By Data Ownership | Group by data lifecycle | Data isolation critical |
| By Team | Conway's Law alignment | Team autonomy priority |
| By Volatility | Separate stable from changing | Different change rates |

**Service Catalog**

```yaml
Service: user-service
Domain: Identity & Access
Responsibilities:
  - User registration and authentication
  - Profile management
  - Role and permission management
Owns Data:
  - users
  - roles
  - permissions
  - sessions
Exposes:
  - REST API: /api/v1/users
  - Events: UserCreated, UserUpdated, UserDeleted
Consumes:
  - None (core service)
SLA:
  - Availability: 99.99%
  - Latency P99: 50ms
Team: Platform
```

### 3. Service Communication

**Synchronous Communication (Request-Response)**

| Pattern | Use When | Trade-offs |
|---------|----------|------------|
| REST | CRUD operations, simple queries | Coupling, latency |
| gRPC | High-performance, internal services | Complexity |
| GraphQL | Flexible client queries | N+1 risks |

**Asynchronous Communication (Event-Driven)**

| Pattern | Use When | Trade-offs |
|---------|----------|------------|
| Pub/Sub | Broadcast events to many consumers | Eventually consistent |
| Message Queue | Reliable delivery, work distribution | Ordering complexity |
| Event Streaming | Event sourcing, replay capability | Storage costs |

**Communication Matrix**

| From | To | Pattern | Protocol | Purpose |
|------|-----|---------|----------|---------|
| API Gateway | user-service | Sync | REST | Authentication |
| order-service | inventory-service | Sync | gRPC | Stock check |
| order-service | notification-service | Async | Events | Order confirmation |
| payment-service | order-service | Async | Events | Payment completed |

### 4. Data Management

**Database per Service**
Each service owns its data and exposes it only through its API.

```
[User Service] --> [User DB]
[Order Service] --> [Order DB]
[Inventory Service] --> [Inventory DB]
```

**Data Consistency Patterns**

| Pattern | Consistency | Use When |
|---------|-------------|----------|
| Saga | Eventually consistent | Distributed transactions |
| Two-Phase Commit | Strong | Critical consistency (avoid) |
| Event Sourcing | Eventually consistent | Audit, temporal queries |
| CQRS | Eventually consistent | Read/write optimization |

**Saga Pattern Example (Order Processing)**
```
1. order-service: CreateOrder (pending)
2. inventory-service: ReserveStock
   - Success: Continue
   - Failure: CancelOrder (compensate)
3. payment-service: ProcessPayment
   - Success: Continue
   - Failure: ReleaseStock, CancelOrder (compensate)
4. order-service: ConfirmOrder (completed)
```

### 5. API Gateway

**Responsibilities**
- Request routing
- Authentication/Authorization
- Rate limiting
- Request/Response transformation
- SSL termination
- Caching
- Monitoring

**Routing Configuration**
```yaml
routes:
  - path: /api/v1/users/**
    service: user-service
    auth: required
    rateLimit: 100/min

  - path: /api/v1/orders/**
    service: order-service
    auth: required
    rateLimit: 50/min

  - path: /api/v1/products/**
    service: catalog-service
    auth: optional
    cache: 5min
```

### 6. Service Discovery

**Patterns**
| Pattern | Implementation | Pros | Cons |
|---------|---------------|------|------|
| Client-side | Consul, Eureka | Flexible routing | Client complexity |
| Server-side | Kubernetes, AWS ALB | Simple clients | Infrastructure dependency |
| Service Mesh | Istio, Linkerd | Full control | Operational complexity |

### 7. Resilience Patterns

**Circuit Breaker**
```
States: Closed -> Open -> Half-Open

Configuration:
  - Failure threshold: 5 failures in 10 seconds
  - Open duration: 30 seconds
  - Half-open requests: 3
```

**Retry with Backoff**
```
Attempt 1: Immediate
Attempt 2: Wait 100ms
Attempt 3: Wait 200ms
Attempt 4: Wait 400ms
Max attempts: 4
```

**Bulkhead**
```
Separate thread pools per dependency:
  - user-service: 10 threads
  - payment-service: 5 threads
  - notification-service: 3 threads
```

**Timeout**
```
Service timeouts:
  - user-service: 500ms
  - payment-service: 5000ms
  - notification-service: 1000ms
```

### 8. Deployment Considerations

**Service Template**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
        - name: user-service
          image: user-service:v1.2.3
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8080
          livenessProbe:
            httpGet:
              path: /health/live
              port: 8080
```

### 9. Migration Strategy (Monolith to Microservices)

**Strangler Fig Pattern**
1. Identify bounded context to extract
2. Create new microservice
3. Route traffic to new service
4. Migrate data
5. Remove old code
6. Repeat for next context

**Migration Order**
| Phase | Service | Risk | Dependencies |
|-------|---------|------|--------------|
| 1 | Notification | Low | None |
| 2 | User | Medium | Notification |
| 3 | Catalog | Medium | User |
| 4 | Order | High | User, Catalog |

## Service Sizing Guidelines

| Metric | Guideline |
|--------|-----------|
| Lines of Code | 5,000 - 20,000 |
| Team Size | 2-8 engineers |
| Deployment Frequency | Weekly or more |
| Bounded Context | Single, clear |
| Database Tables | 5-15 |
| API Endpoints | 10-30 |

## Anti-patterns to Avoid

| Anti-pattern | Problem | Solution |
|--------------|---------|----------|
| Distributed Monolith | Services tightly coupled | Clear boundaries, async communication |
| Shared Database | Hidden coupling | Database per service |
| Synchronous Chains | Cascading failures | Async events, circuit breakers |
| Chatty Services | Performance issues | Coarse-grained APIs |
| Nano-services | Operational overhead | Right-sized services |

## Output Process
1. Analyze domain and identify bounded contexts
2. Map business capabilities to services
3. Define service responsibilities and data ownership
4. Design communication patterns (sync/async)
5. Specify resilience patterns
6. Plan API gateway configuration
7. Create deployment templates
8. Define migration strategy (if applicable)
9. Document service contracts

## Notes
- Start with fewer, larger services; split when needed
- Team ownership is crucial; align services to teams
- Async communication by default; sync only when necessary
- Design for failure; every call can fail
- Invest in observability from day one
- Use contract testing between services
- Document service dependencies in ADRs
