import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removed to fix module not found error
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = GeistSans;
// const geistMono = GeistMono; // Removed

export const metadata: Metadata = {
  title: 'AI慢病管理系统',
  description: 'AI Chronic Disease Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}> {/* Removed geistMono.variable */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
