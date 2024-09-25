/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Accetta qualsiasi hostname
      },
    ],
  },
};

export default nextConfig;
