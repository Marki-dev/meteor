import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaCogs, FaMeteor, FaUserAlt } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/hooks/UserHook';
import Link from 'next/link';
import { type UserContextType } from '@/context/userContext';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function NavBar() {
	const userContext = useUser();

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: any) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div>
			<div className='bg-nav min-h-[4rem] flex justify-between items-center px-3'>
				<div className='flex items-center justify-center gap-3'>
					<FaMeteor className='text-3xl' />
					<p className='meteor-text text-4xl'>Meteor</p>
				</div>
				{userContext?.user ? (
					<div
						onClick={() => {
							setDropdownOpen(!dropdownOpen);
						}}
						className='flex items-center gap-3 hover:bg-x3 p-1 rounded-md hover:bg-opacity-40'
					>
						<p className='font-bold hidden md:flex'>
							{userContext.user?.username || 'Loading'}
						</p>
						<img
							className='h-10 rounded-md'
							src='https://avatars.githubusercontent.com/u/45541936?v=4t'
						/>
						<FaChevronDown
							className={(dropdownOpen ? 'rotate-180' : '') + ' duration-500'}
						/>
					</div>
				) : (
					<Link href='/login'>
						<div className='bg-secondary p-3 rounded-lg cursor-pointer hover:bg-opacity-80'>
							Log In
						</div>
					</Link>
				)}
			</div>
			<AnimatePresence>
				{dropdownOpen && (
					<motion.div
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 10, opacity: 1 }}
						exit={{ y: 10, opacity: 0 }}
						transition={{ duration: 0.5 }}
						className='absolute right-3 z-50'
						ref={dropdownRef}
					>
						<div className='bg-primary p-3 rounded-lg shadow-lg text-start'>
							<div className='pb-3'>
								<img
									className='max-w-screen-md w-48 rounded-full hover:rotate-12 duration-150 transition-all'
									src='https://avatars.githubusercontent.com/u/45541936?v=4t'
								/>
								<p className='font-bold text-xl'>
									{userContext?.user?.username}
								</p>
								<p className='text-sm font-medium opacity-40'>
									{userContext?.user?.email}
								</p>
							</div>
							<div className='w-full p-2 rounded-md hover:bg-x3 hover:bg-opacity-20 flex items-center gap-2  font-bold'>
								<FaUserAlt />
								<p>Profile</p>
							</div>
							<div className='w-full p-2 rounded-md hover:bg-x3 hover:bg-opacity-20 flex items-center gap-2  font-bold'>
								<FaCogs />
								<p>Settings</p>
							</div>
							<div className='w-full h-[1px] bg-white opacity-50 my-2' />
							<Logout userContext={userContext ?? undefined} />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function Logout({ userContext }: { userContext: UserContextType | undefined }) {
	const [loading, setLoading] = useState(false);

	async function handleLogout() {
		setLoading(true);
		userContext?.logout();
		setLoading(false);
	}

	return (
		<div
			onClick={handleLogout}
			className='w-full p-2 rounded-md hover:bg-x3 hover:bg-opacity-20 flex items-center gap-2 text-red-400 font-bold'
		>
			{loading ? <AiOutlineLoading3Quarters /> : <BiLogOut />}
			<p>Log Out</p>
		</div>
	);
}
