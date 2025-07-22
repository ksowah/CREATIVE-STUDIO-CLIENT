/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack(config, { isServer }) {
    if (isServer) {
      config.externals.push({
        undici: 'commonjs undici',
      });
    }
    return config;
  },
};

export default nextConfig;
