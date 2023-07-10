import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardWrapper from '@/components/layout/DashboardWrapper';
import {
	FaCamera,
	FaCommentDots,
	FaCopy,
	FaExternalLinkAlt,
	FaFileAlt,
	FaStickyNote,
	FaTrash,
	FaUpload,
} from 'react-icons/fa';
import AuthLock from '@/components/utility/AuthLock';
import MeteorFetch from '@/util/web/MeteorFetch';
import Toast from '../../components/ui/Toast';
import Link from 'next/link';
import { useUser } from '@/hooks/UserHook';
import { getDurationSince } from '@/util/universal/getDurationSince';

export type URLShortenerType = {
	id: number;
	userId: number;
	shortId: string;
	url: string;
	created_at: Date;
	last_viewed?: Date;
	views: number;
};

export default function URLShortener() {
	const [urls, setUrls] = useState<URLShortenerType[]>([]);

	useEffect(() => {
		fetchShorteners();
	}, []);

	function fetchShorteners() {
		void MeteorFetch('/s/me').then(r => {
			setUrls(r as URLShortenerType[]);
		});
	}

	const totalViews = urls.reduce((acc, curr) => acc + curr.views, 0);
	return (
		<AuthLock>
			<DashboardWrapper>
				<div className='flex gap-3 flex-col md:flex-row'>
					<div className='bg-primary p-3 rounded-lg shadow-lg w-full md:w-1/2'>
						<p className='text-4xl font-bold'>Shortened URLs</p>
						<p className='text-xl font-bold opacity-50'>
							View and manage Shortened URLs
						</p>
					</div>
					<div className='flex gap-3 w-full md:w-1/2'>
						<div className='bg-primary p-3 rounded-lg shadow-lg w-1/2'>
							<p className='text-3xl font-bold'>Shortened URLs</p>
							<p className='text-6xl font-bold opacity-75 text-center'>
								{urls.length}
							</p>
						</div>
						<div className='bg-primary p-3 rounded-lg shadow-lg w-1/2'>
							<p className='text-3xl font-bold'>Total Views</p>
							<p className='text-6xl font-bold opacity-75 text-center'>
								{totalViews}
							</p>
						</div>
					</div>
				</div>
				<TableComponent refetch={fetchShorteners} data={urls} />
			</DashboardWrapper>
		</AuthLock>
	);
}

type ShortenerDisplayType = {
	data: URLShortenerType[];
	refetch: () => void;
};
const TableComponent = ({ data, refetch }: ShortenerDisplayType) => {
	const user = useUser();
	const [sortedData, setSortedData] = useState(data);

	useEffect(() => {
		setSortedData(data);
	}, [data]);

	const sortByViews = () => {
		const sorted = [...sortedData].sort((a, b) => b.views - a.views);
		setSortedData(sorted);
	};

	function copyUrl(id: number) {
		const shortener = data.find(d => d.id === id) ?? null;
		if (!shortener) return;
		void navigator.clipboard.writeText(
			`${user?.user!.activeDomain ?? ''}/s/${shortener.shortId}`
		);
		Toast({
			titleText: 'Copied to clipboard!',
		});
	}

	function deleteShortner(id: number) {
		void MeteorFetch(`/s/${id}`, { method: 'DELETE' });
		refetch?.();
	}

	return (
		<div className='bg-primary w-full p-3 rounded-lg mt-3'>
			<div className='flex font-bold text-white mb-3'>
				<div className='w-1/7'>ID</div>
				<div className='w-1/7'>User ID</div>
				<div className='w-1/7'>Path</div>
				<div className='w-1/7'>URL</div>
				<div className='w-1/7'>Created At</div>
				<div className='w-1/7'>Last Viewed</div>
				<div className='w-1/7'>Views</div>
				<div className='w-1/7'>Actions</div>
			</div>
			{sortedData.map((item, index) => (
				<div
					key={index}
					className={
						'flex mb-2 rounded-md even:bg-gray-300 even:bg-opacity-25 hover:bg-secondary'
					}
				>
					<div className='w-1/7 px-4 py-2'>{item.id}</div>
					<div className='w-1/7 px-4 py-2'>{item.userId}</div>
					<div className='w-1/7 px-4 py-2'>{item.shortId}</div>
					<div className='w-1/7 px-4 py-2'>{item.url}</div>
					<div className='w-1/7 px-4 py-2'>
						{new Date(item?.created_at).toISOString()}
					</div>
					<div className='w-1/7 px-4 py-2'>
						{item.last_viewed
							? getDurationSince(new Date(item?.last_viewed)) + ' ago'
							: '-'}
					</div>
					<div className='w-1/7 px-4 py-2'>{item.views}</div>
					<div className='w-1/7 px-4 py-2 flex items-center justify-center'>
						<Link href={item.url}>
							<div className='bg-green-400 p-2 rounded-l-md hover:bg-opacity-50 duration-300'>
								<FaExternalLinkAlt />
							</div>
						</Link>
						<div
							onClick={() => {
								copyUrl(item.id);
							}}
							className='bg-yellow-400 p-2 hover:bg-opacity-50 duration-300'
						>
							<FaCopy />
						</div>
						<div
							onClick={() => {
								deleteShortner(item.id);
							}}
							className='bg-red-400 p-2 rounded-r-md hover:bg-opacity-50 duration-300'
						>
							<FaTrash />
						</div>
					</div>
				</div>
			))}
			<div className='mt-3'>
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					onClick={sortByViews}
				>
					Sort by Views
				</button>
			</div>
		</div>
	);
};

