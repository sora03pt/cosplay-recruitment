import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'あわせ募集文章作成',
  description: 'コスプレのあわせ募集文章作成ツールです',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
