/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    async rewrites() {
        return [
          {
            source: 'https://localhost:5500/*',
            destination: 'https://localhost:3000/*',
          },
          {
            source: 'http://85.202.160.193:5500/*',
            destination: 'https://coddingbattles.vercel.app/*',
          }
        ]
      },
  };

module.exports = nextConfig
