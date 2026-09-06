import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { siteMetadata, jsonLdSchema } from "@/lib/seo";
import { RootProviders } from "@/components/providers/RootProviders";
import "./globals.css";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var h=new Date().getHours();var b='night';if(h>=5&&h<8)b='dawn';else if(h>=8&&h<18)b='day';else if(h>=18&&h<21)b='sunset';document.documentElement.setAttribute('data-band',b);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${fontVariables} antialiased bg-[var(--bg-main,#0A0A0A)] text-[var(--text-primary,#FAFAF7)] font-body`}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
