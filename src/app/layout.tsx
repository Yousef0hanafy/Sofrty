import type { Metadata, Viewport } from "next";
import { Tajawal, Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مضيق | Madaq - قائمة الطعام الرقمية",
  description:
    "مطعم مضيق - تجربة طعام استثنائية تجمع بين أصالة المذاق العربي وأحدث تقنيات الطبخ",
  keywords: [
    "مضيق",
    "Madaq",
    "مطعم",
    "restaurant",
    "قائمة طعام",
    "menu",
    "مشويات",
    "arabian food",
  ],
  icons: {
    icon: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=64&h=64&fit=crop",
  },
};

export const viewport: Viewport = {
  themeColor: "#c8a96e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${tajawal.variable} ${inter.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="madaq-theme"
        >
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
