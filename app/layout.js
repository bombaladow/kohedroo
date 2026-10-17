import { Cairo } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-cairo",
});

// ... (metadata)

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}