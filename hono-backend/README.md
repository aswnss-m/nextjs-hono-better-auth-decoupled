# Hono Backend - Authentication Server

<div align="center">
  <img src="../hono.png" alt="Hono" width="150" height="auto" />
  <h3>🔐 Secure Authentication Backend</h3>
  <p>Lightweight Hono server with Better Auth integration</p>
</div>

## 🚀 Overview

This is the backend component of our decoupled architecture, built with **Hono** - a fast, lightweight web framework. It handles:

- User authentication (register, login, logout)
- Session management with secure cookies
- Protected API routes
- Cross-domain authentication
- Role-based access control

## 🛠️ Tech Stack

- **Hono** - Ultra-fast web framework
- **Better Auth** - Modern authentication solution
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Production-ready database
- **TypeScript** - Full type safety
- **Bun** - Fast JavaScript runtime (optional, works with Node.js too)

## 📁 Project Structure

```
src/
├── lib/
│   ├── auth.ts              # Better Auth configuration
│   └── prismaClient.ts      # Database client setup
├── routes/
│   ├── auth.ts              # Authentication routes
│   └── message.ts           # Example protected routes
├── generated/
│   └── prisma/              # Generated Prisma client
├── prisma/
│   └── schema.prisma        # Database schema
└── index.ts                 # Main server entry point
```

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Package manager (bun/npm/yarn)

### 1. Install Dependencies

```bash
bun install
# or
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Server
PORT=5000

# Better Auth
BETTER_AUTH_SECRET="your-super-secret-key-here"
BETTER_AUTH_URL="http://localhost:5000"
```

> 🔐 **Security Note**: Generate a strong random secret for `BETTER_AUTH_SECRET`

### 3. Database Setup

```bash
# Initialize Prisma
bun prisma init

# Generate Better Auth schema
bun x @better-auth/cli@latest generate

# Run database migrations
bun prisma migrate dev

# Generate Prisma client
bun prisma generate
```

### 4. Start Development Server

```bash
bun dev
# or
npm run dev
```

The server will start on `http://localhost:5000`

## 🔧 Configuration

### Better Auth Configuration

The `src/lib/auth.ts` file contains the main authentication configuration:

```typescript
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  // Enable email/password authentication
  emailAndPassword: {
    enabled: true,
  },
  
  // Cross-domain cookie configuration
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      httpOnly: true,
      secure: true,
      partitioned: true,
    },
  },
  
  // Trusted origins for CORS
  trustedOrigins: ["http://localhost:3000"],
  
  // Session caching for performance
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  
  // User roles
  user: {
    additionalFields: {
      role: {
        type: "string",
        enum: ["USER", "ADMIN", "SUPERADMIN"],
        defaultValue: "USER",
        required: false,
      },
    },
  },
});
```

### Database Schema

The generated Prisma schema includes:

```prisma
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean
  image         String?
  role          Role?     // USER | ADMIN | SUPERADMIN
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  // ... other fields
}
```

## 🛡️ API Routes

### Authentication Routes

All authentication routes are handled automatically by Better Auth:

- `POST /api/auth/sign-up/email` - User registration
- `POST /api/auth/sign-in/email` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session

### Protected Routes Example

```typescript
// src/routes/message.ts
router.post("/", async (c) => {
  // Verify session
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session || !session.user) {
    return c.json({
      error: "Not authenticated"
    }, 401);
  }

  // Route logic for authenticated users
  return c.json({
    message: "Hello authenticated user!",
    user: session.user
  });
});
```

### CORS Configuration

```typescript
app.use("*", cors({
  origin: ["http://localhost:3000"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  credentials: true, // Important for cookies
}));
```

## 🔐 Authentication Flow

### User Registration

```bash
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### User Login

```bash
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Session Verification

```bash
GET /api/auth/session
Cookie: better-auth.session_token=...
```

## 🗄️ Database Commands

### Common Prisma Commands

```bash
# View database in browser
bun prisma studio

# Reset database (⚠️ Deletes all data)
bun prisma migrate reset

# Create new migration
bun prisma migrate dev --name migration_name

# Generate client after schema changes
bun prisma generate

# Seed database (if seed file exists)
bun prisma db seed
```

### Schema Updates

When updating the user model or authentication fields:

1. Modify `src/lib/auth.ts`
2. Run `bun x @better-auth/cli@latest generate`
3. Update the generated schema if needed
4. Run `bun prisma migrate dev`

## 🧪 Testing

### Manual API Testing

Use tools like curl, Postman, or Insomnia:

```bash
# Test registration
curl -X POST http://localhost:5000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test protected route
curl -X POST http://localhost:5000/api/message \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN_HERE"
```

### Health Check

```bash
curl http://localhost:5000/
# Should return: "Hello Hono!"
```

## 🚀 Production Deployment

### Environment Variables

Set these in your production environment:

```bash
DATABASE_URL="your-production-database-url"
BETTER_AUTH_SECRET="your-production-secret"
BETTER_AUTH_URL="https://your-backend-domain.com"
PORT=5000
```

### Deployment Platforms

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway deploy
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔧 Development Tips

### Adding New Routes

1. Create route file in `src/routes/`
2. Import and add to `api_routes` in `index.ts`

```typescript
// src/routes/users.ts
const router = new Hono<{ Variables: AuthType }>()
  .basePath("/users");

router.get("/", async (c) => {
  // Route logic
});

export default router;
```

### Error Handling

```typescript
router.post("/", async (c) => {
  try {
    // Route logic
  } catch (error) {
    console.error('Route error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
```

### Logging

```typescript
import { logger } from 'hono/logger';

app.use('*', logger());
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running
- Verify credentials and database exists

**CORS Errors**
- Add frontend URL to `trustedOrigins`
- Check CORS middleware configuration
- Ensure `credentials: true` in frontend requests

**Authentication Not Working**
- Verify `BETTER_AUTH_SECRET` is set
- Check cookie configuration
- Ensure frontend and backend URLs match

**Prisma Issues**
- Run `bun prisma generate` after schema changes
- Check database connection
- Verify migration status with `bun prisma migrate status`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>🔐 Secure • ⚡ Fast • 🛠️ Developer Friendly</p>
</div>