import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { DashboardWindowProvider } from "@/app/components/DashboardWindowProvider";
import QueryProvider from "@/app/components/QueryClientProvider";
import { Toaster } from "react-hot-toast";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Gestion",
  description: "Sistema de gestion para la empresa SisGest",
  icons: {
    icon: "/icono.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}  antialiased`}>
        <Toaster position="top-center" />
        <QueryProvider>
          <DashboardWindowProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </DashboardWindowProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
