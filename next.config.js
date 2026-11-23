const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build a fully static site into `out/` so Netlify serves it from the CDN
  // without deploying the Next.js Server Handler function.
  output: 'export',
  images: { unoptimized: true },
}

module.exports = withNextIntl(nextConfig)
