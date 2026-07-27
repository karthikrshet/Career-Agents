/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://avatars.githubusercontent.com https://github.com https://raw.githubusercontent.com",
      "connect-src 'self' https://api.github.com https://generativelanguage.googleapis.com https://api.anthropic.com https://api.openai.com https://api.groq.com https://api.together.xyz https://openrouter.ai https://api.mistral.ai https://api.cohere.com https://api.deepseek.com https://api.x.ai https://api.azure.com https://www.google-analytics.com",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (config.cache && config.cache.type === 'filesystem') {
      config.cache.buildDependencies = {
        config: [__filename],
      };
    }
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        net: false,
      };
    }
    return config;
  },
};

export default nextConfig;
