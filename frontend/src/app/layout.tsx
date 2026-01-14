import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotihuy - Music Streaming Proxy',
  description: 'Bypass IP blocks and stream music together with your team',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background-secondary text-text-primary min-h-screen`}>
        {children}
      </body>
    </html>
  )
}