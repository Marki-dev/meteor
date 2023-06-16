import { useState } from 'react';
import DiscordPreview from '../DiscordPreview';
import TwitterPreview from '../TwitterPreview';
import checkObjectDifference from '@/util/universal/checkObjectDifference';
import AutoCompleteInput from '@/components/reusable/autocomplete';
import { AnimatePresence, motion } from 'framer-motion';
import { FaSave, FaUndo } from 'react-icons/fa';

type EmbedType = {
	enabled: boolean;
	title: string;
	description: string;
	color: string;
	author: string;
	provider: string;
};

const AutocompleteOptions = [
	'{{user.name}}',
	'{{user.id}}',
	'{{user.avatar}}',
	'{{user.uploadCount}}',
	'{{user.uploadLimit}}',
	'{{user.storageUsed}}',
	'{{user.storageLimit}}',

	'{{upload.id}}',
	'{{upload.name}}',
	'{{upload.url}}',
	'{{upload.size}}',
	'{{upload.type}}',
	'{{upload.uploadedAt}}',
];

export default function EmbedConfig() {
	const empty = {
		enabled: true,
		title: '',
		description: '',
		provider: '',
		author: '',
		color: '',
	};
	const [firstEmbed, setFirstEmbed] = useState<EmbedType>(empty);
	const [embed, setEmbed] = useState<EmbedType>(empty);
	const tabs: Record<string, JSX.Element> = {
		Discord: (
			<DiscordPreview
				username='Thykie'
				avatar='https://avatars.githubusercontent.com/u/45541936?v=4t'
				embed={embed}
			/>
		),
		Twitter: (
			<TwitterPreview
				avatar='https://avatars.githubusercontent.com/u/45541936?v=4t'
				username='Thykie'
				embed={embed}
			/>
		),
	};
	type tabsType = keyof typeof tabs;
	const [currentTab, setTab] = useState<tabsType>('Discord');

	function setMasterEmbed(embed: EmbedType) {
		setFirstEmbed(embed);
		setEmbed(embed);
	}

	function resetEmbed() {
		setEmbed(firstEmbed);
	}

	function saveEmbed() {
		console.log('Saving embed', embed);
	}

	const openSaveModal = checkObjectDifference(firstEmbed, embed);

	function updateEmbed(key: keyof EmbedType, value: string | boolean) {
		console.log('aaaaaa', embed);
		setEmbed(embed => ({ ...embed, [key]: value }));
	}

	return (
		<div className='grid grid-cols-2 gap-10 h-full'>
			<div className='bg-primary p-3 rounded-lg shadow-lg  col-span-2 md:col-span-1 relative pb-24'>
				<p className='text-4xl font-bold'>Embed Settings</p>
				<p className='text-xl font-bold opacity-50'>
					Customize the look of your embeds
				</p>
				<div className='grid grid-cols-2 gap-3'>
					<div className='col-span-2'>
						<p className='text-xs opacity-40 pl-1'>Enabled</p>
					</div>
					<div>
						<p className='text-xs opacity-40 pl-1'>Provider</p>
						<AutoCompleteInput
							maxChars={256}
							value={embed.provider}
							onChange={v => {
								updateEmbed('provider', v);
							}}
							type='input'
							options={AutocompleteOptions}
						/>
					</div>
					<div>
						<p className='text-xs opacity-40 pl-1'>Author</p>
						<AutoCompleteInput
							maxChars={256}
							value={embed.author}
							onChange={v => {
								updateEmbed('author', v);
							}}
							type='input'
							options={AutocompleteOptions}
						/>
					</div>
					<div>
						<p className='text-xs opacity-40 pl-1'>Title</p>
						<AutoCompleteInput
							maxChars={256}
							value={embed.title}
							onChange={v => {
								updateEmbed('title', v);
							}}
							type='input'
							options={AutocompleteOptions}
						/>
					</div>
					<div>
						<p className='text-xs opacity-40 pl-1'>Color</p>
						<div className='grid grid-cols-2 gap-2'>
							<input
								className='h-full w-full bg-primary rounded-lg'
								type='color'
								value={embed.color}
								onChange={e => {
									updateEmbed('color', e.target.value);
								}}
							/>
							<AutoCompleteInput
								value={embed.color}
								onChange={v => {
									updateEmbed('color', v);
								}}
								type='input'
							/>
						</div>
					</div>
					<div className='col-span-2'>
						<p className='text-xs opacity-40 pl-1'>Description</p>
						<AutoCompleteInput
							maxChars={4096}
							value={embed.description}
							onChange={v => {
								updateEmbed('description', v);
							}}
							type='textarea'
							options={AutocompleteOptions}
						/>
					</div>
				</div>
				<AnimatePresence>
					{openSaveModal && (
						<motion.div
							initial={{ opacity: 0, scale: 0.75 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.75 }}
							transition={{ duration: 0.2 }}
							className='absolute bottom-5 right-5 bg-secondary p-2 rounded-md mx-3 flex items-center gap-2 '
						>
							<p className='text-2xl font-bold'>Unsaved Changes</p>
							<div className='flex'>
								<div
									onClick={saveEmbed}
									className='bg-green-400 hover:bg-opacity-75 rounded-l-md p-2 flex items-center gap-2 cursor-pointer'
								>
									<FaSave />
									<p className='text-xl font-black'>Save</p>
								</div>
								<div
									onClick={resetEmbed}
									className='bg-red-400 hover:bg-opacity-75 rounded-r-md p-2 flex items-center gap-2 cursor-pointer'
								>
									<FaUndo />
									<p className='text-xl font-black'>Revert</p>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<div className='bg-primary p-3 rounded-lg shadow-lg col-span-2 md:col-span-1'>
				<div className='flex mb-5 overflow-scroll scrollbar-hide'>
					{Object.keys(tabs).map((tab: tabsType) => (
						<div
							key={tab}
							onClick={() => {
								setTab(tab);
							}}
							className='relative inline-flex justify-center items-center group'
						>
							{currentTab === tab && (
								<motion.div
									className='absolute inset-0 rounded-lg bg-x3 bg-opacity-50 z-20'
									layoutId={'underine'}
									style={{ transform: 'none', transformOrigin: '50% 50% 0px' }}
								/>
							)}
							<div
								className={`bg-secondary p-3 shadow-lg z-10 h-full flex items-center font-medium py-2 px-5 transition-all group-first:rounded-l-lg group-last:rounded-r-lg ${
									currentTab === tab ? 'text-lg' : 'text-md'
								}`}
							>
								<p className='text-xl font-bold'>{tab}</p>
							</div>
						</div>
					))}
				</div>
				{tabs[currentTab]}
			</div>
		</div>
	);
}
