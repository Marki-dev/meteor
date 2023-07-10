import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardWrapper from '@/components/layout/DashboardWrapper';
import {
	FaCamera,
	FaCommentDots,
	FaFileAlt,
	FaStickyNote,
	FaUpload,
} from 'react-icons/fa';
import AuthLock from '@/components/utility/AuthLock';
import MeteorFetch from '@/util/web/MeteorFetch';
import Link from 'next/link';

export default function MainAPPPage() {
	const [uploads, setUploads] = useState<any[]>([]);

	useEffect(() => {
		void MeteorFetch('/me/uploads').then(r => {
			setUploads(r.uploads as any[]);
		});
	}, []);
	return (
		<AuthLock>
			<DashboardWrapper>
				{/* Stats Display */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
					{[
						{ name: 'Total Uploads', value: 0, icon: FaUpload },
						{ name: 'Images', value: 0, icon: FaCamera },
						{ name: 'Text Snippets', value: 0, icon: FaStickyNote },
						{ name: 'Other Files', value: 0, icon: FaFileAlt },
					].map((stat, i) => (
						<div
							key={i}
							className='flex bg-primary p-3 rounded-lg md:justify-between'
						>
							<div className='flex items-center justify-center w-1/2'>
								<div className='bg-secondary p-5 rounded-full'>
									<stat.icon className='text-4xl' />
								</div>
							</div>
							<div className='flex flex-col items-center justify-center w-1/2'>
								<div className='text-center'>
									<p className='underline text-xl font-bold'>{stat.name}</p>
									<p className='text-6xl font-black'>{stat.value}</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 transition-all gap-3 my-3'>
					{uploads.slice(0, 8).map((upload, i) => (
						<Link href={`/u/${upload.shortId as string}`}>
							<div className=' bg-primary p-3 rounded-lg md:justify-between hover:scale-[1.05] group duration-300'>
								<img
									src={`/api/upload/${upload.shortId as string}`}
									alt=''
									className='grayscale group-hover:grayscale-0 rounded-lg w-full h-48  object-none'
								/>
								<div className='flex justify-between items-center'>
									<div className='flex w-1/2 items-center h-full'>
										<p className='text-2xl font-semibold opacity-50'>
											{upload.shortId}
										</p>
									</div>
									<div className='flex items-center'>
										<FaCommentDots className='text-3xl' />
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</DashboardWrapper>
		</AuthLock>
	);
}
