import type { Metadata } from "next"
import { Providers } from "./providers"

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
