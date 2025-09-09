const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://qrgenerates.com/:path*",
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
