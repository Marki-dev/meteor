import Attribution from '@/components/reusable/attribution'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }: AppProps) {
  return <div className='relative min-h-screen'>
    <Attribution />
    <Toaster position='bottom-right' />
    <Component {...pageProps} />
  </div>
}
