
import type { Metadata } from 'next'
import { Assistant } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

const assistant = Assistant({
  subsets: ['latin'],
  weight: ['200', '400', '700'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bora Pro Resort | Experiências de Verão Memoráveis',
  description: 'Multipropriedades exclusivas em Olímpia, São Pedro e Barretos. Reserve sua estadia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={assistant.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
