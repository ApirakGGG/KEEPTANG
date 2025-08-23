import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./Mycomponents/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./Mycomponents/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const poppines = Poppins({
  weight: ["500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KEEPTANG || เก็บตัง",
  description: "Create by Apirak Jansawang",
  icons: {
    icon: [{ url: "/LOGO_KEEPTANG.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${poppines.className} antialiased`}>
          <main className="min-h-screen overflow-auto">
            <Toaster position="bottom-right" richColors />
            <ThemeProvider
              attribute={"class"}
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {children}
            
            </ThemeProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
