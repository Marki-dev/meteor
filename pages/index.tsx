import { useEffect } from 'react';
import { useRouter } from 'next/router';
import MeteorFetch from '@/util/web/MeteorFetch';

export default function RedirectToDashboard() {
	const router = useRouter();

	useEffect(() => {
		void MeteorFetch('/config/status').then(body => {
			console.log(body);
			void router.push(body.goTo as string);
		});
	}, []);

	return null;
}
