---
description: Design an API with endpoints, schemas, authentication, error handling, and OpenAPI documentation
argument-hint: "<API or service to design>"
---

# /api -- API Design Workflow

Design a comprehensive API with endpoint specifications, request/response schemas, authentication, error handling, and generate OpenAPI documentation.

## Invocation

```
/api user management service
/api payment processing API for mobile app
/api [upload existing API spec or requirements]
/api                    # asks about the API
```

## Workflow

### Step 1: Understand the API

Accept context from:
- API description ("user management service")
- Feature requirements ("CRUD for users with roles")
- Existing API to extend or refactor
- Integration requirements ("mobile app + admin dashboard")

Ask clarifying questions:
1. **Purpose**: What does this API do? What problem does it solve?
2. **Consumers**: Who will use this API? (internal, external, mobile, web)
3. **Resources**: What are the main entities/resources?
4. **Operations**: What actions can be performed?
5. **Auth**: How will consumers authenticate?
6. **Scale**: Expected request volume? Latency requirements?
7. **Compatibility**: Existing APIs to integrate with?

### Step 2: Design Resources

Apply the **api-design** skill to define:

**Resource Identification**
| Resource | Description | Endpoints |
|----------|-------------|-----------|
| Users | User accounts | /users |
| Orders | Customer orders | /orders |
| Products | Product catalog | /products |

**Resource Relationships**
```
/users/{userId}
/users/{userId}/orders
/users/{userId}/addresses
/orders/{orderId}
/orders/{orderId}/items
```

### Step 3: Define Endpoints

For each resource, specify CRUD and custom operations:

```yaml
# User Resource

GET /users
  Description: List all users with pagination
  Query Parameters:
    - page: integer (default: 1)
    - limit: integer (default: 20, max: 100)
    - status: string (active, inactive, all)
    - sort: string (createdAt:desc, name:asc)
  Response: 200 OK
    {
      "data": [User],
      "pagination": { "page": 1, "limit": 20, "total": 150 }
    }

GET /users/{userId}
  Description: Get user by ID
  Path Parameters:
    - userId: string (required)
  Response: 200 OK { "data": User }
  Response: 404 Not Found

POST /users
  Description: Create a new user
  Request Body: CreateUserRequest
  Response: 201 Created { "data": User }
  Response: 400 Bad Request (validation errors)
  Response: 409 Conflict (email already exists)

PUT /users/{userId}
  Description: Full update of user
  Request Body: UpdateUserRequest
  Response: 200 OK { "data": User }

PATCH /users/{userId}
  Description: Partial update of user
  Request Body: PatchUserRequest
  Response: 200 OK { "data": User }

DELETE /users/{userId}
  Description: Delete user (soft delete)
  Response: 204 No Content
  Response: 404 Not Found
```

### Step 4: Design Request/Response Schemas

**Data Models**
```yaml
User:
  id: string (uuid)
  email: string (email format)
  name: string (1-100 chars)
  role: enum (admin, user, guest)
  status: enum (active, inactive, suspended)
  createdAt: string (ISO 8601)
  updatedAt: string (ISO 8601)

CreateUserRequest:
  email: string (required, email format)
  name: string (required, 1-100 chars)
  password: string (required, min 8 chars)
  role: enum (optional, default: user)

UpdateUserRequest:
  email: string (required)
  name: string (required)
  role: enum (required)

PatchUserRequest:
  email: string (optional)
  name: string (optional)
  role: enum (optional)
```

### Step 5: Define Authentication & Authorization

**Authentication**
```yaml
Type: Bearer Token (JWT)
Header: Authorization: Bearer {token}

Token Claims:
  - sub: user ID
  - email: user email
  - role: user role
  - exp: expiration timestamp
  - iat: issued at timestamp

Token Endpoint: POST /auth/token
Refresh Endpoint: POST /auth/refresh
```

**Authorization**
```yaml
Role-Based Access Control:

| Endpoint | admin | user | guest |
|----------|-------|------|-------|
| GET /users | Yes | No | No |
| GET /users/{id} | Yes | Own only | No |
| POST /users | Yes | No | No |
| PUT /users/{id} | Yes | Own only | No |
| DELETE /users/{id} | Yes | No | No |
```

### Step 6: Define Error Handling

**Error Response Format**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Must be a valid email address"
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z",
    "documentationUrl": "https://api.example.com/docs/errors/VALIDATION_ERROR"
  }
}
```

**Error Codes**
| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Invalid request data |
| 400 | INVALID_JSON | Malformed JSON body |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 401 | TOKEN_EXPIRED | JWT has expired |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 422 | UNPROCESSABLE | Business rule violation |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Unexpected server error |
| 503 | SERVICE_UNAVAILABLE | Service temporarily down |

### Step 7: Define Rate Limiting

```yaml
Rate Limits:
  Default: 1000 requests/minute
  Authenticated: 5000 requests/minute
  Admin: 10000 requests/minute

Headers:
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 950
  X-RateLimit-Reset: 1609459200
  Retry-After: 60 (when rate limited)
```

### Step 8: Generate OpenAPI Specification

```yaml
openapi: 3.1.0
info:
  title: User Management API
  version: 1.0.0
  description: API for managing user accounts
  contact:
    name: API Support
    email: api-support@example.com

servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://api.staging.example.com/v1
    description: Staging

security:
  - bearerAuth: []

paths:
  /users:
    get:
      summary: List users
      operationId: listUsers
      tags: [Users]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
      responses:
        '200':
          description: List of users
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        role:
          type: string
          enum: [admin, user, guest]
        status:
          type: string
          enum: [active, inactive, suspended]
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
      required: [id, email, name, role, status]
```

### Step 9: Review and Iterate

After generating, offer:
- "Want me to **add more endpoints**?"
- "Should I **design the authentication flow** in detail?"
- "Want me to **generate SDK code samples**?"
- "Should I **create a Postman collection**?"
- "Want me to **add webhook specifications**?"
- "Should I **design the GraphQL schema** instead of REST?"

Save the API specification as:
- `openapi.yaml` - OpenAPI specification
- `API-Design.md` - Human-readable documentation

## API Design Checklist

| Category | Check |
|----------|-------|
| Naming | Consistent resource names (plural nouns) |
| Versioning | Version in URL path (/v1/) |
| Pagination | Cursor or offset-based |
| Filtering | Query parameters for filtering |
| Sorting | Consistent sort parameter format |
| Errors | Structured error responses |
| Auth | Clear authentication requirements |
| Rate Limiting | Documented limits and headers |
| HATEOAS | Links for resource navigation (optional) |

## Notes

- Design for the consumer, not the database structure
- Use consistent naming conventions throughout
- Include request IDs for debugging and support
- Document all error codes with remediation steps
- Provide code samples in multiple languages
- Consider idempotency for POST/PUT operations
- Plan for backward compatibility from day one
- Test with real consumers before finalizing
