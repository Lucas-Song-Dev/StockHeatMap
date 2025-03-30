import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const lato = Lato({
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Stock Market Map | Stk-market Clone",
  description: "Stock screener for investors and traders, .",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable}`}>
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
