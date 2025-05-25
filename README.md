# Next.js + Hono + Better Auth - Decoupled Architecture

<table align="center">
<tr>
<td>
<img src="./next.svg" alt="Nextjs" width="100"  height="auto"/>
</td>
<td>
<img src="./hono.png" alt="Nextjs" width="100"  height="auto"/>
</td>
</tr>
</table>

<div align="center">
  <h3>🚀 Full-Stack Decoupled Authentication System</h3>
  <p>A modern, scalable architecture separating frontend and backend concerns</p>
</div>

## 🌟 Overview

This project demonstrates how to build a **decoupled architecture** using:

-   **Next.js** for the frontend (what users see)
-   **Hono** for the backend (authentication and API logic)
-   **Better Auth** for secure cross-domain authentication
-   **Prisma** for database management

### Why Decoupled Architecture?

✅ **Scalability** - Same backend can serve multiple frontends  
✅ **Maintainability** - Clear separation of concerns  
✅ **Flexibility** - Easy to add mobile apps, admin panels, etc.  
✅ **Cross-domain Authentication** - Secure auth across different domains

## 🏗️ Project Structure

```
├── frontend-user/          # Next.js frontend application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # Auth client configuration
│   │   └── actions/        # Server actions
│   └── package.json
│
├── hono-backend/           # Hono backend server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── lib/            # Auth configuration & utilities
│   │   ├── generated/      # Prisma generated client
│   │   └── prisma/         # Database schema
│   └── package.json
│
├── next.svg                # Next.js logo
├── hono.png               # Hono logo
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+ or Bun
-   PostgreSQL database (local or cloud like Neon)
-   Git

### 1. Clone the Repository

```bash
git clone https://github.com/aswnss-m/nextjs-hono-better-auth-decoupled.git
cd nextjs-hono-better-auth-decoupled
```

### 2. Setup Backend

```bash
cd hono-backend
bun install                    # or npm install
cp .env.example .env          # Copy environment template
# Edit .env with your database credentials
bun prisma migrate dev        # Setup database
bun prisma generate          # Generate Prisma client
bun dev                      # Start backend on port 5000
```

### 3. Setup Frontend

```bash
cd ../frontend-user
bun install                   # or npm install
cp .env.local.example .env.local  # Copy environment template
# Edit .env.local with backend URL
bun dev                      # Start frontend on port 3000
```

### 4. Access the Application

-   **Frontend**: http://localhost:3000
-   **Backend API**: http://localhost:5000

## 🔐 Authentication Features

-   **Email/Password Registration** - Secure user signup
-   **Login/Logout** - Session management with cookies
-   **Protected Routes** - Server and client-side route protection
-   **Cross-Domain Cookies** - Secure authentication across domains
-   **Role-Based Access** - User roles (USER, ADMIN, SUPERADMIN)
-   **Session Caching** - Optimized performance with cookie cache

## 🛠️ Tech Stack

### Backend (Hono)

-   **Hono** - Lightweight web framework
-   **Better Auth** - Modern authentication library
-   **Prisma** - Type-safe database ORM
-   **PostgreSQL** - Reliable database
-   **TypeScript** - Type safety

### Frontend (Next.js)

-   **Next.js 14** - React framework with App Router
-   **React** - UI library
-   **TypeScript** - Type safety
-   **Tailwind CSS** - Utility-first styling
-   **Better Auth React** - Frontend auth hooks

## 📚 Key Concepts

### Decoupled Architecture

The frontend and backend are completely separate applications that communicate via HTTP APIs. This enables:

-   Independent scaling and deployment
-   Multiple frontends sharing the same backend
-   Clear separation of concerns

### Cross-Domain Authentication

Using Better Auth's advanced cookie configuration:

```typescript
defaultCookieAttributes: {
  sameSite: "none",
  httpOnly: true,
  secure: true,
  partitioned: true,
}
```

### Protected API Routes

Backend routes are protected using session validation:

```typescript
const session = await auth.api.getSession({
	headers: c.req.raw.headers,
});

if (!session || !session.user) {
	return c.json({ message: "Not Authenticated" });
}
```

## 🔧 Environment Configuration

### Backend (.env)

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
PORT=5000
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:5000"
```

### Frontend (.env.local)

```bash
BACKEND_URL="http://localhost:5000"
```

## 📖 Usage Examples

### Client-Side Authentication

```typescript
// Login
const { data, error } = await authClient.signIn.email({
	email: "user@example.com",
	password: "password123",
});

// Get current session
const { data: session } = authClient.useSession();

// Logout
await authClient.signOut();
```

### Protected API Calls

```typescript
// Server Action
const res = await fetch("http://localhost:5000/api/protected", {
	headers: {
		cookie: cookies().toString(),
	},
});

// Client-side
const res = await fetch("http://localhost:5000/api/protected", {
	credentials: "include",
});
```

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd hono-backend
bun test

# Frontend tests
cd frontend-user
bun test
```

### Database Management

```bash
# Reset database
bun prisma migrate reset

# View database
bun prisma studio

# Generate new migration
bun prisma migrate dev --name migration_name
```

## 🚀 Deployment

### Backend Deployment

-   Deploy to Vercel, Railway, or any Node.js hosting
-   Set environment variables
-   Run database migrations

### Frontend Deployment

-   Deploy to Vercel, Netlify, or similar
-   Update BACKEND_URL to production backend
-   Configure domain for cookies

## 🔮 Future Enhancements

-   [ ] Social authentication (Google, GitHub)
-   [ ] Email verification
-   [ ] Password reset functionality
-   [ ] Rate limiting
-   [ ] Admin dashboard
-   [ ] Mobile app with same backend
-   [ ] Real-time features with WebSockets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   [Better Auth](https://better-auth.com) for the amazing authentication library
-   [Hono](https://hono.dev) for the lightweight web framework
-   [Prisma](https://prisma.io) for the excellent ORM
-   [Next.js](https://nextjs.org) for the powerful React framework

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/aswnss-m">aswnss-m</a></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>

