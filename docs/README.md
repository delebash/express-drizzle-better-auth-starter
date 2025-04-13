# Express Drizzle Better Auth Starter

A modern Express.js starter template with Drizzle ORM for PostgreSQL and robust authentication.

## Features

- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js
- **Drizzle ORM**: TypeScript ORM with a focus on type safety and developer experience
- **PostgreSQL**: Powerful, open-source object-relational database system
- **Authentication**: JWT-based authentication with token refresh capabilities
- **Authorization**: Role-based access control
- **TypeScript**: Full type safety throughout the application
- **API Structure**: Well-organized controllers, repositories, and routes
- **Error Handling**: Centralized error handling with custom error classes
- **Validation**: Request validation using middleware
- **Logging**: Structured logging for better debugging and monitoring
- **Security**: Implementation of security best practices with Helmet

## Project Structure

```
├── src/
│   ├── config/             # Application configuration
│   ├── controllers/        # Request handlers
│   ├── db/                 # Database related code
│   │   ├── repositories/   # Data access layer
│   │   └── schema/         # Database schema definitions
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
├── docs/                   # Documentation
└── ...
```

## Todo Feature

The repository includes a complete Todo feature implementation with:

- **Schema**: Defined using Drizzle ORM with proper relations
- **Repository**: Data access layer with CRUD operations
- **Controller**: Request handlers for all Todo operations
- **Routes**: RESTful API endpoints with authentication

### Todo Schema

The Todo schema includes:
- `id`: UUID primary key
- `title`: Required title with max length
- `description`: Text description
- `completed`: Boolean flag (default: false)
- `createdAt`: Timestamp for creation date
- `updatedAt`: Timestamp for last update
- `userId`: Foreign key to user

### Todo API Endpoints

| Method | Endpoint        | Description                   | Authentication |
|--------|-----------------|-------------------------------|----------------|
| GET    | /api/v1/todo       | Get all todos for current user| Required       |
| GET    | /api/v1/todo/:id   | Get a specific todo by ID     | Required       |
| POST   | /api/v1/todo       | Create a new todo             | Required       |
| PUT    | /api/v1/todo/:id   | Update a todo                 | Required       |
| DELETE | /api/v1/todo/:id   | Delete a todo                 | Required       |
| PATCH  | /api/v1/todo/:id/toggle | Toggle completion status | Required       |

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- npm or yarn
- AWS account (for AWS-related features)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/miclondev/express-drizzle-better-auth-starter.git
   cd express-drizzle-better-auth-starter
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials, AWS settings, and other configurations
   ```

4. Run database migrations
   ```bash
   npm run db:migrate
   # or
   yarn db:migrate
   ```

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Authentication with better-auth

This starter uses [better-auth](https://github.com/better-auth/better-auth) v1.2.7 - a comprehensive authentication library for TypeScript applications. better-auth provides a complete authentication solution with minimal configuration.

### Features

- **Multiple Authentication Methods**:
  - Email and password authentication
  - Social providers (Google configured by default)
  - Anonymous authentication

- **Session Management**:
  - Secure cookie-based sessions
  - Configurable session duration
  - Cookie cache for improved performance

- **Role-Based Access Control**:
  - `verifyToken` middleware for session validation
  - `requireRole` middleware for specific role requirements
  - `requireAnyRole` middleware for flexible role requirements

- **Security Features**:
  - Rate limiting to prevent brute force attacks
  - CSRF protection
  - Secure cookie settings
  - Trusted origins configuration

- **Database Integration**:
  - Seamless integration with Drizzle ORM
  - Automatic schema handling

### Auth Configuration

The authentication system is configured in `src/utils/auth.ts` with the following settings:

```typescript
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  plugins: [admin(), anonymous()],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  // Additional configuration...
});
```

### Auth Endpoints

better-auth automatically provides the following endpoints:

| Method | Endpoint                   | Description                       | Authentication |
|--------|----------------------------|-----------------------------------|----------------|
| POST   | /api/auth/register         | Register a new user               | Not Required   |
| POST   | /api/auth/login            | Login with email and password     | Not Required   |
| POST   | /api/auth/providers/google | Login with Google                 | Not Required   |
| GET    | /api/auth/session          | Get current session information   | Not Required   |
| POST   | /api/auth/signout          | Sign out and invalidate session   | Required       |

## Best Practices

This starter follows these best practices:

1. **Separation of Concerns**: Clear separation between controllers, repositories, and routes
2. **Repository Pattern**: Data access logic is isolated in repositories
3. **Error Handling**: Centralized error handling with custom error classes
4. **Validation**: Request validation using middleware
5. **Security**: Implementation of security best practices with Helmet
6. **Type Safety**: Full TypeScript support throughout the application
7. **AWS Integration**: Support for AWS services with proper configuration
8. **Database Migrations**: Structured approach to database schema changes with Drizzle Kit

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
