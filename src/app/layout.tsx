import { AppContextProvider } from '@/context'
import './globals.css'
import type { Metadata } from 'next'
import { Footer } from './components/Footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Client Home App',
  description: 'Copilot Client Home App',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <AppContextProvider>
          {children}
          <Footer />
        </AppContextProvider>
      </body>
    </html>
  )
}
