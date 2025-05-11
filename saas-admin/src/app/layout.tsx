import type { Metadata } from "next";
import { Geist } from "next/font/google"; // Changed: Only import Geist (for Geist Sans)
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Removed Geist_Mono
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "SAAS Admin - AI慢病管理系统",
  description: "SAAS Administration Panel for AI Chronic Disease Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Changed: Removed geistMono.variable from className */}
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
