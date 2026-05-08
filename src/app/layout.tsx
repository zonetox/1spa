import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono, Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "1Beauty.Asia | Danh Bạ Spa, Nha Khoa & Thẩm Mỹ Cao Cấp",
  description: "Hệ thống danh bạ và trang đích cao cấp dành riêng cho ngành Spa, Nha khoa và Thẩm mỹ viện.",
  keywords: ["1Beauty.Asia", "Danh bạ Spa", "Nha khoa cao cấp", "Landing Page Thẩm mỹ"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${cormorant.variable} ${mono.variable} ${playfair.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-full bg-background text-foreground selection:bg-accent/30 selection:text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
