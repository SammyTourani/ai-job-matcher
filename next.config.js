/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdf-parse', 'mammoth'],
  images: {
    domains: ['localhost', 'supabase.co']
  }
}

module.exports = nextConfig