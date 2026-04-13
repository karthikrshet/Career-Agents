# Career OS — Configuration Guide

This guide covers the configurations available in Career OS, including features, next.config.js structure, next-auth setup, client-side options, and app personalization.

---

## next.config.js Configuration

The Next.js configuration (`apps/web/next.config.js`) defines compilation rules, rewrites, and security headers:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Custom headers including Content Security Policy
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://avatars.githubusercontent.com https://github.com https://raw.githubusercontent.com; connect-src 'self' https://api.github.com https://generativelanguage.googleapis.com https://api.anthropic.com https://api.openai.com https://api.groq.com https://api.together.xyz https://openrouter.ai https://api.mistral.ai https://api.cohere.com https://api.deepseek.com https://api.x.ai https://api.azure.com https://www.google-analytics.com; worker-src 'self' blob:; frame-ancestors 'none';"
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          }
        ]
      }
    ];
  }
};

// NextJS Web Configuration
module.exports = nextConfig;
```

---

## Client-Side Persistence Configuration

Career OS is built to persist user state using Zustand's `persist` middleware. By default, it serializes and saves the following store slices to `localStorage` under the key `career-os-store`:

```typescript
// apps/web/src/lib/store.ts
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // State definitions
      profile: null,
      metrics: {
        careerScore: 0,
        resumeScore: 0,
        githubScore: 0,
        linkedinScore: 0,
        interviewScore: 0,
        applicationScore: 0,
      },
      resumeAnalysis: null,
      GitHubAnalysis: null,
      linkedinAnalysis: null,
      interviewSessions: [],
      jobApplications: [],
      copilotSessions: [],
      // Actions...
    }),
    {
      name: 'career-os-store',
      partialize: (state) => ({
        profile: state.profile,
        metrics: state.metrics,
        resumeAnalysis: state.resumeAnalysis,
        GitHubAnalysis: state.GitHubAnalysis,
        linkedinAnalysis: state.linkedinAnalysis,
        interviewSessions: state.interviewSessions,
        jobApplications: state.jobApplications,
        copilotSessions: state.copilotSessions,
        settings: state.settings,
        installedPlugins: state.installedPlugins,
        enabledPlugins: state.enabledPlugins,
      }),
    }
  )
);
```

---

## Feature Flags Configuration

Career OS supports runtime feature flags controlled by environment variables. Add these flags to your `.env` file to customize the active subsystems:

### `NEXT_PUBLIC_ENABLE_MCP`
- **Default:** `true`
- **Behavior:** Controls the visibility and functionality of the Model Context Protocol (MCP) integrations tab and setup instructions.

### `NEXT_PUBLIC_ENABLE_MARKETPLACE`
- **Default:** `true`
- **Behavior:** Enables or disables the Plugin Marketplace section in the sidebar. When disabled, users cannot install or manage plugins.

### `NEXT_PUBLIC_ENABLE_REPORTS`
- **Default:** `true`
- **Behavior:** Controls the availability of Career Reports compilation and document downloads.

### `NEXT_PUBLIC_ENABLE_TELEMETRY`
- **Default:** `false`
- **Behavior:** Enables optional, anonymous user activity tracking for performance analysis.

---

## PWA and Service Worker Configuration

The Progressive Web App (PWA) configuration is handled in two files:

1. **Manifest File** (`apps/web/public/manifest.webmanifest`):
   Defines the home screen metadata, shortcuts, icons, and theme configuration when installed on a mobile device or desktop.

2. **Root Layout** (`apps/web/src/app/layout.tsx`):
   Registers the service worker in the client's browser for offline support and background synchronization:
   ```typescript
   useEffect(() => {
     if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
       window.addEventListener('load', () => {
         navigator.serviceWorker.register('/sw.js').then(
           (registration) => console.log('SW registered: ', registration),
           (registrationError) => console.log('SW registration failed: ', registrationError)
         );
       });
     }
   }, []);
   ```

---

## NextAuth.js Authentication Options

NextAuth configuration handles session verification, login routes, and OAuth callbacks:

```typescript
// apps/web/src/lib/auth.ts
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
};
```

---

## Application Personalization

You can brand Career OS by changing default parameters in `apps/web/src/lib/utils.ts` and the UI:

- **App Name:** Customize `NEXT_PUBLIC_APP_NAME` in `.env` (Defaults to `Career OS`).
- **Version Number:** Controlled by `NEXT_PUBLIC_APP_VERSION` (Defaults to `2.0.0` or package version).
- **Default Theme:** Dark mode configuration is default. Customize global styles in `apps/web/src/app/globals.css`.
