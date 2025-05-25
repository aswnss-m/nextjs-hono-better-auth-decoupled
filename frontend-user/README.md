# Next.js Frontend - User Interface

<div align="center">
  <img src="../next.svg" alt="Next.js" width="150" height="auto"/>
  <h3>⚡ Modern React Frontend</h3>
  <p>Next.js 15 with App Router and Better Auth integration</p>
</div>

## 🚀 Overview

This is the frontend component of our decoupled architecture, built with **Next.js 14** using the App Router. It provides:

- User authentication interface (login, register, logout)
- Protected pages and routes
- Server-side and client-side authentication
- Modern React patterns with hooks
- Responsive design with Tailwind CSS

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Modern React with concurrent features
- **TypeScript** - Full type safety
- **Better Auth React** - Authentication hooks and utilities
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **shadcn/ui** - High-quality UI components

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── profile/             # Protected profile page
│   ├── client-profile/      # Client-side protected page
│   ├── message/             # API interaction example
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── sign-out.tsx         # Logout component
│   └── ...                  # Other reusable components
├── lib/
│   ├── auth.ts              # Auth client configuration
│   └── utils.ts             # Utility functions
└── actions/
    └── message.ts           # Server actions
```

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Backend server running on port 5000
- Package manager (bun/npm/yarn)

### 1. Install Dependencies

```bash
bun install
# or
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Backend API URL
BACKEND_URL="http://localhost:5000"

# Optional: Enable Next.js debugging
NEXT_DEBUG=true
```

### 3. Start Development Server

```bash
bun dev
# or
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔧 Authentication Configuration

### Auth Client Setup

The `src/lib/auth.ts` file configures the Better Auth client:

```typescript
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${process.env.BACKEND_URL}/api/auth`,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
});
```

### Environment Variables

The client automatically reads from environment variables:
- `BACKEND_URL` - URL of your Hono backend server

## 🔐 Authentication Features

### User Registration

```typescript
// Registration form submit
async function onSubmit(values: FormData) {
  const { data: session, error } = await authClient.signUp.email({
    email: values.email,
    password: values.password,
    name: `${values.firstName} ${values.lastName}`,
  });

  if (error) {
    console.error('Registration failed:', error);
    return;
  }

  // User is automatically logged in after successful registration
  router.push('/profile');
}
```

### User Login

```typescript
// Login form submit
async function onSubmit(values: FormData) {
  const { data: session, error } = await authClient.signIn.email({
    email: values.email,
    password: values.password,
  });

  if (error) {
    console.error('Login failed:', error);
    return;
  }

  router.push('/profile');
}
```

### User Logout

```typescript
// Logout component
export default function SignOut() {
  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  return (
    <Button onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
```

## 🛡️ Route Protection

### Server-Side Protection

Protected pages using Server Components:

```typescript
// app/profile/page.tsx
import { headers } from "next/headers";
import { redirect } from 'next/navigation';
import { authClient } from "@/lib/auth";

export default async function ProfilePage() {
  // Check authentication on server
  const { data: session, error } = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  if (error) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
```

### Client-Side Protection

Protected pages using Client Components:

```typescript
// app/client-profile/page.tsx
"use client"
import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ClientProfilePage() {
  const router = useRouter();
  const { data: session, error, isPending } = authClient.useSession();

  // Redirect if not authenticated
  if (!isPending && error) {
    router.push('/login');
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Client-Side Protected Page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
```

## 🌐 API Integration

### Server Actions

Making authenticated requests using Server Actions:

```typescript
// app/actions/message.ts
"use server";
import { cookies } from "next/headers";

export async function getProtectedMessage() {
  const cookie = await cookies();
  
  const res = await fetch(`${process.env.BACKEND_URL}/api/message`, {
    method: "POST",
    headers: {
      cookie: cookie.toString(),
    },
  });

  if (!res.ok) {
    return {
      data: null,
      error: "Failed to fetch message",
    };
  }

  const data = await res.json();
  return {
    data,
    error: null,
  };
}
```

### Client-Side API Calls

Making authenticated requests from Client Components:

```typescript
// Client component
const getMessage = async () => {
  const res = await fetch(`${process.env.BACKEND_URL}/api/message`, {
    method: "POST",
    credentials: "include", // Include cookies
  });

  if (!res.ok) {
    console.error('API call failed:', res.statusText);
    return;
  }

  const data = await res.json();
  console.log('Response:', data);
};
```

## 🎨 UI Components

### Authentication Forms

The project uses shadcn/ui components for consistent styling:

```typescript
// Login form example
<Card className="w-full max-w-md">
  <CardHeader>
    <CardTitle>Sign In</CardTitle>
    <CardDescription>
      Enter your email and password to access your account
    </CardDescription>
  </CardHeader>
  <CardContent>
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </div>
    </form>
  </CardContent>
</Card>
```

### Loading States

```typescript
// Loading component
{isPending ? (
  <div className="flex flex-col gap-2 items-center">
    <Loader2 className="animate-spin" />
    <p>Loading your session...</p>
  </div>
) : (
  <UserContent />
)}
```

## 🎯 Page Examples

### Home Page (`/`)
- Landing page with navigation to auth pages
- Shows authentication status
- Links to protected routes

### Login Page (`/login`)
- Email/password login form
- Form validation
- Error handling
- Redirect after successful login

### Register Page (`/register`)
- User registration form
- Name, email, password fields
- Automatic login after registration

### Profile Pages (`/profile`, `/client-profile`)
- Display user session information
- Server-side and client-side protection examples
- Logout functionality

### Message Page (`/message`)
- Example of authenticated API calls
- Server actions and client-side fetch examples

## 🔧 Development

### Adding New Pages

1. Create page component in `app/` directory
2. Add authentication if needed
3. Update navigation

```typescript
// app/new-page/page.tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
```

### Adding New Components

1. Create component in `components/` directory
2. Export from `components/index.ts` (if using barrel exports)

```typescript
// components/my-component.tsx
interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return <h1>{title}</h1>;
}
```

### Styling

The project uses Tailwind CSS for styling:

```typescript
// Example with Tailwind classes
<div className="flex items-center justify-center min-h-screen bg-gray-50">
  <Card className="w-full max-w-md shadow-lg">
    <CardContent className="p-6">
      {/* Content */}
    </CardContent>
  </Card>
</div>
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
bun test
# or
npm test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test auth.test.ts
```

### Testing Authentication

```typescript
// Example test
import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/login/page';

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
```

## 🚀 Production Build

### Building for Production

```bash
# Create production build
bun build
# or
npm run build

# Start production server
bun start
# or
npm start
```

### Environment Variables

Set these in your production environment:

```bash
BACKEND_URL="https://your-backend-domain.com"
```

### Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Build command
npm run build

# Publish directory
.next
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### Next.js Config

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### TypeScript Config

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

## 🎨 UI Component Library

### shadcn/ui Components

The project uses shadcn/ui for consistent, accessible components:

```bash
# Add new shadcn/ui components
bun x shadcn-ui@latest add button
bun x shadcn-ui@latest add card
bun x shadcn-ui@latest add input
bun x shadcn-ui@latest add label
```

### Custom Component Examples

```typescript
// components/auth-guard.tsx
"use client"
import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const router = useRouter();
  const { data: session, error, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && error) {
      router.push(redirectTo);
    }
  }, [isPending, error, redirectTo, router]);

  if (isPending) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  if (error) {
    return null;
  }

  return <>{children}</>;
}
```

```typescript
// components/user-avatar.tsx
import { authClient } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar() {
  const { data: session } = authClient.useSession();

  if (!session?.user) return null;

  return (
    <Avatar>
      <AvatarImage src={session.user.image} alt={session.user.name} />
      <AvatarFallback>
        {session.user.name
          ?.split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
```

## 🔍 Debugging

### Common Authentication Issues

1. **Session not persisting**
   - Check if cookies are being sent with requests
   - Verify `credentials: "include"` in fetch calls
   - Check CORS configuration

2. **Redirect loops**
   - Ensure protected routes don't redirect to themselves
   - Check authentication state before redirecting

3. **TypeScript errors**
   - Run `bun x @better-auth/cli@latest generate` to update types
   - Check if auth client is properly configured

### Debug Tools

```typescript
// Enable debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('Auth client config:', authClient);
}

// Log session state
const { data: session, error, isPending } = authClient.useSession();
console.log('Session state:', { session, error, isPending });
```

### Network Debugging

```typescript
// Log all fetch requests
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  console.log('Fetch request:', args);
  const response = await originalFetch(...args);
  console.log('Fetch response:', response);
  return response;
};
```

## 📱 Mobile Responsiveness

The frontend is built with mobile-first design:

```typescript
// Responsive layout example
<div className="container mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <Card className="w-full">
      {/* Card content */}
    </Card>
  </div>
</div>
```

### Responsive Navigation

```typescript
// components/navigation.tsx
"use client"
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Your App</h1>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4">
            <a href="/" className="text-gray-700 hover:text-gray-900">Home</a>
            <a href="/profile" className="text-gray-700 hover:text-gray-900">Profile</a>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 text-gray-700">Home</a>
              <a href="/profile" className="block px-3 py-2 text-gray-700">Profile</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
```

## 🚀 Performance Optimization

### Code Splitting

```typescript
// Lazy load components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/heavy-component'), {
  loading: () => <p>Loading...</p>,
});
```

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/profile-picture.jpg"
  alt="Profile Picture"
  width={100}
  height={100}
  className="rounded-full"
  priority // For above-the-fold images
/>
```

### Caching Strategies

```typescript
// app/profile/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProfilePage() {
  // This page will be cached and revalidated
}
```

## 🐛 Troubleshooting

### Common Issues

**Authentication not working**
- Check if backend is running on correct port
- Verify `BACKEND_URL` environment variable
- Check browser cookies in developer tools

**Pages not protected**
- Ensure auth check is implemented correctly
- Check if `authClient.useSession()` is used properly
- Verify redirect logic

**Styling issues**
- Check if Tailwind CSS is properly configured
- Verify component imports from shadcn/ui
- Check CSS classes are applied correctly

**Build errors**
- Run `bun lint` to check for linting errors
- Verify all imports are correct
- Check TypeScript errors with `bun type-check`

### Debug Commands

```bash
# Check Next.js build
bun build

# Run linting
bun lint

# Type check
bun type-check

# Analyze bundle size
bun analyze
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing code style
4. Add tests for new features
5. Submit a pull request

### Code Style Guidelines

- Use TypeScript for all components
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>⚡ Fast • 🎨 Beautiful • 🔐 Secure</p>
  <p>Built with Next.js and Better Auth</p>
</div>