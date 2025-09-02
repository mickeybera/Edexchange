import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AppProvider from '@/components/providers/app-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'eduXchange - Student Marketplace',
  description: 'Buy and sell books, engineering kits, and notes with fellow students',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
