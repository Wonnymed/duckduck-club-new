import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DuckDuck Club — Ecossistema Privado",
  description: "Direção. Contexto. Valor real. Ecossistema privado para quem quer operar com mais clareza, mais linguagem e mais acesso.",
  openGraph: {
    title: "DuckDuck Club — Ecossistema Privado",
    description: "Direção. Contexto. Valor real. Ecossistema privado para quem quer operar com mais clareza, mais linguagem e mais acesso.",
    url: "https://www.duckduck.club",
    siteName: "DuckDuck Club",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "DuckDuck Club — Ecossistema Privado" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DuckDuck Club — Ecossistema Privado",
    description: "Direção. Contexto. Valor real. Ecossistema privado para quem quer operar com mais clareza, mais linguagem e mais acesso.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/logo.jpeg" />
        <link rel="preload" href="/hero-video.mp4" as="video" type="video/mp4" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
