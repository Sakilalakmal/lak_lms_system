import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone', // Required for Docker
  images:{
    remotePatterns: [
      {
        hostname:"amzn-s3-lms-system-lakmal.s3.us-east-1.amazonaws.com",
        port:"",
        protocol:"https",
      }
    ]
  }
};

export default nextConfig;
