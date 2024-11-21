import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clever Assets - FICA CDD Form',
  description: 'Client Due Diligence Form for Companies and Close Corporations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
