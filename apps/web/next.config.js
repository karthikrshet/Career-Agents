import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Fix PackFileCacheStrategy ENOENT cache issues
    if (config.cache && config.cache.type === 'filesystem') {
      config.cache.buildDependencies = {
        config: [__filename],
      };
    }
    return config;
  },
}

export default nextConfig;
