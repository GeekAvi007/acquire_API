# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Environment Setup
- **Install dependencies**: `npm install`
- **Run in development**: `npm run dev` (uses Node.js --watch for auto-restart)
- **Database setup**: Ensure `DATABASE_URL` environment variable is set for Neon PostgreSQL

### Code Quality
- **Lint code**: `npm run lint`
- **Fix linting issues**: `npm run lint:fix`
- **Format code**: `npm run format`
- **Check formatting**: `npm run format:check`

### Database Management
- **Generate migrations**: `npm run db:generate` (creates SQL files in `/drizzle`)
- **Run migrations**: `npm run db:migrate`
- **Open Drizzle Studio**: `npm run db:studio` (database GUI)

## Architecture Overview

### Tech Stack
- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL via Neon Database with Drizzle ORM
- **Authentication**: JWT with secure HTTP-only cookies
- **Validation**: Zod schemas
- **Logging**: Winston with file and console transports

### Application Structure

The codebase follows a layered architecture pattern with clear separation of concerns:

**Entry Point Flow**:
```
index.js → server.js → app.js
```

**Layer Architecture**:
- **Routes** (`/routes`): Define API endpoints and route parameters
- **Controllers** (`/controllers`): Handle HTTP requests/responses and orchestrate business logic
- **Services** (`/services`): Implement core business logic and database operations
- **Models** (`/models`): Define Drizzle ORM schemas for database tables
- **Validations** (`/validations`): Zod schemas for request validation
- **Utils** (`/utils`): Shared utilities (JWT, cookies, formatting)
- **Config** (`/config`): Configuration modules (database, logger)

### Import Path Mapping
The project uses Node.js import maps for clean imports:
```javascript
#config/*     → ./src/config/*
#controllers/* → ./src/controllers/*
#middlewares/* → ./src/middlewares/*
#models/*     → ./src/models/*
#routes/*     → ./src/routes/*
#services/*   → ./src/services/*
#utils/*      → ./src/utils/*
#validations/* → ./src/validations/*
```

### Database Design
- **ORM**: Drizzle with Neon PostgreSQL serverless driver
- **Migration System**: SQL-first migrations in `/drizzle` directory
- **Schema Location**: `src/models/*.js` files define table schemas
- **Current Schema**: `users` table with authentication fields

### Authentication System
- **Strategy**: JWT tokens stored in secure HTTP-only cookies
- **Cookie Settings**: 
  - `httpOnly: true` (prevents XSS)
  - `secure: true` in production
  - `sameSite: 'strict'`
  - 15-minute expiration (`maxAge: 15 * 60 * 1000`)
- **Password Security**: bcrypt hashing with salt rounds of 10

### Logging Architecture
- **Winston Logger**: Structured JSON logging
- **File Outputs**: 
  - `log/error.log` (errors only)
  - `logs/combined.log` (all levels)
- **Development**: Additional colorized console output
- **HTTP Logging**: Morgan middleware integrated with Winston

### API Structure
Currently implements authentication endpoints:
- `POST /api/auth/sign-up` - User registration (fully implemented)
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)

### Code Style
- **ESLint**: 2-space indentation, single quotes, semicolons required
- **Prettier**: Consistent formatting with trailing commas (ES5)
- **Arrow Functions**: Preferred over traditional functions
- **Const/Let**: No `var` usage allowed

## Development Notes

### Environment Variables Required
- `DATABASE_URL`: Neon PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing (defaults to 'secret-key')
- `NODE_ENV`: Environment setting (affects logging and cookie security)
- `PORT`: Server port (defaults to 3000)
- `LOG_LEVEL`: Winston log level (defaults to 'info')

### Testing Endpoints
- **Health Check**: `GET /health` - Returns server status and uptime
- **Root**: `GET /` - Simple hello response
- **API Status**: `GET /api` - API status message

### Database Schema Evolution
When modifying `src/models/*.js` files:
1. Run `npm run db:generate` to create migration files
2. Review generated SQL in `/drizzle` directory
3. Run `npm run db:migrate` to apply changes
4. Use `npm run db:studio` to verify schema changes

### Error Handling Pattern
- Services throw specific errors (e.g., "User with this Email already exists")
- Controllers catch and transform errors to appropriate HTTP responses
- Winston logger captures all errors with context
- Validation errors use Zod's detailed error formatting via `formatValidationErrors` utility