import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Data - Marketplace for Datasets",
  description: "Browse, purchase, and manage high-quality verified datasets. Build your data pipeline with ease.",
  keywords: "datasets, data marketplace, data for sale, verified data",
  authors: [{ name: "Data Team" }],
  creator: "Data",
  openGraph: {
    title: "Data - Marketplace for Datasets",
    description: "Browse, purchase, and manage high-quality verified datasets.",
    url: "https://data.example.com",
    siteName: "Data",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data - Marketplace for Datasets",
    description: "Browse, purchase, and manage high-quality verified datasets.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0284c7" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-white text-slate-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
