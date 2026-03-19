import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Isso desliga os avisos chatos do Turbopack
  devIndicators: {
    position: "bottom-right",
  },
  // Libera o acesso para o seu celular
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    }
  }
};

export default nextConfig;