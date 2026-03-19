import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimuLar - JF 2026",
  description: "Dashboard inteligente para escolha de imóveis em Juiz de Fora.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* CSS DO LEAFLET - OBRIGATÓRIO PARA O MAPA FUNCIONAR */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body className="bg-[#050505] text-gray-100 antialiased">{children}</body>
    </html>
  );
}