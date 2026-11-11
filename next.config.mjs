/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence foreign extension hydration/runtime noise in terminal
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;