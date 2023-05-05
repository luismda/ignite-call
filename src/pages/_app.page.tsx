import '../lib/dayjs'

import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { DefaultSeo } from 'next-seo'

import { queryClient } from '@/lib/react-query'
import { globalStyles } from '@/styles/global'

globalStyles()

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'pt_BR',
            siteName: 'Ignite Call',
            images: [
              {
                url: '/og-image.png',
                width: 600,
                height: 400,
                alt: 'Prévia da tela inicial da aplicação Ignite Call com um título e um calendário ao lado direito.',
              },
            ],
          }}
        />

        <Component className={roboto.className} {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
