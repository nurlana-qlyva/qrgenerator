
const nextConfig = {
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
