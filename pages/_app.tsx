import Attribution from '@/components/reusable/attribution';
import '@/styles/globals.css';
import type {AppProps} from 'next/app';
import {Toaster} from 'react-hot-toast';
import {UserContextProvider} from '@/context/userContext';

export default function App({Component, pageProps: {...pageProps}}: AppProps) {
	return <div className='relative min-h-screen'>
		<Attribution />
		<UserContextProvider>
			<Toaster position='bottom-right' />
			<Component {...pageProps} />
		</UserContextProvider>
	</div>;
}
