---
name: code-generation
version: 1.0.0
description: Generate boilerplate code, project scaffolding, and code templates
tags:
  - code
  - generation
  - scaffolding
  - boilerplate
  - templates
---

# Code Generation

## Metadata

| Property | Value |
|----------|-------|
| Name | code-generation |
| Version | 1.0.0 |
| Category | Development |
| Complexity | Medium |

## Instructions

Generate production-ready code including boilerplate, scaffolding, and templates. Follow best practices, coding standards, and project conventions to produce maintainable, testable code.

### Generation Types

1. **Boilerplate**: Standard code patterns (CRUD, API endpoints, etc.)
2. **Scaffolding**: Project structure and initial files
3. **Templates**: Reusable code templates with placeholders
4. **Components**: UI or functional components
5. **Tests**: Test files and test cases
6. **Configuration**: Config files and settings

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| requirement | string | Yes | What code to generate |
| language | string | Yes | Programming language |
| framework | string | No | Framework or library to use |
| style | string | No | Code style preferences |
| patterns | string[] | No | Design patterns to apply |
| testing | boolean | No | Include test files |

## Output Process

### Step 1: Analyze Requirements

- [ ] Identify the type of code needed
- [ ] Determine language and framework
- [ ] Understand the domain/context
- [ ] Identify dependencies required
- [ ] Note any constraints or preferences

### Step 2: Plan Structure

**File Organization:**
```
src/
├── components/     # UI components
├── services/       # Business logic
├── models/         # Data models
├── utils/          # Utility functions
├── types/          # Type definitions
├── constants/      # Constants and enums
└── tests/          # Test files
```

### Step 3: Apply Patterns

**Common Patterns:**
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic encapsulation
- **Factory Pattern**: Object creation
- **Singleton**: Single instance management
- **Observer**: Event handling
- **Strategy**: Algorithm selection

### Step 4: Generate Code

**Code Quality Checklist:**
- [ ] Follows language idioms
- [ ] Uses meaningful names
- [ ] Includes proper typing
- [ ] Has error handling
- [ ] Is properly formatted
- [ ] Contains necessary comments
- [ ] Is testable
- [ ] Follows SOLID principles

### Step 5: Add Documentation

- [ ] File header comments
- [ ] Function/method documentation
- [ ] Parameter descriptions
- [ ] Return value documentation
- [ ] Usage examples

## Output Format

### API Endpoint (Node.js/Express)

```typescript
// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { CreateUserDTO, UpdateUserDTO } from '../dto/userDTO';
import { AppError } from '../utils/appError';
import { asyncHandler } from '../utils/asyncHandler';

export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get all users with pagination
   * @route GET /api/users
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const users = await this.userService.findAll({
      page: Number(page),
      limit: Number(limit),
    });
    res.status(200).json({
      success: true,
      data: users,
    });
  });

  /**
   * Get user by ID
   * @route GET /api/users/:id
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  /**
   * Create new user
   * @route POST /api/users
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const dto: CreateUserDTO = req.body;
    const user = await this.userService.create(dto);
    res.status(201).json({
      success: true,
      data: user,
    });
  });

  /**
   * Update user
   * @route PUT /api/users/:id
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const dto: UpdateUserDTO = req.body;
    const user = await this.userService.update(req.params.id, dto);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  /**
   * Delete user
   * @route DELETE /api/users/:id
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.userService.delete(req.params.id);
    res.status(204).send();
  });
}
```

### React Component

```tsx
// src/components/UserCard/UserCard.tsx
import React from 'react';
import { User } from '../../types/user';
import styles from './UserCard.module.css';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  isLoading?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className={styles.skeleton} aria-busy="true" />;
  }

  return (
    <article className={styles.card} data-testid="user-card">
      <header className={styles.header}>
        <img
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          className={styles.avatar}
        />
        <h3 className={styles.name}>{user.name}</h3>
      </header>

      <div className={styles.content}>
        <p className={styles.email}>{user.email}</p>
        <span className={styles.role}>{user.role}</span>
      </div>

      {(onEdit || onDelete) && (
        <footer className={styles.actions}>
          {onEdit && (
            <button
              onClick={() => onEdit(user)}
              className={styles.editButton}
              aria-label={`Edit ${user.name}`}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(user.id)}
              className={styles.deleteButton}
              aria-label={`Delete ${user.name}`}
            >
              Delete
            </button>
          )}
        </footer>
      )}
    </article>
  );
};
```

### Test File

```typescript
// src/components/UserCard/UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';
import { User } from '../../types/user';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  role: 'Admin',
};

describe('UserCard', () => {
  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('shows loading skeleton when isLoading is true', () => {
    render(<UserCard user={mockUser} isLoading />);

    expect(screen.getByRole('article')).toHaveAttribute('aria-busy', 'true');
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);

    fireEvent.click(screen.getByLabelText('Edit John Doe'));

    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<UserCard user={mockUser} onDelete={onDelete} />);

    fireEvent.click(screen.getByLabelText('Delete John Doe'));

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('does not render action buttons when callbacks are not provided', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
```

### Model/Type Definition

```typescript
// src/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  avatar?: string;
  role?: UserRole;
}
```

## Notes

- Always consider the existing project structure and conventions
- Generate code that integrates with existing patterns
- Include proper error handling and edge cases
- Add TypeScript types or JSDoc for JavaScript
- Consider accessibility in UI components
- Generate corresponding test files when applicable
- Use dependency injection for testability
- Follow framework-specific best practices
- Include necessary imports and exports
- Consider performance implications
