import JSONRender from '@/components/reusable/jsonrender';
import MeteorFetch from '@/util/web/MeteorFetch';
import getConfig from '@/util/web/configGen';
import { useEffect, useRef, useState } from 'react';
import { FaCogs, FaPlay, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import Toast from '@/components/ui/Toast';

type tokenType = {
	id: string;
	userId: number;
	ip_address: string;
	user_agent: string;
	created_at: string;
	last_seen: string;
};
export default function SessionManager() {
	const [tokens, setTokens] = useState<tokenType[]>([]);

	function getTokens() {
		void MeteorFetch('/me/tokens').then(data => {
			if (!data[0]) {
				setTokens([]);
				return;
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			setTokens(data);
		});
	}

	useEffect(() => {
		getTokens();
	}, []);

	function terminateAll() {
		void MeteorFetch('/me/tokens/all', {
			method: 'DELETE',
		}).then(() => {
			Toast({
				type: 'info',
				titleText: 'All tokens terminated, Page Refreshing',
			});
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		});
	}

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex gap-3 flex-col md:flex-row'>
				<div className='bg-primary p-3 rounded-lg shadow-lg w-full md:w-1/2'>
					<p className='text-4xl font-bold'>Open Sessions</p>
					<p className='text-xl font-bold'>
						<span className='opacity-50'>Manage Sessions</span>{' '}
						<span className='text-red-400'>Terminate any unknown sessions</span>
					</p>
				</div>
				<div />
			</div>
			<div>
				<div className='bg-primary p-3 rounded-lg rounded-br-none shadow-lg w-full flex flex-col gap-3'>
					<div className='bg-secondary rounded-md bg-opacity-75 p-3 text-sm font-bold text-center flex w-full'>
						<div className='w-1/6 md:w-1/12 hidden md:flex items-center justify-center'>
							Token
						</div>
						<div className='w-2/6 md:w-3/12 items-center justify-center'>
							Device
						</div>
						<div className='w-3/12 hidden md:flex items-center justify-center'>
							IP Address
						</div>
						<div className='w-2/6 md:w-2/12 flex items-center justify-center'>
							Last Seen
						</div>
						<div className='w-2/6 md:w-2/12 flex items-center justify-center'>
							Created At
						</div>
						<div className='w-1/12 hidden md:flex items-center justify-center'>
							Terminate
						</div>
					</div>
					{tokens?.map((token, index) => (
						<TokenBlock key={index} token={token} refetch={getTokens} />
					))}
				</div>
				<div className='flex justify-end'>
					<div className='bg-primary p-3 rounded-b-lg'>
						<div
							onClick={terminateAll}
							className='bg-red-400 hover:bg-opacity-75 p-3 flex gap-2 items-center rounded-lg cursor-pointer'
						>
							<FaTrash />
							<p>Terminate All</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

type TokenBlockType = {
	token: tokenType;
	refetch: () => void;
};

function TokenBlock({ token, refetch }: TokenBlockType) {
	const [open, setOpen] = useState(false);

	function deleteToken() {
		void MeteorFetch(`/me/tokens/${token.id}`, {
			method: 'DELETE',
		}).then(() => {
			refetch();
		});
	}

	return (
		<div>
			<div className='bg-secondary rounded-md bg-opacity-75 p-3 text-sm font-bold text-center flex flex-wrap w-full '>
				<div className='w-1/6 md:w-1/12 hidden md:flex items-center justify-center'>
					{token.id}
				</div>
				<div className='w-2/6 md:w-3/12 flex items-center justify-center'>
					{getUserAgentInfo(token.user_agent).browser}
				</div>
				<div className='w-3/12 hidden md:flex items-center justify-center'>
					{token.ip_address}
				</div>
				<div className='w-2/6 md:w-2/12 flex items-center justify-center'>
					{format(new Date(token.last_seen), 'yyyy-MM-dd, hh:MM aa')}
				</div>
				<div className='w-2/6 md:w-2/12 flex items-center justify-center'>
					{format(new Date(token.created_at), 'yyyy-MM-dd, hh:MM aa')}
				</div>
				<div className='w-full md:w-1/12 md:flex items-center justify-center'>
					<div
						onClick={deleteToken}
						className='bg-red-400 hover:bg-opacity-70 p-3 rounded cursor-pointer flex items-center justify-center gap-x-3'
					>
						<FaTrash />
						<p className='md:hidden inline'>Terminate</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function getUserAgentInfo(userAgentString: string) {
	const browserTypes = {
		Chrome: 'Chrome',
		Safari: 'Safari',
		Firefox: 'Firefox',
		IE: 'Internet Explorer',
		Edge: 'Microsoft Edge',
		Opera: 'Opera',
		Other: 'Other',
	};

	const osTypes = {
		Windows: 'Windows',
		macOS: 'macOS',
		Linux: 'Linux',
		iOS: 'iOS',
		Android: 'Android',
		Other: 'Other',
	};

	const regex = /(?:(\w+)[/\s](\d+\.\d+)(?:\.\d+)?)?/g;
	const matches = userAgentString.match(regex);

	const browserType = matches?.[0] ? matches[0].trim() : browserTypes.Other;
	const osType = matches?.[1] ? matches[1].trim() : osTypes.Other;

	return {
		browser: browserType,
		os: osType,
	};
}

const userAgentString =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
const userAgentInfo = getUserAgentInfo(userAgentString);

console.log(userAgentInfo.browser);
