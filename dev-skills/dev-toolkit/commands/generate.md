---
name: generate
version: 1.0.0
description: Generate code from specifications and requirements
argument-hint: "[code requirements]"
arguments:
  - name: requirements
    description: What code to generate
    required: true
  - name: language
    description: Programming language
    required: false
  - name: framework
    description: Framework or library to use
    required: false
examples:
  - "/generate REST API endpoint for user CRUD operations"
  - "/generate React component for a data table with sorting"
  - "/generate Python class for handling file uploads"
---

# /generate

Generate production-ready code from specifications and requirements.

## Metadata

| Property | Value |
|----------|-------|
| Command | /generate |
| Skill | [code-generation](../skills/code-generation/SKILL.md) |
| Category | Development |

## Instructions

When the user invokes `/generate`, analyze the requirements and produce clean, well-documented, production-ready code. Include:

1. **Main code** - The requested functionality
2. **Types/Interfaces** - Type definitions if applicable
3. **Tests** - Unit tests when appropriate
4. **Documentation** - Comments and usage examples

### Generation Capabilities

| Category | Examples |
|----------|----------|
| API | REST endpoints, GraphQL resolvers, middleware |
| Components | React, Vue, Angular components |
| Models | Data models, DTOs, schemas |
| Services | Business logic, data access layers |
| Utilities | Helper functions, validators, formatters |
| Tests | Unit tests, integration tests, mocks |
| Config | Configuration files, environment setup |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| requirements | string | Yes | What code to generate |
| language | string | No | Target programming language |
| framework | string | No | Framework or library |
| patterns | string | No | Design patterns to use |

## Output Format

```markdown
## Generated Code

### [Main File]
```[language]
[generated code]
```

### [Types/Interfaces] (if applicable)
```[language]
[type definitions]
```

### [Tests] (if applicable)
```[language]
[test code]
```

### Usage
```[language]
[usage example]
```

### Notes
- [Important considerations]
```

## Examples

### Input
```
/generate REST API endpoint for user management with CRUD operations in TypeScript/Express
```

### Output
```markdown
## Generated Code

### User Controller (`src/controllers/userController.ts`)
```typescript
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';
import { asyncHandler } from '../middleware/asyncHandler';
import { NotFoundError } from '../errors/NotFoundError';

export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get all users with pagination
   * GET /api/users?page=1&limit=10
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.userService.findAll({ page, limit });

    res.json({
      success: true,
      data: result.users,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    });
  });

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.findById(req.params.id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({ success: true, data: user });
  });

  /**
   * Create new user
   * POST /api/users
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const dto: CreateUserDTO = req.body;
    const user = await this.userService.create(dto);

    res.status(201).json({ success: true, data: user });
  });

  /**
   * Update user
   * PUT /api/users/:id
   */
  update = asyncHandler(async (req: Request, res: Response) => {
    const dto: UpdateUserDTO = req.body;
    const user = await this.userService.update(req.params.id, dto);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({ success: true, data: user });
  });

  /**
   * Delete user
   * DELETE /api/users/:id
   */
  delete = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await this.userService.delete(req.params.id);

    if (!deleted) {
      throw new NotFoundError('User not found');
    }

    res.status(204).send();
  });
}
```

### User Routes (`src/routes/userRoutes.ts`)
```typescript
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import { validateBody } from '../middleware/validation';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';
import { authenticate } from '../middleware/auth';

const router = Router();
const userService = new UserService();
const controller = new UserController(userService);

router.use(authenticate);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validateBody(createUserSchema), controller.create);
router.put('/:id', validateBody(updateUserSchema), controller.update);
router.delete('/:id', controller.delete);

export default router;
```

### DTOs (`src/dto/user.dto.ts`)
```typescript
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Tests (`src/controllers/userController.test.ts`)
```typescript
import { Request, Response } from 'express';
import { UserController } from './userController';
import { UserService } from '../services/userService';

jest.mock('../services/userService');

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockUserService = new UserService() as jest.Mocked<UserService>;
    controller = new UserController(mockUserService);
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe('getAll', () => {
    it('returns paginated users', async () => {
      const users = [{ id: '1', name: 'Test User' }];
      mockUserService.findAll.mockResolvedValue({ users, total: 1 });
      mockRequest = { query: { page: '1', limit: '10' } };

      await controller.getAll(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: users,
        pagination: { page: 1, limit: 10, total: 1, pages: 1 },
      });
    });
  });

  describe('getById', () => {
    it('returns user when found', async () => {
      const user = { id: '1', name: 'Test User' };
      mockUserService.findById.mockResolvedValue(user);
      mockRequest = { params: { id: '1' } };

      await controller.getById(
        mockRequest as Request,
        mockResponse as Response,
        jest.fn()
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: user,
      });
    });

    it('throws NotFoundError when user not found', async () => {
      mockUserService.findById.mockResolvedValue(null);
      mockRequest = { params: { id: '999' } };

      await expect(
        controller.getById(
          mockRequest as Request,
          mockResponse as Response,
          jest.fn()
        )
      ).rejects.toThrow('User not found');
    });
  });
});
```

### Usage
```typescript
// In your main app.ts
import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
```

### Notes
- Add proper validation middleware for request bodies
- Implement rate limiting for production
- Add request logging middleware
- Consider adding caching for GET requests
```

---

### Input
```
/generate React hook for form handling with validation
```

### Output
```markdown
## Generated Code

### useForm Hook (`src/hooks/useForm.ts`)
```typescript
import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

interface ValidationRule<T> {
  validate: (value: T[keyof T], values: T) => boolean;
  message: string;
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]): string | undefined => {
      const rules = validationRules[field];
      if (!rules) return undefined;

      for (const rule of rules) {
        if (!rule.validate(value, values)) {
          return rule.message;
        }
      }
      return undefined;
    },
    [validationRules, values]
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const field of Object.keys(values) as Array<keyof T>) {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldValue = type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value;

      setValues((prev) => ({ ...prev, [name]: fieldValue }));

      if (touched[name as keyof T]) {
        const error = validateField(name as keyof T, fieldValue as T[keyof T]);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name as keyof T, value as T[keyof T]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);

      if (!validateAll()) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit]
  );

  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  };
}
```

### Usage Example
```typescript
import { useForm } from './hooks/useForm';

interface LoginForm {
  email: string;
  password: string;
}

function LoginPage() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<LoginForm>({
    initialValues: { email: '', password: '' },
    validationRules: {
      email: [
        {
          validate: (value) => Boolean(value),
          message: 'Email is required',
        },
        {
          validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string),
          message: 'Invalid email format',
        },
      ],
      password: [
        {
          validate: (value) => Boolean(value),
          message: 'Password is required',
        },
        {
          validate: (value) => (value as string).length >= 8,
          message: 'Password must be at least 8 characters',
        },
      ],
    },
    onSubmit: async (values) => {
      await loginUser(values);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && <span>{errors.email}</span>}
      </div>
      <div>
        <input
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.password && errors.password && <span>{errors.password}</span>}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

### Notes
- Consider adding async validation support
- Add field array support for dynamic forms
- Consider integrating with a schema validation library (Zod, Yup)
```

## Notes

- Generated code follows best practices for the specified language/framework
- Include proper error handling and edge cases
- Add TypeScript types when applicable
- Generate corresponding tests when appropriate
- Follow project conventions when context is available
- Include necessary imports and exports
