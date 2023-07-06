import { useEffect, useRef, useState } from 'react';
import DiscordPreview from '../DiscordPreview';
import TwitterPreview from '../TwitterPreview';
import checkObjectDifference from '@/util/universal/checkObjectDifference';
import AutoCompleteInput from '@/components/reusable/autocomplete';
import { AnimatePresence, motion } from 'framer-motion';
import {
	FaCheckCircle,
	FaChevronDown,
	FaPlus,
	FaSave,
	FaTrashAlt,
	FaTruckLoading,
	FaUndo,
} from 'react-icons/fa';
import MeteorFetch from '@/util/web/MeteorFetch';
import Input from '@/components/reusable/Input';

export type EmbedType = {
	id?: string;
	name?: string;
	enabled?: boolean;
	title?: string;
	description?: string;
	color?: string;
	author?: string;
	provider?: string;
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
	const [userEmbeds, setUserEmbeds] = useState<EmbedType[]>([]);
	const [embed, setEmbed] = useState<EmbedType | undefined>(undefined);
	const [firstEmbed, setFirstEmbed] = useState<EmbedType>();

	const [createModal, setCreateModal] = useState(false);

	useEffect(() => {
		fetchEmbeds();
	}, []);

	function fetchEmbeds() {
		void MeteorFetch('/me/embeds', {
			method: 'GET',
		}).then(embeds => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			setUserEmbeds(embeds);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			setMasterEmbed(embeds[0]);
		});
	}

	async function handleEmbedSelect(embedName: string) {
		const embed = userEmbeds.find(e => e.name === embedName);
		if (!embed) {
			return;
		}

		setMasterEmbed(embed);
	}

	function setMasterEmbed(embed: EmbedType) {
		setFirstEmbed(embed);
		setEmbed(embed);
	}

	function resetEmbed() {
		setEmbed(firstEmbed);
	}

	function saveEmbed() {
		void MeteorFetch('/me/embeds', {
			method: 'POST',
			body: JSON.stringify(embed),
		}).then(() => {
			fetchEmbeds();
		});
	}

	function updateEmbed(
		key: keyof EmbedType,
		value: string | undefined | boolean
	) {
		setEmbed((embed: EmbedType | undefined) => {
			if (key === 'id' && typeof value === 'undefined') {
				return { ...embed, [key]: undefined };
			}

			return { ...embed, [key]: value };
		});
	}

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

	const openSaveModal = checkObjectDifference(firstEmbed, embed);

	return (
		<>
			<CreateEmbedModal
				setClose={() => {
					setCreateModal(false);
				}}
				refetch={fetchEmbeds}
				open={createModal}
			/>
			<div className='grid grid-cols-2 gap-10 h-full'>
				<div className='bg-primary p-3 rounded-lg shadow-lg  col-span-2 md:col-span-1 relative pb-24'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-4xl font-bold'>Embed Settings</p>
							<p className='text-xl font-bold opacity-50'>
								Customize the look of your embeds
							</p>
						</div>
						<SelectorDropdown
							options={userEmbeds.map((e, i) => e.name)}
							onSelect={handleEmbedSelect}
							onCreate={() => {
								setCreateModal(true);
							}}
						/>
					</div>
					<div className='grid grid-cols-2 gap-3'>
						<div className='col-span-2'>
							<p className='text-xs opacity-40 pl-1'>Enabled</p>
						</div>
						<div>
							<p className='text-xs opacity-40 pl-1'>Provider</p>
							<AutoCompleteInput
								maxChars={256}
								value={embed?.provider}
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
								value={embed?.author}
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
								value={embed?.title}
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
									value={embed?.color}
									onChange={e => {
										updateEmbed('color', e.target.value);
									}}
								/>
								<AutoCompleteInput
									value={embed?.color}
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
								value={embed?.description}
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
										style={{
											transform: 'none',
											transformOrigin: '50% 50% 0px',
										}}
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
		</>
	);
}

type ModalProps = {
	open: boolean;
	setClose: () => void;
	refetch: () => void;
};

function CreateEmbedModal({ open, setClose, refetch }: ModalProps) {
	const [loading, setLoading] = useState(false);
	const [createdEmbedName, setCreatedEmbedName] = useState('');

	function createEmbed(name: string) {
		const embed = {
			name,
		};
		setLoading(true);
		// Perform the embed creation logic here
		void MeteorFetch('/me/embeds/', {
			method: 'POST',
			body: JSON.stringify(embed),
		}).then(() => {
			setLoading(false);
			setCreatedEmbedName('');
			setClose();
			refetch();
		});
	}

	const handleOverlayClick = (event: any) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		if (event.target.classList.contains('overlay')) {
			setClose();
		}
	};

	const handleCreateButtonClick = (event: React.MouseEvent) => {
		event.stopPropagation(); // Prevent the click event from propagating to the overlay
		createEmbed(createdEmbedName);
		setClose();
	};

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 overlay'
					onClick={handleOverlayClick}
				>
					<div className='bg-primary rounded-lg shadow-lg p-5'>
						<p className='text-2xl font-bold'>Create Embed</p>
						<div className='flex items-center justify-between mt-5 gap-2'>
							<Input
								placeholder='Embed Name'
								onChange={e => {
									setCreatedEmbedName(e);
								}}
							/>
							<button
								className='bg-green-500 hover:bg-opacity-80 p-2.5 rounded-lg'
								onClick={handleCreateButtonClick}
							>
								{loading ? <FaTruckLoading /> : 'Create'}
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

type SelectorDropdownProps = {
	options: any[];
	onCreate?: () => void;
	onSelect: (item: any) => void;
	onDelete?: (item: any) => void;
};
function SelectorDropdown({
	onCreate,
	onSelect,
	onDelete,
	options,
}: SelectorDropdownProps) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const [selectedItem, setSelectedItem] = useState(options[0]);
	const [isOpen, setIsOpen] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleDropdownToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleItemClick = (item: any) => {
		console.log('Selected item', item);
		setSelectedItem(item);
		setIsOpen(false);
		onSelect(item);
	};

	const handleOutsideClick = (event: any) => {
		if (
			dropdownRef.current &&
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			!dropdownRef?.current?.contains?.(event.target)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		if (!options.includes(selectedItem)) {
			setSelectedItem(options[0]);
		}
	}, [options, selectedItem]);

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	return (
		<div className='relative' ref={dropdownRef}>
			<div
				className={
					(isOpen ? 'open' : '') +
					' bg-secondary p-3 rounded-lg shadow-lg cursor-pointer font-semibold flex items-center gap-2'
				}
				onClick={handleDropdownToggle}
			>
				{selectedItem || 'Select an item'}
				<div>
					<FaChevronDown
						className={(isOpen ? 'rotate-180' : '') + ' duration-500'}
					/>
				</div>
			</div>
			<AnimatePresence>
				{isOpen && (
					<motion.ul
						className='absolute z-10 right-0 mt-2 py-2 px-3 shadow-lg bg-secondary rounded-lg min-w-[15rem]'
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
					>
						{options.map((item, index) => (
							<div
								key={index}
								onClick={() => {
									handleItemClick(item);
								}}
								className='cursor-pointer py-1 bg-x3 hover:bg-opacity-60 duration-500 p-3 first:rounded-t-md flex items-center justify-between gap-2'
							>
								{item}
								{selectedItem === item && (
									<div className='group'>
										<FaCheckCircle className='text-green-500 group-hover:hidden' />
										<FaTrashAlt
											onClick={() => onDelete?.(item)}
											className='text-red-500 hidden group-hover:flex'
										/>
									</div>
								)}
							</div>
						))}
						<div
							onClick={onCreate}
							className='cursor-pointer py-1 bg-green-500 duration-500 p-3 hover:opacity-75 flex items-center gap-2 rounded-b-md'
						>
							<FaPlus />
							Create
						</div>
					</motion.ul>
				)}
			</AnimatePresence>
		</div>
	);
}
