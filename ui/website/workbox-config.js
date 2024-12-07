module.exports = {
  globDirectory: "build/",
  globPatterns: [
    "**/*.{json,ico,html,png,txt,css,js}"
  ],
  swDest: "build/service-worker.js",
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [{
    urlPattern: /^https?.*/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'https-calls',
      networkTimeoutSeconds: 15,
      expiration: {
        maxEntries: 150,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  }]
}; 