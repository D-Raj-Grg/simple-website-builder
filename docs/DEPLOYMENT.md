# Deployment Guide

Complete guide for deploying QuickPage Builder to production.

## Quick Deploy Options

### Vercel (Recommended)

**One-Click Deploy:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/quickpage-builder)

**Manual Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow prompts to configure
```

**Configuration:**
- **Framework Preset**: Next.js
- **Build Command**: `pnpm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `pnpm install`

### Netlify

**One-Click Deploy:**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/quickpage-builder)

**Manual Deploy:**
```bash
# Build the project
pnpm run build
pnpm run export

# Deploy the out/ directory to Netlify
```

**Configuration:**
- **Base Directory**: `/`
- **Build Command**: `pnpm run build && pnpm run export`
- **Publish Directory**: `out`
- **Node Version**: `20`

### Docker

**Build Image:**
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000
CMD ["pnpm", "start"]
```

**Deploy:**
```bash
# Build image
docker build -t quickpage-builder .

# Run container
docker run -p 3000:3000 quickpage-builder
```

---

## Prerequisites

### System Requirements

**Node.js:**
- **Version**: 20+ LTS
- **Package Manager**: pnpm 8+ (required)
- **Memory**: 2GB RAM minimum
- **Storage**: 1GB free space

**Browser Support:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Environment Setup

**Development Environment:**
```bash
# Clone repository
git clone https://github.com/your-username/quickpage-builder.git
cd quickpage-builder

# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open http://localhost:3000/editor
```

**Environment Variables:**
```bash
# .env.local (optional - all features work without these)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

---

## Production Build

### Build Process

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Run production build
pnpm run build

# Test production build locally
pnpm run start
```

### Build Outputs

**Standard Next.js Build (.next/):**
- Server-side rendered pages
- Static assets and chunks
- API routes (if implemented)
- Optimized images and fonts

**Static Export (out/):**
```bash
# Generate static export
pnpm run build
pnpm run export

# Outputs to out/ directory
# Can be served by any static host
```

### Bundle Analysis

```bash
# Analyze bundle size
pnpm run build
pnpm run analyze

# Opens webpack-bundle-analyzer
# View at http://localhost:8888
```

**Performance Targets:**
- **Total Bundle**: < 200KB
- **First Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Lighthouse Score**: > 95

---

## Hosting Platforms

### Static Hosting

**Vercel (Recommended)**
- ✅ Zero configuration
- ✅ Automatic deployments
- ✅ Edge functions support
- ✅ Built-in analytics
- ✅ Custom domains

**Netlify**
- ✅ Easy static exports
- ✅ Form handling
- ✅ Branch previews
- ✅ Edge functions
- ⚠️ Requires build configuration

**AWS S3 + CloudFront**
- ✅ High scalability
- ✅ Global CDN
- ✅ Cost effective
- ⚠️ Manual setup required

**GitHub Pages**
- ✅ Free for public repos
- ✅ Automatic deployments
- ⚠️ Limited to static exports
- ⚠️ No server-side features

### Server Hosting

**Railway**
```bash
# Deploy to Railway
npm install -g @railway/cli
railway login
railway init
railway up
```

**Heroku**
```json
// package.json
{
  "scripts": {
    "heroku-postbuild": "pnpm run build"
  },
  "engines": {
    "node": "20.x",
    "pnpm": "8.x"
  }
}
```

**DigitalOcean App Platform**
```yaml
# .do/app.yaml
name: quickpage-builder
services:
- name: web
  source_dir: /
  github:
    repo: your-username/quickpage-builder
    branch: main
  run_command: pnpm start
  build_command: pnpm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
```

---

## Configuration

### Environment Variables

**Production Variables:**
```bash
# .env.production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NODE_ENV=production
```

**Optional Variables:**
```bash
# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS=GA_MEASUREMENT_ID
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com

# Error Tracking (optional)
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# Database (future use)
DATABASE_URL=your-database-url
REDIS_URL=your-redis-url
```

### Build Configuration

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Static export configuration
  output: 'export',
  trailingSlash: true,
  
  // Image optimization
  images: {
    unoptimized: true, // For static export
    domains: ['your-domain.com']
  },
  
  // Performance monitoring
  experimental: {
    webpackBuildWorker: true
  }
};

module.exports = nextConfig;
```

### Performance Optimization

**Bundle Optimization:**
```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Minimize bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60
  }
});
```

---

## Domain & SSL

### Custom Domain Setup

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. SSL automatically provisioned

**Netlify:**
1. Site Settings → Domain Management
2. Add custom domain
3. Update nameservers or DNS records
4. Enable HTTPS

**Manual DNS Configuration:**
```
# A Record
Type: A
Name: @
Value: [Platform IP Address]

# CNAME Record  
Type: CNAME
Name: www
Value: [Platform Domain]
```

### SSL Certificates

**Automatic (Recommended):**
- Vercel: Automatic SSL via Let's Encrypt
- Netlify: Automatic SSL provisioning
- Cloudflare: Free SSL with CDN

**Manual SSL:**
```bash
# Generate SSL certificate (Let's Encrypt)
certbot certonly --webroot -w /var/www/html -d your-domain.com
```

---

## Monitoring & Analytics

### Performance Monitoring

**Web Vitals:**
```javascript
// pages/_app.js
export function reportWebVitals(metric) {
  // Send to analytics
  if (process.env.NEXT_PUBLIC_ANALYTICS_ID) {
    // Google Analytics
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      event_label: metric.id,
    });
  }
}
```

**Error Tracking:**
```bash
# Install Sentry
pnpm add @sentry/nextjs

# Configure sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Analytics Setup

**Google Analytics:**
```javascript
// lib/analytics.js
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
```

**Plausible Analytics:**
```javascript
// pages/_app.js
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        defer
        data-domain="your-domain.com"
        src="https://plausible.io/js/plausible.js"
      />
      <Component {...pageProps} />
    </>
  );
}
```

---

## Security

### Security Headers

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
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
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Content Security Policy

```javascript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  child-src 'none';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  media-src 'none';
  connect-src 'self';
  font-src 'self';
`;

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
];
```

---

## Backup & Recovery

### Data Backup

**LocalStorage Backup:**
```javascript
// Backup user data
const backupData = () => {
  const data = {
    pages: localStorage.getItem('quickpage-draft'),
    settings: localStorage.getItem('quickpage-settings'),
    timestamp: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `quickpage-backup-${Date.now()}.json`;
  a.click();
};
```

**Database Backup (Future):**
```bash
# PostgreSQL backup
pg_dump -h hostname -U username -d database_name > backup.sql

# MongoDB backup
mongodump --uri="mongodb://connection-string" --out ./backup
```

### Recovery Procedures

**Application Recovery:**
1. Redeploy from Git repository
2. Restore environment variables
3. Verify all services running
4. Test critical user paths

**Data Recovery:**
1. Restore from latest backup
2. Verify data integrity
3. Test user functionality
4. Monitor for issues

---

## Troubleshooting

### Common Deployment Issues

**Build Failures:**
```bash
# Clear Next.js cache
rm -rf .next
pnpm run build

# Clear node_modules
rm -rf node_modules
pnpm install
```

**Memory Issues:**
```json
// package.json - Increase memory limit
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

**Static Export Issues:**
```javascript
// next.config.js - Configure for static export
module.exports = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true
};
```

### Performance Issues

**Large Bundle Size:**
```bash
# Analyze bundle
pnpm run build
pnpm run analyze

# Common fixes:
# 1. Lazy load heavy components
# 2. Remove unused dependencies
# 3. Optimize images
# 4. Enable compression
```

**Slow Loading:**
```javascript
// Enable compression
// next.config.js
module.exports = {
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  }
};
```

### Debug Mode

**Enable Debug Logging:**
```bash
# Development
DEBUG=* pnpm run dev

# Production
NODE_ENV=production DEBUG=* pnpm start
```

**Browser Debug:**
```javascript
// Enable in production for debugging
if (typeof window !== 'undefined') {
  window.QuickPageDebug = {
    store: useEditorStore.getState(),
    history: useHistoryStore.getState(),
    version: process.env.NEXT_PUBLIC_VERSION
  };
}
```

---

## Maintenance

### Regular Updates

**Dependencies:**
```bash
# Check for updates
pnpm outdated

# Update dependencies
pnpm update

# Security audit
pnpm audit
```

**Security Updates:**
```bash
# Fix vulnerabilities
pnpm audit --fix

# Update Node.js (use LTS versions)
nvm install --lts
nvm use --lts
```

### Performance Monitoring

**Monthly Checks:**
- [ ] Bundle size analysis
- [ ] Lighthouse performance audit
- [ ] Core Web Vitals review
- [ ] Error rate monitoring
- [ ] User feedback analysis

**Health Checks:**
```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERSION
  });
}
```

---

## Support

### Getting Help

**Documentation:**
- [User Guide](./USER-GUIDE.md)
- [Developer Guide](./DEVELOPER-GUIDE.md)
- [API Reference](./API.md)

**Community:**
- GitHub Issues for bugs
- GitHub Discussions for questions
- Discord community (if available)

**Professional Support:**
- Priority support available
- Custom deployment assistance
- Enterprise consulting

### Reporting Issues

**Bug Reports:**
1. Check existing issues first
2. Provide reproduction steps
3. Include environment details
4. Add relevant logs/screenshots

**Feature Requests:**
1. Check roadmap and existing requests
2. Provide use case and rationale
3. Consider implementation complexity
4. Discuss with community first