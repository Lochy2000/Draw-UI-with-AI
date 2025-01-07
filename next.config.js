/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is important for tldraw to work properly
  transpilePackages: ['@tldraw/tldraw']
}

module.exports = nextConfig