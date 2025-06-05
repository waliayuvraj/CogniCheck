import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Lato, Josefin_Sans } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-josefin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CogniCheck",
  description: "CogniCheck Landing Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${lato.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
