import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { globalStyles } from '@/styles/global'

globalStyles()

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
  return <Component className={roboto.className} {...pageProps} />
}
