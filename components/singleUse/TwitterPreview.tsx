import React from 'react';
import { FaHeart, FaRegComment, FaTwitch, FaTwitter } from 'react-icons/fa';
import { type EmbedType } from './settings/embedConfig';

type TwitterPreviewProps = {
	username: string;
	avatar: string;
	domain?: string;
	embed?: EmbedType | undefined;
};

const TwitterPreview = ({
	username,
	avatar,
	domain,
	embed,
}: TwitterPreviewProps) => (
	<div className='bg-black p-3 rounded-md flex items-center justify-center'>
		<div className='bg-[#1F2937] w-[90%] rounded-xl p-4'>
			<div className='flex justify-between'>
				<div className='flex'>
					<img src={avatar} className='rounded-full h-12' />
					<div className='ml-1.5'>
						<p className='font-bold'>{username}</p>
						<p className='text-xs opacity-50'>@{username.toLowerCase()}</p>
					</div>
				</div>
				<div className='flex items-start justify-end'>
					<FaTwitter className='text-blue-500' />
				</div>
			</div>
			<div>
				<p className='text-blue-500 font-semibold my-2 hover:underline'>
					{domain ?? 'https://meteor.host'}/u/erwye789
				</p>
				<img
					className='max-h-[50vh] cursor-pointer rounded-2xl shadow-sm'
					src='https://source.unsplash.com/collection/256443?91'
				/>
				<div className='flex items-center gap-2 mt-2'>
					<p className='text-[#9CA3AF]'>{getCurrentDate()}</p>
				</div>
				<div className='h-[1px] w-full bg-[#9CA3AF] opacity-50 my-1' />
				<div className='flex gap-4 text-[#9CA3AF]'>
					<div className='flex gap-3 items-center mr-6'>
						<FaHeart />
						<span>69</span>
					</div>
					<div className='flex gap-3 items-center mr-6'>
						<FaRegComment />
						<span>420</span>
					</div>
				</div>
			</div>
		</div>
	</div>
);

function getCurrentDate() {
	const date = new Date();

	const hour = date.getHours() % 12 || 12;
	const minute = date.getMinutes().toString().padStart(2, '0');
	const period = date.getHours() < 12 ? 'AM' : 'PM';
	const month = date.toLocaleString('default', { month: 'short' });
	const day = date.getDate();
	const year = date.getFullYear();

	return `${hour}:${minute} ${period} · ${month} ${day}, ${year}`;
}

export default TwitterPreview;
