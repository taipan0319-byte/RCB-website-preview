/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: 'dist',
  poweredByHeader: false,
  async redirects() {
    return [{ source: '/', destination: '/preview.html', permanent: false }];
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }]
    }];
  }
};

export default nextConfig;
