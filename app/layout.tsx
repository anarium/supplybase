import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// In a real application, you would fetch this from your database
// For now, we'll use default values that can be updated via admin panel
const defaultSettings = {
  title: "Supply Base Azerbaijan - Procurement and Supply / Satınalma və Təchizat",
  metaDescription:
    "Supply Base Azerbaijan provides comprehensive procurement and supply chain solutions for various industries. Professional sourcing, quality assurance, and reliable delivery services.",
  metaKeywords:
    "procurement, supply chain, Azerbaijan, sourcing, industrial supplies, construction materials, oil gas equipment",
  socialTitle: "Supply Base Azerbaijan - Satınalma və Təchizat Xidməti",
  socialImage: "/images/sba-logo.webp",
  favicon: "https://links.az/uploads/files/e6ec371e46d8c0009d805b1b999b9a1d.png",
}

export const metadata: Metadata = {
  title: defaultSettings.title,
  description: defaultSettings.metaDescription,
  keywords: defaultSettings.metaKeywords,
  authors: [{ name: "Supply Base Azerbaijan" }],
  creator: "Supply Base Azerbaijan",
  publisher: "Supply Base Azerbaijan",
  robots: "index, follow",

  // Open Graph / Facebook
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: "https://supplybase.az",
    title: defaultSettings.socialTitle,
    description: defaultSettings.metaDescription,
    siteName: "Supply Base Azerbaijan",
    images: [
      {
        url: defaultSettings.socialImage,
        width: 1200,
        height: 630,
        alt: defaultSettings.socialTitle,
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: defaultSettings.socialTitle,
    description: defaultSettings.metaDescription,
    images: [defaultSettings.socialImage],
    creator: "@supplybaseaz",
  },

  // Additional meta tags
  other: {
    "theme-color": "#1e40af",
    "msapplication-TileColor": "#1e40af",
    "msapplication-config": "/browserconfig.xml",
  },

  // Icons
  icons: {
    icon: defaultSettings.favicon,
    shortcut: defaultSettings.favicon,
    apple: "/apple-touch-icon.png",
  },

  // Manifest
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="az">
      <head>
        {/* Additional meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="canonical" href="https://supplybase.az" />
        <script defer data-domain="supplybase.az" src="https://the.base.az/js/script.js"></script>
       
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7Y7CP7DKJM"></script>
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7Y7CP7DKJM');
            `,
          }}
        />


        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Supply Base Azerbaijan - Təchizat Şirkəti / Supply Company",
              url: "https://supplybase.az",
              logo: "https://supplybase.az/images/sba-logo.webp",
              description: defaultSettings.metaDescription,
              address: {
                "@type": "PostalAddress",
                addressCountry: "AZ",
                addressLocality: "Baku",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+994502402230",
                contactType: "customer service",
                email: "sales@supplybase.az",
              },
              sameAs: ["https://wa.me/994502402230"],
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
