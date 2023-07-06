import { AnimatePresence } from 'framer-motion';
import { useState, type FC } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/reusable/Input';

type ConfigType = {
	defaultAdminUsername?: string;
	defaultAdminPassword?: string;
	defaultAdminEmail?: string;
};
export default function ConfigSetup() {
	const [configData, setConfigData] = useState<ConfigType>({});

	const panes: Array<{ element: JSX.Element; conditions?: boolean[] }> = [
		{
			element: <WelcomePane />,
		},
		{
			element: <MotionWrapper children={<AdminAccount />} />,
			conditions: [
				Boolean(configData.defaultAdminUsername),
				Boolean(configData.defaultAdminPassword),
				Boolean(configData.defaultAdminEmail),
				checkPassword(configData.defaultAdminPassword ?? ''),
			],
		},
		{
			element: <MotionWrapper children={<WelcomePane />} />,
			conditions: [
				Boolean(configData.defaultAdminUsername),
				Boolean(configData.defaultAdminPassword),
				Boolean(configData.defaultAdminEmail),
				checkPassword(configData.defaultAdminPassword ?? ''),
			],
		},
		{
			element: <MotionWrapper children={<AdminAccount />} />,
			conditions: [
				Boolean(configData.defaultAdminUsername),
				Boolean(configData.defaultAdminPassword),
				Boolean(configData.defaultAdminEmail),
				checkPassword(configData.defaultAdminPassword ?? ''),
			],
		},
	];
	const [pane, setPane] = useState(0);
	const thisPane = panes[pane];

	function handleNextButtonClicked() {
		if (pane === panes.length - 1) return;
		if (thisPane.conditions) {
			if (thisPane.conditions.every(condition => condition)) {
				setPane(pane + 1);
			}
		} else {
			setPane(pane + 1);
		}
	}

	const nextButtonActive =
		thisPane.conditions?.every(condition => condition) ?? true;

	function handlePreviousButtonClicked() {
		if (pane === 0) return;
		setPane(pane - 1);
	}

	function checkPassword(password: string) {
		if (password.length < 9) return false;
		if (password.length > 256) return false;
		// Test to make sure the password has at least 1 capital, one lower case, one number and one special character
		const d =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;
		if (!d.test(password)) return false;
		return true;
	}

	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='bg-secondary p-3 rounded-lg overflow-x-hidden w-[90vw] md:w-auto md:max-w-md'>
				<h1 className='text-3xl font-black text-center md:text-start'>
					Welcome to <span className='meteor-text'>Meteor</span>
				</h1>
				<div className='flex justify-center'>
					<AnimatePresence>{thisPane.element}</AnimatePresence>
				</div>
				<div className='flex justify-end mt-10'>
					<div className='flex'>
						<div
							onClick={handlePreviousButtonClicked}
							className='bg-primary p-2 rounded-l-md hover:bg-opacity-50'
						>
							Prev
						</div>
						<div
							onClick={handleNextButtonClicked}
							className={`bg-blue-400 p-2 rounded-r-md duration-300 ${
								nextButtonActive
									? 'hover:bg-opacity-50'
									: ' grayscale cursor-not-allowed opacity-25'
							}`}
						>
							Next
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function MotionWrapper({ children }: any) {
	return (
		<motion.div
			initial={{ translateX: '50vw' }}
			animate={{ translateX: '0vw' }}
			exit={{ translateX: '-50vw' }}
			transition={{ duration: 1 }}
		>
			{children}
		</motion.div>
	);
}

function WelcomePane() {
	return (
		<motion.div
			initial={{ opacity: 0, translateX: '50vw' }}
			animate={{ opacity: 1, translateX: '0vw' }}
			exit={{ translateX: '-50vw' }}
			transition={{ duration: 1 }}
		>
			<div className='flex justify-center'>
				<div className='h-[3px] rounded-full bg-opacity-40 bg-primary w-[90%]' />
			</div>
			<div className='opacity-75 text-sm'>
				<p>
					It appears that you have not set up the Meteor server yet, but dont
					worry, its as simple as well... A Meteor
				</p>
			</div>
		</motion.div>
	);
}

function AdminAccount() {
	return (
		<div className=''>
			<div>
				<p className='opacity-25 text-sm'>Username</p>
				<Input placeholder='Username' />
			</div>
			<div>
				<p className='opacity-25 text-sm'>Password</p>
				<Input type='password' placeholder='Password' />
			</div>
			<div>
				<p className='opacity-25 text-sm'>Email</p>
				<Input placeholder='Email' />
			</div>
		</div>
	);
}
