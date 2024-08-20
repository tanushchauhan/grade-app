"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
// video css disabled here
// import "node_modules/react-modal-video/css/modal-video.css";
import "@/node_modules/react-modal-video/css/modal-video.css";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html suppressHydrationWarning lang="en">
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          <Suspense fallback={<Loader />}>
            {!pathname.includes("/dashboard") ? <Header /> : null}
            {children}
            {!pathname.includes("/dashboard") ? <Footer /> : null}
            <ScrollToTop />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import { usePathname } from "next/navigation";
