import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ordolait",
  description: "Bienvenue sur Ordolait",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
