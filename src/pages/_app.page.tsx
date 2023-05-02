import '../lib/dayjs'

import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider } from '@tanstack/react-query'

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
        <Component className={roboto.className} {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}
