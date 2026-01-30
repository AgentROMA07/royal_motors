import type { Metadata } from "next";
import { Manrope, Montserrat } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getDictionary } from "@/lib/i18n";
import { getBrandConfig } from "@/lib/brand";

const manrope = Manrope({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const montserrat = Montserrat({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: getBrandConfig().meta.title.ru,
  description: getBrandConfig().meta.description.ru,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = 'ru';
  const dictionary = getDictionary(locale);

  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${manrope.variable} ${montserrat.variable} font-sans antialiased`} suppressHydrationWarning>
        <Header dictionary={dictionary} locale={locale} />
        {children}
        <Footer dictionary={dictionary} locale={locale} />
      </body>
    </html>
  );
}
