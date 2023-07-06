import React from 'react';
import Image from 'next/image';
import { type EmbedType } from './settings/embedConfig';

type DiscordPreviewProps = {
	username: string;
	avatar: string;
	domain?: string;
	embed?: EmbedType | undefined;
};

const DiscordPreview = ({
	username,
	avatar,
	domain,
	embed,
}: DiscordPreviewProps) => (
	<div className='bg-[#2E3035] p-3 rounded-md'>
		<div className='flex gap-3'>
			<div className='relative w-24'>
				<img src={avatar} className='rounded-full' />
			</div>
			<div>
				<p className='font-semibold hover:underline'>{username}</p>
				<p className='text-blue-500 hover:underline'>
					https://{domain ?? 'meteor.host'}/u/erwye789
				</p>
				{typeof embed !== 'undefined' && embed.enabled ? (
					<div className='flex rounded-lg'>
						<div
							style={{ backgroundColor: embed.color }}
							className='w-[0.4rem] rounded-l-md'
						/>
						<div className='bg-[#2B2D31] p-2 rounded-r-md flex flex-col gap-2'>
							<p className='text-xs opacity-60'>{embed.provider}</p>
							<p>{embed.author}</p>
							<p className='cursor-pointer font-semibold hover:underline'>
								{embed.title}
							</p>
							<p className='text-sm'>{embed.description}</p>
							<img
								className='max-h-[50vh] cursor-pointer rounded-md'
								src='https://source.unsplash.com/collection/256443?91'
							/>
						</div>
					</div>
				) : null}
			</div>
		</div>
	</div>
);

export default DiscordPreview;
