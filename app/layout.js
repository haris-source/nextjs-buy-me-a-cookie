import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SessionWraper } from "@/components/SessionWraper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Get Me A Cookie 🍪 - Your Ultimate Cookie Companion",
  description: "This platform is for crowdfunding cookie projects and sharing cookie recipes. Join us in celebrating the joy of cookies!",
};

// app/layout.js

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body 
        suppressHydrationWarning 
        className="relative min-h-screen flex flex-col bg-neutral-950 text-white"
      >
        <div className="fixed inset-0 -z-10 h-full w-full bg-[#080808]">
          <div className="absolute top-10 right-0 h-100 w-100 rounded-full bg-orange-600/10 blur-[130px]" />
        </div>
        <SessionWraper>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </SessionWraper>
      </body>
    </html>
  );
}