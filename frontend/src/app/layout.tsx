'use client';

import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/login' || pathname === '/signup';
  

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!hideNavbar && <Navbar />}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1200px] px-4">{children}</div>
        </div>
        {!hideNavbar && <Footer />}
      </body>
    </html>
  );
}
