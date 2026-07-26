# Career OS — Deployment Guide

Deploy Career OS to production.

---

## Deployment Options

| Option | Complexity | Cost | Best For |
|---|---|---|---|
| [Vercel](#vercel) | Easy | Free → paid | Most users |
| [Docker](#docker) | Medium | Self-hosted | Teams, private |
| [Node Server](#node-server) | Medium | Self-hosted | VPS, bare metal |

---

## Prerequisites for All Deployments

Before deploying, ensure you have:

1. **PostgreSQL database** (Neon, Supabase, Railway, or self-hosted)
2. **NEXTAUTH_SECRET** (generate: `openssl rand -base64 32`)
3. **OAuth credentials** (GitHub and/or Google)
4. **AI provider keys** (at minimum, one for server-side fallback)

---

## Vercel

Vercel is the recommended deployment platform for Next.js applications.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/karthikrshet/Career-Agents)

### Manual Deploy

**Step 1: Import the Repository**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `karthikrshet/Career-Agents` from GitHub
3. Set **Root Directory** to `apps/web`
4. Framework: **Next.js** (auto-detected)

**Step 2: Configure Environment Variables**

In Vercel project settings → Environment Variables, add:

```env
# Required
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.vercel.app

# OAuth
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Database
DATABASE_URL=postgresql://...

# AI Providers (server-side fallbacks)
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...

# Feature flags
NEXT_PUBLIC_ENABLE_MCP=true
NEXT_PUBLIC_ENABLE_MARKETPLACE=true
NEXT_PUBLIC_ENABLE_REPORTS=true
```

**Step 3: Set Up Database**

```bash
# From apps/web/ locally, with your production DATABASE_URL
npx prisma migrate deploy
```

**Step 4: Deploy**

Click **Deploy**. Vercel will:
1. Run `npm install`
2. Run `next build` (from `apps/web/`)
3. Deploy the serverless Next.js app

**Step 5: Update OAuth Callbacks**

Update your OAuth app callback URLs to use your Vercel deployment URL:
- GitHub: `https://your-app.vercel.app/api/auth/callback/github`
- Google: `https://your-app.vercel.app/api/auth/callback/google`

Also update `NEXTAUTH_URL` to match your production URL.

### Custom Domain on Vercel

In Vercel project → Settings → Domains, add your custom domain and follow DNS configuration instructions.

---

## Docker

### Dockerfile

Create `apps/web/Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Build
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Run
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run

```bash
cd apps/web

# Build image
docker build -t career-os .

# Run container
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e DATABASE_URL="postgresql://..." \
  -e GROQ_API_KEY="gsk_..." \
  career-os
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build:
      context: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/career_os
      - GROQ_API_KEY=${GROQ_API_KEY}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=career_os
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

volumes:
  postgres_data:
```

Run:
```bash
docker compose up -d
```

### Initialize Database with Docker

```bash
docker compose exec app npx prisma db push
```

---

## Node Server

For deployment on a VPS (DigitalOcean, Hetzner, Linode, AWS EC2):

### Step 1: Server Setup

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pm2 (process manager)
npm install -g pm2
```

### Step 2: Clone and Build

```bash
git clone https://github.com/karthikrshet/Career-Agents.git
cd Career-Agents/apps/web

# Create production .env
cp .env.example .env
nano .env  # fill in production values

# Install and build
npm install
npm run build
```

### Step 3: Database Setup

```bash
npx prisma migrate deploy
```

### Step 4: Start with PM2

```bash
# Start the app
pm2 start npm --name "career-os" -- start

# Auto-start on server reboot
pm2 startup
pm2 save
```

### Step 5: Configure Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 6: SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] App loads at the production URL
- [ ] Sign-in with GitHub/Google works
- [ ] AI provider settings can be saved
- [ ] Resume upload and analysis works
- [ ] GitHub analyzer returns real data
- [ ] Interview session generates questions
- [ ] Security headers are present (check with [securityheaders.com](https://securityheaders.com))
- [ ] HTTPS is enforced
- [ ] OAuth callback URLs match the production domain

---

## Environment Variables Summary

See the complete environment variable reference in [INSTALL.md](./INSTALL.md#3-environment-variables).

**Critical for production:**
```env
NEXTAUTH_SECRET=<random 32-byte base64>
NEXTAUTH_URL=https://your-production-domain.com
DATABASE_URL=postgresql://...
```

**Never use development defaults in production.** Always generate new secrets.
