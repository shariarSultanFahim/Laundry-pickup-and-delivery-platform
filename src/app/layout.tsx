import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { seoConfig } from "@/config/seo";

import { Toaster } from "@/ui";
import { Providers } from "@/providers";

import "@/styles/globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"]
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"]
// });

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"]
});

export const metadata: Metadata = seoConfig;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} font-sans flex min-h-screen w-full flex-col antialiased`}
      >
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
