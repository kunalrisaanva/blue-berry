"use client";
import ReduxProvider from "@/app/components/ReduxProvider";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          {!hideNavbar && <Navbar />}
          <div className=" flex  justify-center ">
            <div className="w-full max-w-[1300px] p-2 ">{children}</div>
          </div>
          {!hideNavbar && <Footer />}
        </ReduxProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
