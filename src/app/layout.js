import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Automated CIS Benchmarks",
  description: "Generates Automated Testing for CIS Foundations Benchmarks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ minHeight: "100vh" }}
      >
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
