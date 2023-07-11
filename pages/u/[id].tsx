import NavBar from '@/components/layout/nav';
import { useEffect, useState, type ReactNode, useRef } from 'react';
import { useRouter } from 'next/router';
import EXIF from 'exif-js';
import MeteorFetch from '@/util/web/MeteorFetch';
import { AnimatePresence, motion } from 'framer-motion';
import { FaInfo } from 'react-icons/fa';
import { type GetServerSideProps, type GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { PrismaClient } from '@prisma/client';

type GSSProps = {
	oEmbedURI: string;
};

export const getServerSideProps: GetServerSideProps<GSSProps> = async (
	context: GetServerSidePropsContext
) => {
	const { id } = context.query;
	return {
		props: {
			oEmbedURI: `/api/upload/${id as string}/oembed`,
		},
	};
};

export default function FileView({ oEmbedURI }: GSSProps) {
	const router = useRouter();
	const { id } = router.query;
	console.log('id', oEmbedURI);
	const [uploadData, setUploadData] = useState();
	const [panelOpen, setPanelOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);

	async function getImageBuffer(url: string): Promise<ArrayBuffer> {
		try {
			const response = await fetch(url);
			const buffer = await response.arrayBuffer();

			return buffer;
		} catch (error) {
			throw new Error('Failed to fetch image');
		}
	}

	async function getImageMetadata() {
		const imageUrl = `/api/upload/${id as string}`;

		try {
			const imageBuffer = await getImageBuffer(imageUrl);

			const tags = EXIF.readFromBinaryFile(imageBuffer);

			console.log(tags);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (!id) return;
		void getImageMetadata();
		void MeteorFetch(`/upload/${id as string}/data`).then(setUploadData);
	}, [id]);

	function handlePanelToggle() {
		setPanelOpen(!panelOpen);
	}

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!panelOpen) return;
			if (
				panelRef.current &&
				!panelRef.current.contains(event.target as Node)
			) {
				setPanelOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [panelOpen]);

	return (
		<div>
			<Head>
				<link type='application/json+oembed' href={oEmbedURI} />
			</Head>
			<NavBar />
			<AnimatePresence>
				{panelOpen && (
					<motion.div
						key={'a'}
						className='fixed left-0 w-screen md:w-1/4 flex items-center h-screen z-50'
						initial={{ x: '-50vw' }}
						animate={{ x: '0vw' }}
						ref={panelRef}
					>
						<div className='bg-secondary h-[60vh] w-[25vw] rounded-r-lg p-3'>
							aaa
						</div>
					</motion.div>
				)}
				<div
					className={`full-screen bg-secondary bg-opacity-20 duration-300 transition-all ${
						panelOpen ? 'blur-sm' : 'blur-none'
					}`}
				>
					<div className='flex flex-col items-center justify-center h-full'>
						<img
							className='hover:scale-110 rounded-3xl hover:rounded-sm duration-300 shadow-xl max-h-[70vh]'
							src={`/api/upload/${id as string}`}
						/>
						<button
							className='mt-10 bg-blue-500 p-3 rounded-md'
							onClick={handlePanelToggle}
						>
							<FaInfo />
						</button>
					</div>
				</div>
			</AnimatePresence>
		</div>
	);
}
