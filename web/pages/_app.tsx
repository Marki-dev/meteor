import Attribution from '@/components/reusable/attribution'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <div className='relative'>
    <Attribution/>
    <Component {...pageProps} />
  </div>
}
