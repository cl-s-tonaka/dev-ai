---
name: api-documentation
version: 1.0.0
description: Create API documentation following OpenAPI/Swagger specifications, including endpoints, parameters, responses, and examples
tags:
  - documentation
  - api
  - openapi
  - swagger
  - rest
  - developer-experience
---

# API Documentation

## Metadata

| Property | Value |
|----------|-------|
| Name | api-documentation |
| Version | 1.0.0 |
| Category | Documentation |
| Complexity | High |

## Instructions

Create comprehensive API documentation that enables developers to understand and integrate with your API quickly. Support OpenAPI 3.0+ specifications with clear examples, authentication details, and error handling documentation.

### Documentation Standards

1. **OpenAPI/Swagger** - Industry standard for REST APIs
2. **AsyncAPI** - For event-driven APIs
3. **GraphQL SDL** - For GraphQL APIs
4. **gRPC/Protobuf** - For gRPC services

### Key Documentation Elements

- Clear endpoint descriptions
- Request/response examples
- Authentication requirements
- Error codes and handling
- Rate limiting information
- Versioning strategy

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| api_name | string | Yes | Name of the API |
| base_url | string | Yes | Base URL for the API |
| endpoints | array | Yes | List of API endpoints to document |
| auth_type | string | No | Authentication method (OAuth2, API Key, JWT, etc.) |
| version | string | No | API version |
| existing_spec | file | No | Existing OpenAPI spec to enhance |

## Output Process

### Step 1: Analyze API Structure

- [ ] Identify all endpoints and methods
- [ ] Map request/response schemas
- [ ] Document authentication flow
- [ ] List error responses

### Step 2: Create OpenAPI Specification

- [ ] Define info and server sections
- [ ] Document paths and operations
- [ ] Create reusable components/schemas
- [ ] Add security definitions

### Step 3: Enhance with Examples

- [ ] Add request examples for each endpoint
- [ ] Include response examples (success and error)
- [ ] Document edge cases
- [ ] Add code snippets in multiple languages

### Step 4: Validate and Format

- [ ] Validate against OpenAPI schema
- [ ] Ensure consistency in naming
- [ ] Verify all references resolve
- [ ] Generate human-readable documentation

## Output Format

### OpenAPI 3.0 Specification

```yaml
openapi: 3.0.3
info:
  title: API Name
  description: |
    Comprehensive API description with Markdown support.

    ## Authentication
    This API uses OAuth 2.0 Bearer tokens for authentication.

    ## Rate Limiting
    - 1000 requests per hour for standard plans
    - 10000 requests per hour for enterprise plans
  version: 1.0.0
  contact:
    name: API Support
    email: api-support@example.com
    url: https://example.com/support
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server

tags:
  - name: Users
    description: User management operations
  - name: Resources
    description: Resource CRUD operations

paths:
  /users:
    get:
      tags:
        - Users
      summary: List all users
      description: |
        Retrieve a paginated list of users. Supports filtering and sorting.
      operationId: listUsers
      parameters:
        - name: page
          in: query
          description: Page number for pagination
          required: false
          schema:
            type: integer
            default: 1
            minimum: 1
        - name: limit
          in: query
          description: Number of items per page
          required: false
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
        - name: sort
          in: query
          description: Sort field and direction
          required: false
          schema:
            type: string
            enum: [created_at, -created_at, name, -name]
            default: -created_at
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'
              example:
                data:
                  - id: "usr_123"
                    name: "John Doe"
                    email: "john@example.com"
                    created_at: "2024-01-15T10:30:00Z"
                meta:
                  page: 1
                  limit: 20
                  total: 150
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/RateLimited'
      security:
        - bearerAuth: []

    post:
      tags:
        - Users
      summary: Create a new user
      description: Create a new user account with the provided information.
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
            example:
              name: "Jane Smith"
              email: "jane@example.com"
              role: "member"
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          description: User already exists
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
      security:
        - bearerAuth: []

  /users/{userId}:
    get:
      tags:
        - Users
      summary: Get user by ID
      description: Retrieve a specific user by their unique identifier.
      operationId: getUserById
      parameters:
        - name: userId
          in: path
          required: true
          description: Unique user identifier
          schema:
            type: string
            pattern: '^usr_[a-zA-Z0-9]+$'
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'
      security:
        - bearerAuth: []

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          description: Unique user identifier
          example: "usr_123abc"
        name:
          type: string
          description: User's full name
          example: "John Doe"
        email:
          type: string
          format: email
          description: User's email address
          example: "john@example.com"
        role:
          type: string
          enum: [admin, member, viewer]
          description: User's role in the system
        created_at:
          type: string
          format: date-time
          description: Account creation timestamp
        updated_at:
          type: string
          format: date-time
          description: Last update timestamp
      required:
        - id
        - name
        - email
        - role

    CreateUserRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        email:
          type: string
          format: email
        role:
          type: string
          enum: [admin, member, viewer]
          default: member
      required:
        - name
        - email

    UserList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        meta:
          $ref: '#/components/schemas/PaginationMeta'

    PaginationMeta:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer

    Error:
      type: object
      properties:
        code:
          type: string
          description: Machine-readable error code
        message:
          type: string
          description: Human-readable error message
        details:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              message:
                type: string

  responses:
    BadRequest:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "VALIDATION_ERROR"
            message: "Request validation failed"
            details:
              - field: "email"
                message: "Invalid email format"

    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "UNAUTHORIZED"
            message: "Authentication required"

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "NOT_FOUND"
            message: "The requested resource was not found"

    RateLimited:
      description: Rate limit exceeded
      headers:
        X-RateLimit-Limit:
          schema:
            type: integer
          description: Request limit per hour
        X-RateLimit-Remaining:
          schema:
            type: integer
          description: Remaining requests in current window
        X-RateLimit-Reset:
          schema:
            type: integer
          description: Unix timestamp when the rate limit resets
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT token obtained from the /auth/token endpoint.
        Include in header as: `Authorization: Bearer <token>`

    apiKey:
      type: apiKey
      in: header
      name: X-API-Key
      description: API key for server-to-server communication
```

### Code Examples Section

```markdown
## Code Examples

### cURL

```bash
curl -X GET "https://api.example.com/v1/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Python

```python
import requests

response = requests.get(
    "https://api.example.com/v1/users",
    headers={"Authorization": "Bearer YOUR_TOKEN"}
)
users = response.json()
```

### JavaScript

```javascript
const response = await fetch('https://api.example.com/v1/users', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }
});
const users = await response.json();
```
```

## Notes

- Always include realistic example values, not placeholders like "string"
- Document all possible error responses with specific error codes
- Include rate limiting information in the API description
- Use consistent naming conventions (camelCase, snake_case)
- Add deprecation notices for outdated endpoints
- Include changelog for API version updates
- Validate the OpenAPI spec using tools like swagger-cli or redocly
- Consider generating SDK documentation automatically from the spec
- Include webhook documentation if applicable
