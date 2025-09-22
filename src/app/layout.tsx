import { Footer } from '@/app/components/Footer'
import { AppContextProvider } from '@/context'
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Client Home App',
  description: 'Assembly Client Home App',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        {/* Make sure the error suppression script runs BEFORE sentry can init */}
        <Script id='suppress-iframe-errors' strategy='beforeInteractive'>
          {`(function(){
            window.addEventListener('error', function(ev){
              var t = ev.target;
              if (t && t.tagName === 'IFRAME') {
                ev.stopImmediatePropagation();
                console.log('[iframe load error]', t.src);
                return;
              }
              if (ev instanceof ErrorEvent && ev.message === 'Script error.') {
                ev.stopImmediatePropagation();
                console.log('[iframe script error]', ev.filename);
                return;
              }
            }, true);
          })();`}
        </Script>
      </head>

      <body>
        <AppContextProvider>
          {children}
          <Footer />
        </AppContextProvider>
      </body>
    </html>
  )
}
