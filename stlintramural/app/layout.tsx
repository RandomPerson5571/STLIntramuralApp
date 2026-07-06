import type { Metadata } from "next";
import {
  Bebas_Neue,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: "600",
});

export const metadata: Metadata = {
  ...rootMetadata,
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} light h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col text-body-md font-body-md">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
