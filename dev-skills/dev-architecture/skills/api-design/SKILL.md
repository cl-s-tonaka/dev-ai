---
name: api-design
description: "Design RESTful or GraphQL APIs with endpoint specifications, request/response schemas, authentication, error handling, versioning, and OpenAPI documentation. Use when building new APIs, redesigning existing ones, or establishing API standards."
---

# API Design

## Metadata
- **Name**: api-design
- **Description**: Design comprehensive APIs with endpoints, schemas, authentication, versioning, and documentation.
- **Triggers**: API design, REST API, GraphQL, endpoint design, API specification, OpenAPI

## Instructions

You are an API architect designing an API for $ARGUMENTS.

Your task is to create a well-designed, consistent, and developer-friendly API specification that follows industry best practices.

## Input Requirements
- API purpose and domain
- Consumer types (internal, external, mobile, web)
- Authentication requirements
- Expected traffic and scale
- Existing APIs to integrate with
- Compliance requirements (GDPR, HIPAA, etc.)

## REST API Design Template

### 1. API Overview

```yaml
API Name: [Name]
Version: v1
Base URL: https://api.example.com/v1
Format: JSON
Authentication: Bearer Token (JWT)
Rate Limiting: 1000 requests/minute
```

### 2. Resource Design

**Resource Naming Conventions**
- Use nouns, not verbs: `/users` not `/getUsers`
- Use plural forms: `/users`, `/orders`, `/products`
- Use lowercase with hyphens: `/user-profiles`
- Nest for relationships: `/users/{id}/orders`
- Limit nesting depth to 2-3 levels

**Resource Hierarchy**
```
/users
/users/{userId}
/users/{userId}/orders
/users/{userId}/orders/{orderId}
/products
/products/{productId}
/products/{productId}/reviews
```

### 3. Endpoint Specification

For each endpoint:

```yaml
Endpoint: GET /users/{userId}
Description: Retrieve a user by ID
Authentication: Required
Authorization: User can only access their own profile; admins can access any

Path Parameters:
  - userId (string, required): Unique user identifier

Query Parameters:
  - fields (string, optional): Comma-separated fields to include
  - expand (string, optional): Related resources to expand

Request Headers:
  - Authorization: Bearer {token}
  - Accept: application/json
  - X-Request-ID: {uuid} (optional, for tracing)

Response 200 OK:
  {
    "data": {
      "id": "usr_123",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z"
    },
    "meta": {
      "requestId": "req_abc123"
    }
  }

Response 404 Not Found:
  {
    "error": {
      "code": "USER_NOT_FOUND",
      "message": "User with ID usr_123 not found",
      "requestId": "req_abc123"
    }
  }
```

### 4. HTTP Methods Usage

| Method | Usage | Idempotent | Safe |
|--------|-------|------------|------|
| GET | Retrieve resources | Yes | Yes |
| POST | Create resources | No | No |
| PUT | Full update (replace) | Yes | No |
| PATCH | Partial update | Yes | No |
| DELETE | Remove resources | Yes | No |

### 5. Status Codes

| Code | Meaning | Use When |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST creating resource |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors, malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource state conflict |
| 422 | Unprocessable Entity | Semantic validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Maintenance or overload |

### 6. Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email must be a valid email address"
      }
    ],
    "requestId": "req_abc123",
    "documentationUrl": "https://docs.example.com/errors/VALIDATION_ERROR"
  }
}
```

### 7. Pagination

**Cursor-based (recommended for large datasets)**
```
GET /users?limit=20&cursor=eyJpZCI6MTAwfQ
```

**Offset-based**
```
GET /users?limit=20&offset=40
```

**Response with pagination metadata**
```json
{
  "data": [...],
  "pagination": {
    "limit": 20,
    "hasMore": true,
    "nextCursor": "eyJpZCI6MTIwfQ",
    "totalCount": 1500
  }
}
```

### 8. Filtering and Sorting

```
GET /products?category=electronics&minPrice=100&maxPrice=500
GET /products?status=active,pending
GET /orders?createdAfter=2024-01-01T00:00:00Z
GET /users?sort=createdAt:desc,name:asc
```

### 9. Authentication & Authorization

**Authentication Methods**
- API Key: Simple, for server-to-server
- OAuth 2.0: For user-delegated access
- JWT: Stateless, scalable
- mTLS: For high-security environments

**Authorization Header**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### 10. Versioning Strategy

| Strategy | URL | Header | Notes |
|----------|-----|--------|-------|
| URL Path | `/v1/users` | - | Most common, explicit |
| Query Param | `/users?version=1` | - | Less clean |
| Header | `/users` | `Accept-Version: v1` | Cleaner URLs |
| Media Type | `/users` | `Accept: application/vnd.api.v1+json` | Most RESTful |

**Recommended**: URL path versioning for simplicity.

### 11. Rate Limiting

**Headers**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1609459200
Retry-After: 60
```

## GraphQL API Design

### Schema Design
```graphql
type User {
  id: ID!
  email: String!
  name: String!
  orders(first: Int, after: String): OrderConnection!
  createdAt: DateTime!
}

type Query {
  user(id: ID!): User
  users(first: Int, after: String, filter: UserFilter): UserConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
}
```

### Best Practices
- Use connections for pagination (Relay spec)
- Separate Input types for mutations
- Use Payload types for mutation responses
- Implement DataLoader for N+1 prevention
- Define clear error types

## Output Process
1. Define resources and relationships
2. Design URL structure and naming
3. Specify request/response schemas
4. Define authentication and authorization
5. Document error codes and handling
6. Implement pagination and filtering
7. Set rate limiting policies
8. Create versioning strategy
9. Generate OpenAPI/GraphQL schema
10. Write developer documentation

## Notes
- Consistency trumps perfection; be predictable
- Design for the consumer, not the database
- Use ISO 8601 for dates: `2024-01-15T10:30:00Z`
- Include request IDs for debugging
- Document breaking vs non-breaking changes
- Provide SDKs and code samples
- Test APIs with real consumer use cases
