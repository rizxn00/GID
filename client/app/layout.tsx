import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProviderWrapper } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GID",
  description: "Get It Done",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
      <ThemeProviderWrapper>
        {/* <div className="bg-background"> */}
          <Toaster position="top-right" />
        {children}
        {/* </div> */}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
