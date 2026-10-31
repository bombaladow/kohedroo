import { Cairo } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import { LoadingProvider } from "@/lib/LoadingContext";
import { Toaster } from 'sonner';

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-cairo",
});

// Self-hosted display + meta fonts (files live in app/fonts/)
const display = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

const meta = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  weight: "100 900",
  variable: "--font-meta",
  display: "swap",
});

export const metadata = {
  title: "Kohedroo | Art Director & AI Creative Lead",
  description: "Art Director & AI Creative Lead with 13+ years driving visual storytelling, AI production, and premium commercial branding across Dubai & Egypt.",
  keywords: ["Art Director", "AI Creative Lead", "Graphic Designer", "Dubai", "Egypt", "Branding", "Commercial Videos"],
  openGraph: {
    title: "Kohedroo | Art Director & AI Creative Lead",
    description: "Portfolio of Kohedroo - 13+ years of premium commercial branding.",
    url: "https://kohedroo.com",
    siteName: "Kohedroo",
    images: [
      {
        url: "/KOHEDROO.png",
        width: 800,
        height: 600,
        alt: "Kohedroo Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kohedroo | Art Director",
    description: "Portfolio of Kohedroo - 13+ years of premium commercial branding.",
    images: ["/KOHEDROO.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cairo.variable} ${display.variable} ${meta.variable} h-full antialiased`}>
      {/* overflow-x-hidden prevents horizontal scroll from confusing Lenis */}
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <LoadingProvider>
          <Preloader />
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <Toaster position="top-center" richColors />
        </LoadingProvider>
      </body>
    </html>
  );
}