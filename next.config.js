/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/amironews\.com\/.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'amironews-content',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {};

module.exports = withPWA(nextConfig);
