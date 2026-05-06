import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import SiteHeader from "@/components/layout/site-header";
import StorageListener from "@/components/storage/storage-listener";

export const metadata: Metadata = {
  title: "StormTalk",
  description:
    "Aplicatie web care combina date meteo in timp real cu doi agenti AI pentru recomandari meteo si destinatii de vacanta.",
};

const interFontUrl = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={interFontUrl} rel="stylesheet" />
      </head>
      <body>
        <StorageListener />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
