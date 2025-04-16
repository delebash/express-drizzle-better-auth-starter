# Project Structure and Architecture

This document provides a detailed explanation of the project structure and how different components work together in the Express Drizzle Better Auth Starter.

## Overview

The application follows a layered architecture that separates concerns and promotes maintainability. The main components are:

1. **Database Schema** (`src/db/schema`)
2. **Repositories** (`src/db/repositories`) 
3. **Controllers** (`src/controllers`)
4. **Routes** (`src/routes`)
5. **Validation** (`src/validation`)
6. **Middleware** (`src/middleware`)
7. **Configuration** (`src/config`)
8. **Utilities** (`src/utils`)

## Detailed Component Breakdown

### 1. Database Schema (`src/db/schema`)

The schema directory defines the database structure using Drizzle ORM:

- `auth-schema.ts`: Defines authentication-related tables (user, session, account, verification)
- `todo.schema.ts`: Defines the todo table structure
- `index.ts`: Exports all schema definitions

Example from auth-schema.ts:
```typescript
export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  // other fields...
});
```

### 2. Repositories (`src/db/repositories`)

Repositories provide a data access layer that encapsulates database operations:

- `todo.repository.ts`: Implements CRUD operations for todos
- `index.ts`: Exports repository instances

Repositories use Drizzle ORM to interact with the database:

```typescript
async findAllByUserId(userId: string): Promise<Todo[]> {
  return db.select().from(todos).where(eq(todos.userId, userId)).orderBy(desc(todos.createdAt));
}
```

### 3. Controllers (`src/controllers`)

Controllers contain the business logic and handle HTTP requests/responses:

- `todo.controller.ts`: Implements todo-related business logic

Controllers use repositories to access data and implement features:

```typescript
async getAllTodos(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const todos = await todoRepository.findAllByUserId(userId);
    return res.status(200).json(todos);
  } catch (error) {
    // Error handling
  }
}
```

### 4. Routes (`src/routes`)

Routes define API endpoints and connect them to controllers:

- `todo.routes.ts`: Defines todo-related endpoints
- `index.ts`: Combines all route modules

Routes apply middleware (like authentication and validation) and map HTTP methods to controller functions:

```typescript
// Apply authentication middleware to all todo routes
router.use(verifyToken);

// Get all todos for the authenticated user
router.get("/", TodoController.getAllTodos);

// Create a new todo - with validation
router.post("/", validate(createTodoSchema), TodoController.createTodo);
```

### 5. Validation (`src/validation`)

Validation schemas ensure that incoming data meets requirements:

- `todo.schema.ts`: Defines validation rules for todo operations

Validation uses Joi to define schemas:

```typescript
export const createTodoSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required()
    .messages({
      'string.empty': 'Title cannot be empty',
      // other validation messages...
    }),
  // other fields...
});
```

### 6. Middleware (`src/middleware`)

Middleware functions process requests before they reach route handlers:

- `auth.ts`: Authentication middleware (verifyToken, requireRole)
- `rate-limit.ts`: Rate limiting to prevent abuse
- `request-logger.ts`: Logs incoming requests
- `validation.ts`: Validates request data against schemas

Example of middleware usage:

```typescript
// Validate incoming request body against a schema
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      // Handle validation error
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map(detail => ({
          message: detail.message,
          path: detail.path
        }))
      });
    }
    
    next();
  };
};
```

### 7. Configuration (`src/config`)

Configuration files manage application settings:

- `index.ts`: Exports configuration from environment variables
- Other configuration files for specific components

### 8. Utilities (`src/utils`)

Utility functions and helpers:

- `auth.ts`: Authentication configuration
- `error-handler.ts`: Global error handling
- `logger.ts`: Logging utilities

## Data Flow

1. **Request Lifecycle**:
   - HTTP request arrives at a route
   - Middleware processes the request (authentication, validation)
   - Controller handles the request
   - Repository performs database operations
   - Controller formats and returns the response

2. **Example Flow** (Creating a Todo):
   - Request hits `POST /api/v1/todo`
   - `verifyToken` middleware authenticates the user
   - `validate` middleware validates the request body against `createTodoSchema`
   - `TodoController.createTodo` processes the request
   - `todoRepository.create` inserts the todo into the database
   - Response with the created todo is sent back to the client

## Authentication

The project uses Better Auth for authentication:
- Authentication routes are handled at `/api/auth/*`
- The `verifyToken` middleware ensures users are authenticated before accessing protected routes

## Database Configuration

Database connection and configuration are handled in `src/db/config.ts`, which initializes Drizzle ORM with PostgreSQL.

## Benefits of This Architecture

This architecture promotes:
- **Separation of concerns**: Each component has a specific responsibility
- **Testability**: Components can be tested in isolation
- **Maintainability**: Changes to one layer don't affect others
- **Scalability**: Easy to add new features by following the established patterns
- **Type safety**: Full TypeScript support throughout the application
